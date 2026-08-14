import {
  assertRulesDownloadAuthorized,
  createStubRulesDownloadAuth,
  type RulesDownloadAuthContext,
  type RulesDownloadAuthPort,
} from '@chameleon-ui/install-core';
import type { RegistryItem } from './catalog.js';

export {
  assertRulesDownloadAuthorized,
  createStubRulesDownloadAuth,
  type RulesAuthStatus,
  type RulesDownloadAuthContext,
  type RulesDownloadAuthPort,
} from '@chameleon-ui/install-core';

export interface RulesPackMeta {
  id: string;
  label: string;
  kind: 'community' | 'official';
  pricing?: {
    paid?: boolean;
  };
}

export function parseRulesPackMeta(item: RegistryItem): RulesPackMeta | undefined {
  if (item.type !== 'registry:rules') return undefined;
  const metaFile = item.files.find((file) => file.path.endsWith('/meta.json'));
  if (!metaFile) return undefined;
  try {
    return JSON.parse(metaFile.content) as RulesPackMeta;
  } catch {
    return undefined;
  }
}

export function isRulesPackItem(item: RegistryItem): boolean {
  return item.type === 'registry:rules';
}

export async function authorizeRulesPackDownload(
  item: RegistryItem,
  port: RulesDownloadAuthPort = createStubRulesDownloadAuth(),
  context: RulesDownloadAuthContext = {},
): Promise<void> {
  if (!isRulesPackItem(item)) return;
  const meta = parseRulesPackMeta(item);
  const paid = context.paid ?? meta?.pricing?.paid === true;
  await assertRulesDownloadAuthorized(port, item.id, { ...context, paid });
}
