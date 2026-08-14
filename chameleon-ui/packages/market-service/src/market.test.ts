import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  COMMUNITY_FOCUS_FIRST_ID,
  createListingStore,
  seedCommunityRulesListings,
  seedMarketCatalog,
  seedOfficialFreeListings,
} from './listings.js';
import { createMarketServer } from './server.js';
import { HomagePaidZoneError } from './guard.js';
import { checkLicense, checkRtl, checkRules } from './validators.js';
import { HOMAGE_THEME_IDS, type ListingApplication } from './contracts.js';

async function makeTemp(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'cu-market-'));
}

function goodDesignRules(): string {
  return JSON.stringify({
    version: '1.0',
    typography: { scale: 'major-third', lineHeightBody: 1.5 },
    spacing: { rhythm: 8 },
    colorBoundaries: { accentUsage: 'primary-actions-only' },
    rtl: { supported: true, strategy: 'logical-properties-only' },
  });
}

function goodApplication(id: string): ListingApplication {
  return {
    id,
    type: 'registry:theme',
    name: 'Community Theme',
    description: 'A community theme that passes validation.',
    pricing: 'free',
    license: 'MIT',
    files: [
      { path: 'design-rules.json', content: goodDesignRules() },
      { path: 'LICENSE', content: 'MIT License' },
      { path: 'theme.css', content: '/* a11y: focus-visible outline for keyboard navigation */\nbody { margin-inline: 1rem; }' },
    ],
    dependencies: [],
  };
}

describe('market-service', () => {
  it('installs a community theme via install-core to the target directory', async () => {
    const dir = await makeTemp();
    const store = createListingStore();
    const server = await createMarketServer({ store });
    try {
      const application = goodApplication('community-ocean');
      const applyRes = await fetch(`${server.url}/v1/listings/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      expect(applyRes.status).toBe(201);

      const installRes = await fetch(`${server.url}/v1/listings/community-ocean`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDir: dir }),
      });
      expect(installRes.status).toBe(200);
      const body = (await installRes.json()) as { result: { written: string[] } };
      expect(body.result.written).toContain('design-rules.json');
      expect(body.result.written).toContain('LICENSE');
      expect(body.result.written).toContain('theme.css');

      const css = await readFile(join(dir, 'theme.css'), 'utf-8');
      expect(css).toContain('margin-inline');
    } finally {
      await server.close();
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('rejects an official homage id in the paid zone', async () => {
    const store = createListingStore();
    const server = await createMarketServer({ store });
    try {
      const application: ListingApplication = {
        ...goodApplication('line'),
        pricing: 'paid',
      };
      const res = await fetch(`${server.url}/v1/listings/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('homage_paid_zone');
    } finally {
      await server.close();
    }
  });

  it('accepts an official homage id as a free listing', async () => {
    const store = createListingStore();
    const server = await createMarketServer({ store });
    try {
      const application: ListingApplication = {
        ...goodApplication('line'),
        pricing: 'free',
        name: 'Line',
        description: 'Official homage theme listed as free.',
      };
      const res = await fetch(`${server.url}/v1/listings/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { listing: { id: string; pricing: string; status: string } };
      expect(body.listing.id).toBe('line');
      expect(body.listing.pricing).toBe('free');
      expect(body.listing.status).toBe('approved');
    } finally {
      await server.close();
    }
  });

  it('allows a paid community pack (market paid zone is open)', async () => {
    const store = createListingStore();
    const server = await createMarketServer({ store });
    try {
      const application: ListingApplication = {
        ...goodApplication('community-paid-pack'),
        type: 'registry:rules',
        pricing: 'paid',
        name: 'Paid community pack',
      };
      const res = await fetch(`${server.url}/v1/listings/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { listing: { id: string; pricing: string } };
      expect(body.listing.id).toBe('community-paid-pack');
      expect(body.listing.pricing).toBe('paid');
    } finally {
      await server.close();
    }
  });

  it('rejects a community listing without the community- prefix', async () => {
    const store = createListingStore();
    const server = await createMarketServer({ store });
    try {
      const application = goodApplication('ocean');
      const res = await fetch(`${server.url}/v1/listings/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('community_prefix_required');
    } finally {
      await server.close();
    }
  });

  it('seeds all 8 official homage themes as free listings', () => {
    const seeded = seedOfficialFreeListings();
    expect(seeded).toHaveLength(8);
    expect(seeded.map((listing) => listing.id)).toEqual([...HOMAGE_THEME_IDS]);
    expect(seeded.every((listing) => listing.pricing === 'free')).toBe(true);
    expect(seeded.every((listing) => listing.status === 'approved')).toBe(true);
    expect(HOMAGE_THEME_IDS.size).toBe(8);
  });

  it('presents seeded official free listings on GET /v1/listings', async () => {
    const store = createListingStore({ initial: seedMarketCatalog() });
    const server = await createMarketServer({ store });
    try {
      const res = await fetch(`${server.url}/v1/listings?type=registry:theme`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { listings: { id: string; pricing: string }[] };
      const official = body.listings.filter((listing) => HOMAGE_THEME_IDS.has(listing.id));
      expect(official).toHaveLength(8);
      expect(official.every((listing) => listing.pricing === 'free')).toBe(true);
    } finally {
      await server.close();
    }
  });

  it('seeds community-focus-first as a free registry:rules pack', () => {
    const packs = seedCommunityRulesListings();
    expect(packs).toHaveLength(1);
    expect(packs[0].id).toBe(COMMUNITY_FOCUS_FIRST_ID);
    expect(packs[0].type).toBe('registry:rules');
    expect(packs[0].pricing).toBe('free');
    expect(packs[0].status).toBe('approved');
    expect(packs[0].files.map((file) => file.path)).toEqual(
      expect.arrayContaining([
        'rules/community-focus-first/design-rules.json',
        'rules/community-focus-first/meta.json',
        'rules/community-focus-first/tokens.json',
      ]),
    );
    expect(seedMarketCatalog().some((listing) => listing.id === COMMUNITY_FOCUS_FIRST_ID)).toBe(
      true,
    );
  });

  it('lists and installs community-focus-first via install-core', async () => {
    const dir = await makeTemp();
    const store = createListingStore({ initial: seedMarketCatalog() });
    const server = await createMarketServer({ store });
    try {
      const listRes = await fetch(`${server.url}/v1/listings?type=registry:rules`);
      expect(listRes.status).toBe(200);
      const listed = (await listRes.json()) as { listings: { id: string; type: string }[] };
      expect(listed.listings.some((listing) => listing.id === COMMUNITY_FOCUS_FIRST_ID)).toBe(true);
      expect(listed.listings.every((listing) => listing.type === 'registry:rules')).toBe(true);

      const installRes = await fetch(`${server.url}/v1/listings/${COMMUNITY_FOCUS_FIRST_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDir: dir }),
      });
      expect(installRes.status).toBe(200);
      const body = (await installRes.json()) as { result: { written: string[] } };
      expect(body.result.written).toEqual(
        expect.arrayContaining([
          'rules/community-focus-first/design-rules.json',
          'rules/community-focus-first/meta.json',
          'rules/community-focus-first/tokens.json',
        ]),
      );

      const rules = await readFile(join(dir, 'rules/community-focus-first/design-rules.json'), 'utf-8');
      expect(rules).toContain('"version": "1.0"');
      expect(rules).toContain('"supported": true');
    } finally {
      await server.close();
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('rejects an official homage id as a paid registry:rules listing', async () => {
    const store = createListingStore();
    const server = await createMarketServer({ store });
    try {
      const application: ListingApplication = {
        ...goodApplication('line'),
        type: 'registry:rules',
        pricing: 'paid',
      };
      const res = await fetch(`${server.url}/v1/listings/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('homage_paid_zone');
    } finally {
      await server.close();
    }
  });

  it('refuses to install a paid homage listing even if it is already in the store', async () => {
    const dir = await makeTemp();
    const store = createListingStore({
      initial: [
        {
          ...goodApplication('wechat'),
          pricing: 'paid',
          status: 'approved',
          submittedAt: new Date().toISOString(),
          validationReport: { ok: true, checks: [] },
        },
      ],
    });
    const server = await createMarketServer({ store });
    try {
      const res = await fetch(`${server.url}/v1/listings/wechat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDir: dir }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('homage_paid_zone');
    } finally {
      await server.close();
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('checkRules fails on malformed design-rules.json', () => {
    const application: ListingApplication = {
      ...goodApplication('community-broken'),
      files: [{ path: 'design-rules.json', content: 'not json' }],
    };
    const result = checkRules(application);
    expect(result.ok).toBe(false);
    expect(result.id).toBe('check.rules');
  });

  it('checkRtl requires explicit rtl support or logical CSS', () => {
    const noRtl: ListingApplication = {
      ...goodApplication('community-no-rtl'),
      files: [
        { path: 'design-rules.json', content: JSON.stringify({ version: '1.0' }) },
        { path: 'theme.css', content: 'body { margin-left: 1rem; }' },
      ],
    };
    expect(checkRtl(noRtl).ok).toBe(false);

    const goodRtl = goodApplication('community-good-rtl');
    expect(checkRtl(goodRtl).ok).toBe(true);
  });

  it('checkLicense accepts a LICENSE file or SPDX identifier', () => {
    expect(checkLicense(goodApplication('community-licensed')).ok).toBe(true);
    const noLicense: ListingApplication = {
      ...goodApplication('community-no-license'),
      files: [],
      license: 'Proprietary',
    };
    expect(checkLicense(noLicense).ok).toBe(false);
  });

  it('HomagePaidZoneError can be thrown directly', () => {
    expect(() => {
      throw new HomagePaidZoneError('wechat');
    }).toThrow('wechat');
  });
});
