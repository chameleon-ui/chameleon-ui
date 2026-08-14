import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { assertPaidRulesListingAllowed } from '@chameleon-ui/install-core';
import {
  COMMUNITY_PREFIX,
  HOMAGE_THEME_IDS,
  type ListingApplication,
  type ListingStatus,
  type ListingValidationReport,
  type RulesListing,
  type ThemeListing,
} from './contracts.js';
import { defaultValidators, type ListingValidator } from './validators.js';
import { guardCommunityPrefix, guardHomagePaidZone } from './guard.js';

const require = createRequire(import.meta.url);

export const COMMUNITY_FOCUS_FIRST_ID = 'community-focus-first';

export interface ListingStore {
  get(id: string): ThemeListing | undefined;
  list(): ThemeListing[];
  apply(application: ListingApplication): ThemeListing;
  approve(id: string): ThemeListing | undefined;
  reject(id: string, reason: string): ThemeListing | undefined;
  reserveForHumanReview(id: string): ThemeListing | undefined;
}

export interface CreateListingStoreOptions {
  initial?: ThemeListing[];
  validators?: ListingValidator[];
  /** When true, failed auto-checks send the listing to human review instead of rejecting. @reserved */
  humanReviewOnFailure?: boolean;
}

function runValidation(
  application: ListingApplication,
  validators: ListingValidator[],
): ListingValidationReport {
  const checks = validators.map((validate) => validate(application));
  return {
    ok: checks.every((check) => check.ok),
    checks,
  };
}

function determineStatus(
  report: ListingValidationReport,
  humanReviewOnFailure: boolean,
): ListingStatus {
  if (report.ok) return 'approved';
  if (humanReviewOnFailure) return 'human-review';
  return 'rejected';
}

function readThemeExport(subpath: string): string {
  return readFileSync(require.resolve(`@chameleon-ui/themes/${subpath}`), 'utf8');
}

export function createListingStore(options: CreateListingStoreOptions = {}): ListingStore {
  const listings = new Map<string, ThemeListing>(
    (options.initial ?? []).map((listing) => [listing.id, listing]),
  );
  const validators = options.validators ?? defaultValidators;
  const humanReviewOnFailure = options.humanReviewOnFailure ?? false;

  return {
    get(id) {
      return listings.get(id);
    },
    list() {
      return Array.from(listings.values()).sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );
    },
    apply(application) {
      // Official homage ids are free SKUs; paid community packs are allowed.
      guardHomagePaidZone(application);
      guardCommunityPrefix(application);
      if (application.pricing === 'paid' && application.type === 'registry:rules') {
        assertPaidRulesListingAllowed(application.id);
      }

      const report = runValidation(application, validators);
      const status = determineStatus(report, humanReviewOnFailure);
      const listing: ThemeListing = {
        ...application,
        status,
        submittedAt: new Date().toISOString(),
        validationReport: report,
      };
      listings.set(listing.id, listing);
      return listing;
    },
    approve(id) {
      const existing = listings.get(id);
      if (!existing) return undefined;
      const updated: ThemeListing = { ...existing, status: 'approved' };
      listings.set(id, updated);
      return updated;
    },
    reject(id, reason) {
      const existing = listings.get(id);
      if (!existing) return undefined;
      const updated: ThemeListing = {
        ...existing,
        status: 'rejected',
        validationReport: {
          ...existing.validationReport,
          checks: [
            ...existing.validationReport.checks,
            { id: 'review.manual', ok: false, message: reason },
          ],
        },
      };
      listings.set(id, updated);
      return updated;
    },
    reserveForHumanReview(id) {
      const existing = listings.get(id);
      if (!existing) return undefined;
      const updated: ThemeListing = { ...existing, status: 'human-review' };
      listings.set(id, updated);
      return updated;
    },
  };
}

const OFFICIAL_FREE_THEME_LABELS: Record<string, string> = {
  line: 'Line',
  'silver-arrow': 'Silver Arrow',
  stuttgart: 'Stuttgart',
  corsa: 'Corsa',
  cupertino: 'Cupertino',
  siren: 'Siren',
  wechat: 'Wechat',
  'ant-blue': 'Ant Blue',
};

const OFFICIAL_FREE_THEME_ORDER = [
  'line',
  'silver-arrow',
  'stuttgart',
  'corsa',
  'cupertino',
  'siren',
  'wechat',
  'ant-blue',
] as const;

export function seedOfficialFreeListings(): ThemeListing[] {
  const submittedAt = new Date().toISOString();
  return OFFICIAL_FREE_THEME_ORDER.filter((id) => HOMAGE_THEME_IDS.has(id)).map((id) => ({
    id,
    type: 'registry:theme' as const,
    name: `${OFFICIAL_FREE_THEME_LABELS[id] ?? id} (Official Homage)`,
    description:
      'Official homage theme. Free listing (not a paid SKU). Cleared by the project owner on 2026-08-13 (owner confirmation, not a third-party legal opinion).',
    pricing: 'free' as const,
    license: 'MIT',
    files: [
      {
        path: `themes/${id}/design-rules.json`,
        content: readThemeExport(`${id}/design-rules`),
      },
      {
        path: `themes/${id}/tokens.json`,
        content: readThemeExport(`${id}/tokens`),
      },
    ],
    dependencies: [],
    status: 'approved' as const,
    submittedAt,
    validationReport: { ok: true, checks: [] },
  }));
}

export function seedCommunityRulesListings(): RulesListing[] {
  const id = COMMUNITY_FOCUS_FIRST_ID;
  const application: ListingApplication = {
    id,
    type: 'registry:rules',
    name: 'Focus First Discipline',
    description:
      'Community accessibility discipline pack (focus-visible, touch targets, RTL). Community packs may be free or paid; this seed is free.',
    pricing: 'free',
    license: 'MIT',
    files: [
      {
        path: `rules/${id}/design-rules.json`,
        content: readThemeExport('community-focus-first/design-rules'),
      },
      {
        path: `rules/${id}/meta.json`,
        content: readThemeExport('community-focus-first/meta'),
      },
      {
        path: `rules/${id}/tokens.json`,
        content: readThemeExport('community-focus-first/tokens'),
      },
    ],
    dependencies: [],
  };
  const report = runValidation(application, defaultValidators);
  return [
    {
      ...application,
      type: 'registry:rules',
      status: report.ok ? 'approved' : 'rejected',
      submittedAt: new Date().toISOString(),
      validationReport: report,
    },
  ];
}

export function seedMarketCatalog(): ThemeListing[] {
  return [...seedOfficialFreeListings(), ...seedCommunityRulesListings()];
}

export { COMMUNITY_PREFIX };
