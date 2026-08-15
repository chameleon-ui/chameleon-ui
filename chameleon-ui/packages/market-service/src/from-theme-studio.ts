import {
  COMMUNITY_PREFIX,
  HOMAGE_THEME_IDS,
  type ListingApplication,
  type PricingZone,
} from './contracts.js';
import { CommunityPrefixError } from './guard.js';

/**
 * Minimal shape of `apps/theme-studio` `ExportPayload`.
 * Kept here so market-service does not depend on the studio app.
 */
export interface ThemeStudioExportPayload {
  generator: 'theme-studio';
  exportedAt?: string;
  themeId: string;
  meta?: {
    label?: string;
    description?: string;
    [key: string]: unknown;
  };
  /** Base homage theme id the export derives from. */
  extends: string;
  tokens: Record<string, unknown>;
  removedTokenPaths?: string[];
  designRules: Record<string, unknown>;
}

export interface ThemeStudioImportOptions {
  /** Community listing id; must start with `community-`. */
  id: string;
  name?: string;
  description?: string;
  pricing?: PricingZone;
  license?: string;
}

export class ThemeStudioExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThemeStudioExportError';
  }
}

export function isThemeStudioExport(value: unknown): value is ThemeStudioExportPayload {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    record.generator === 'theme-studio' &&
    typeof record.themeId === 'string' &&
    typeof record.extends === 'string' &&
    typeof record.designRules === 'object' &&
    record.designRules !== null &&
    typeof record.tokens === 'object' &&
    record.tokens !== null
  );
}

/**
 * Maps a Theme Studio export JSON into a market `ListingApplication`.
 * Community ids only — homage ids stay as seeded free official SKUs.
 */
export function listingApplicationFromThemeStudioExport(
  payload: ThemeStudioExportPayload,
  options: ThemeStudioImportOptions,
): ListingApplication {
  if (payload.generator !== 'theme-studio') {
    throw new ThemeStudioExportError('generator must be "theme-studio"');
  }
  if (!HOMAGE_THEME_IDS.has(payload.extends) && !HOMAGE_THEME_IDS.has(payload.themeId)) {
    throw new ThemeStudioExportError(
      `extends/themeId must be an official homage id (got extends="${payload.extends}", themeId="${payload.themeId}")`,
    );
  }

  const id = options.id.trim();
  if (!id.startsWith(COMMUNITY_PREFIX)) {
    throw new CommunityPrefixError(id);
  }
  if (HOMAGE_THEME_IDS.has(id)) {
    throw new ThemeStudioExportError(
      `Listing id "${id}" collides with an official homage theme; use a community- id`,
    );
  }

  const baseId = HOMAGE_THEME_IDS.has(payload.extends) ? payload.extends : payload.themeId;
  const label = payload.meta?.label ?? baseId;
  const name = (options.name ?? label).trim() || `Community ${label}`;
  const description =
    (options.description ??
      payload.meta?.description ??
      `Theme Studio export derived from ${baseId} ($extends delta).`).trim();
  const pricing = options.pricing ?? 'free';
  const license = (options.license ?? 'MIT').trim() || 'MIT';
  const removed = payload.removedTokenPaths ?? [];

  const tokensDoc: Record<string, unknown> = {
    $extends: baseId,
    ...payload.tokens,
  };

  const metaDoc = {
    id,
    kind: 'community',
    generator: 'theme-studio',
    extends: baseId,
    sourceThemeId: payload.themeId,
    exportedAt: payload.exportedAt ?? null,
    removedTokenPaths: removed,
    pricing: { paid: pricing === 'paid' },
  };

  return {
    id,
    type: 'registry:theme',
    name,
    description,
    pricing,
    license,
    files: [
      {
        path: 'design-rules.json',
        content: `${JSON.stringify(payload.designRules, null, 2)}\n`,
      },
      {
        path: 'tokens.json',
        content: `${JSON.stringify(tokensDoc, null, 2)}\n`,
      },
      {
        path: 'meta.json',
        content: `${JSON.stringify(metaDoc, null, 2)}\n`,
      },
      { path: 'LICENSE', content: `${license} License\n` },
      {
        path: 'theme.css',
        content:
          '/* a11y: focus-visible outline for keyboard navigation */\n' +
          `/* derived from ${baseId} via theme-studio */\n` +
          ':root { margin-inline: 0; }\n' +
          ':focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }\n',
      },
    ],
    dependencies: [],
  };
}

/** Parse unknown JSON (file upload / paste) into a validated studio export. */
export function parseThemeStudioExport(raw: unknown): ThemeStudioExportPayload {
  if (!isThemeStudioExport(raw)) {
    throw new ThemeStudioExportError(
      'Not a Theme Studio export: expected generator="theme-studio", themeId, extends, tokens, designRules',
    );
  }
  return raw;
}
