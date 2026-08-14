import { assertPaidRulesListingAllowed } from './rules-policy.js';

/** Paid download authorization status codes — no payment SDK in core. */
export type RulesAuthStatus = 200 | 401 | 402 | 403;

export interface RulesDownloadAuthContext {
  paid?: boolean;
  token?: string;
}

/**
 * Port for external authorization services. Core only consumes status codes.
 */
export interface RulesDownloadAuthPort {
  authorizeDownload(
    itemId: string,
    context?: RulesDownloadAuthContext,
  ): Promise<RulesAuthStatus> | RulesAuthStatus;
}

export class RulesDownloadAuthError extends Error {
  constructor(
    message: string,
    readonly status: RulesAuthStatus,
    readonly itemId: string,
  ) {
    super(message);
    this.name = 'RulesDownloadAuthError';
  }
}

function formatAuthError(itemId: string, status: RulesAuthStatus): string {
  const reason =
    status === 401
      ? 'download authorization is required.'
      : status === 402
        ? 'a paid license is required for this discipline pack.'
        : 'this discipline pack cannot be sold or downloaded as paid rules.';
  const next =
    status === 401
      ? 'provide a valid CU_REGISTRY_TOKEN or license token to the auth adapter.'
      : status === 402
        ? 'purchase or activate a license through the external authorization service.'
        : 'choose a community-original pack id or install the free homage theme instead.';
  return [
    'Discipline pack download blocked.',
    `Path: ${itemId}`,
    `Reason: ${reason}`,
    `Next: ${next}`,
  ].join('\n');
}

/**
 * Ensures paid downloads are authorized before install-core writes files.
 */
export async function assertRulesDownloadAuthorized(
  port: RulesDownloadAuthPort,
  itemId: string,
  context?: RulesDownloadAuthContext,
): Promise<void> {
  if (context?.paid) {
    assertPaidRulesListingAllowed(itemId);
  }
  const status = await port.authorizeDownload(itemId, context);
  if (status === 200) return;
  throw new RulesDownloadAuthError(formatAuthError(itemId, status), status, itemId);
}

/**
 * Default stub adapter: free packs always pass; paid packs require a token and
 * still enforce homage / community-prefix policy in core.
 */
export function createStubRulesDownloadAuth(
  options: { validToken?: string } = {},
): RulesDownloadAuthPort {
  const validToken = options.validToken ?? 'cu-rules-license';
  return {
    authorizeDownload(itemId, context) {
      if (!context?.paid) return 200;
      assertPaidRulesListingAllowed(itemId);
      if (!context.token || context.token !== validToken) {
        return context.token ? 402 : 401;
      }
      return 200;
    },
  };
}
