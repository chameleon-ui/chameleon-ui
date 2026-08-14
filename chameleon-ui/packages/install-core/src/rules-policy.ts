/** Official homage theme ids — free SKUs; not sold as paid discipline packs. The market may still list paid community packs. */
export const OFFICIAL_HOMAGE_RULES_IDS = [
  'line',
  'silver-arrow',
  'stuttgart',
  'corsa',
  'cupertino',
  'siren',
  'wechat',
  'ant-blue',
] as const;

export type OfficialHomageRulesId = (typeof OFFICIAL_HOMAGE_RULES_IDS)[number];

export function isOfficialHomageRulesId(id: string): id is OfficialHomageRulesId {
  return (OFFICIAL_HOMAGE_RULES_IDS as readonly string[]).includes(id);
}

export class RulesListingPolicyError extends Error {
  constructor(
    message: string,
    readonly itemId: string,
    readonly reason: 'official_homage_id' | 'missing_community_prefix',
  ) {
    super(message);
    this.name = 'RulesListingPolicyError';
  }
}

/**
 * Blocks paid listings for official homage ids and enforces the community prefix
 * policy for paid community discipline packs.
 *
 * @guarantees U9 errors include path, reason, and next step
 */
export function assertPaidRulesListingAllowed(itemId: string): void {
  if (isOfficialHomageRulesId(itemId)) {
    throw new RulesListingPolicyError(
      [
        'Paid discipline pack listing blocked.',
        `Path: ${itemId}`,
        'Reason: official homage theme ids cannot be sold as paid rules.',
        'Next: use a community-original id such as community-<slug> for paid packs.',
      ].join('\n'),
      itemId,
      'official_homage_id',
    );
  }

  if (!itemId.startsWith('community-')) {
    throw new RulesListingPolicyError(
      [
        'Paid discipline pack listing blocked.',
        `Path: ${itemId}`,
        'Reason: paid community packs must use the community- id prefix.',
        'Next: rename the listing id to community-<slug> or mark the pack as free.',
      ].join('\n'),
      itemId,
      'missing_community_prefix',
    );
  }
}
