import { describe, expect, it } from 'vitest';
import {
  listingApplicationFromThemeStudioExport,
  parseThemeStudioExport,
  ThemeStudioExportError,
  type ThemeStudioExportPayload,
} from './from-theme-studio.js';
import { CommunityPrefixError } from './guard.js';
import { checkA11y, checkLicense, checkRtl, checkRules } from './validators.js';
import { createListingStore } from './listings.js';
import { createMarketServer } from './server.js';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function studioExport(overrides: Partial<ThemeStudioExportPayload> = {}): ThemeStudioExportPayload {
  return {
    generator: 'theme-studio',
    exportedAt: '2026-08-15T00:00:00.000Z',
    themeId: 'linear',
    meta: { label: 'Line', description: 'Flagship line homage' },
    extends: 'linear',
    tokens: { radius: { md: { $value: { value: 2, unit: 'px' } } } },
    removedTokenPaths: [],
    designRules: {
      version: '1.0',
      typography: { scale: 'major-third', lineHeightBody: 1.5 },
      spacing: { rhythm: 8 },
      colorBoundaries: { accentUsage: 'primary-actions-only' },
      rtl: { supported: true, strategy: 'logical-properties-only' },
    },
    ...overrides,
  };
}

describe('listingApplicationFromThemeStudioExport', () => {
  it('maps studio export to a community ListingApplication that passes validators', () => {
    const application = listingApplicationFromThemeStudioExport(studioExport(), {
      id: 'community-linear-dense',
      name: 'Line Dense',
      description: 'Studio-derived dense line',
      license: 'MIT',
    });

    expect(application.id).toBe('community-linear-dense');
    expect(application.type).toBe('registry:theme');
    expect(application.files.map((f) => f.path)).toEqual([
      'design-rules.json',
      'tokens.json',
      'meta.json',
      'LICENSE',
      'theme.css',
    ]);

    const tokens = JSON.parse(
      application.files.find((f) => f.path === 'tokens.json')!.content,
    ) as Record<string, unknown>;
    expect(tokens.$extends).toBe('linear');
    expect(tokens.radius).toBeTruthy();

    const meta = JSON.parse(
      application.files.find((f) => f.path === 'meta.json')!.content,
    ) as Record<string, unknown>;
    expect(meta.generator).toBe('theme-studio');
    expect(meta.extends).toBe('linear');

    expect(checkRules(application).ok).toBe(true);
    expect(checkRtl(application).ok).toBe(true);
    expect(checkLicense(application).ok).toBe(true);
    expect(checkA11y(application).ok).toBe(true);
  });

  it('rejects missing community- prefix', () => {
    expect(() =>
      listingApplicationFromThemeStudioExport(studioExport(), { id: 'linear-dense' }),
    ).toThrow(CommunityPrefixError);
  });

  it('rejects non-studio payloads via parseThemeStudioExport', () => {
    expect(() => parseThemeStudioExport({ generator: 'other' })).toThrow(ThemeStudioExportError);
  });

  it('applies and installs through market-service', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'cu-studio-market-'));
    const store = createListingStore();
    const server = await createMarketServer({ store });
    try {
      const application = listingApplicationFromThemeStudioExport(studioExport(), {
        id: 'community-studio-loop',
        name: 'Studio Loop',
      });
      const applyRes = await fetch(`${server.url}/v1/listings/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      expect(applyRes.status).toBe(201);
      const applyBody = (await applyRes.json()) as { listing: { status: string } };
      expect(applyBody.listing.status).toBe('approved');

      const installRes = await fetch(`${server.url}/v1/listings/community-studio-loop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDir: dir }),
      });
      expect(installRes.status).toBe(200);
      const meta = await readFile(join(dir, 'meta.json'), 'utf-8');
      expect(meta).toContain('theme-studio');
      expect(meta).toContain('"extends": "linear"');
    } finally {
      await server.close();
      await rm(dir, { recursive: true, force: true });
    }
  });
});
