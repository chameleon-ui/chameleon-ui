import type { RegistryFile, RegistryItem } from '@chameleon-ui/install-core';

/** Official homage theme ids. They ship as free SKUs (not paid listings). */
export const HOMAGE_THEME_IDS = new Set([
  'line',
  'silver-arrow',
  'stuttgart',
  'corsa',
  'cupertino',
  'siren',
  'wechat',
  'ant-blue',
]);

/** Required prefix for community-authored marketplace listings. */
export const COMMUNITY_PREFIX = 'community-';

export type ListingType = 'registry:theme' | 'registry:rules';

export type ListingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'human-review';

export type PricingZone = 'free' | 'paid';

export interface ListingValidationCheck {
  id: string;
  ok: boolean;
  message: string;
}

export interface ListingValidationReport {
  ok: boolean;
  checks: ListingValidationCheck[];
}

export interface ThemeListing {
  id: string;
  type: ListingType;
  name: string;
  description: string;
  pricing: PricingZone;
  license: string;
  files: RegistryFile[];
  dependencies?: string[];
  status: ListingStatus;
  submittedAt: string;
  validationReport: ListingValidationReport;
}

/** Discipline-pack listing. Same store shape as ThemeListing; type is frozen to registry:rules. */
export type RulesListing = ThemeListing & { type: 'registry:rules' };

export interface ListingApplication {
  id: string;
  type: ListingType;
  name: string;
  description: string;
  pricing: PricingZone;
  license: string;
  files: RegistryFile[];
  dependencies?: string[];
}

export interface ListingInstallRequest {
  targetDir: string;
  source?: 'market';
  session?: string;
}

export interface MarketListingResult {
  listings: ThemeListing[];
}

export interface MarketListingDetail {
  listing: ThemeListing;
}

export function toRegistryItem(listing: ThemeListing): RegistryItem {
  return {
    id: listing.id,
    type: listing.type,
    name: listing.name,
    files: listing.files,
    dependencies: listing.dependencies ?? [],
    namespace: 'community',
    version: '0.0.0',
  };
}
