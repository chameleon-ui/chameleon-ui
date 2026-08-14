import {
  COMMUNITY_PREFIX,
  HOMAGE_THEME_IDS,
  type ListingApplication,
} from './contracts.js';

export class HomagePaidZoneError extends Error {
  constructor(
    public readonly id: string,
    message = `Theme id "${id}" is an official homage theme and is a free SKU, not a paid listing`,
  ) {
    super(message);
    this.name = 'HomagePaidZoneError';
  }
}

export class CommunityPrefixError extends Error {
  constructor(
    public readonly id: string,
    message = `Community listing id must start with "${COMMUNITY_PREFIX}" (got "${id}")`,
  ) {
    super(message);
    this.name = 'CommunityPrefixError';
  }
}

/**
 * Official homage ids ship as free SKUs. They may be listed for free;
 * they must not be submitted as paid SKUs. The market may still list
 * paid community packs.
 */
export function guardHomagePaidZone(application: ListingApplication): void {
  if (application.pricing !== 'paid') return;
  if (HOMAGE_THEME_IDS.has(application.id)) {
    throw new HomagePaidZoneError(application.id);
  }
}

/**
 * Community-authored listings must use the community- prefix.
 * Official homage ids are catalogued as free official listings and
 * skip this prefix check (paid SKU attempts are rejected above).
 */
export function guardCommunityPrefix(application: ListingApplication): void {
  if (HOMAGE_THEME_IDS.has(application.id)) return;
  if (!application.id.startsWith(COMMUNITY_PREFIX)) {
    throw new CommunityPrefixError(application.id);
  }
}
