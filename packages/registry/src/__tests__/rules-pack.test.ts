import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createInstallKernel,
  RulesListingPolicyError,
} from '@chameleon-ui/install-core';
import {
  createBundledRegistryClient,
  getRegistryItem,
  listRulesPacks,
  prepareRulesInstall,
} from '../index.js';

async function makeTemp(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'cu-rules-pack-'));
}

describe('registry discipline packs', () => {
  it('lists bundled community rules packs with type registry:rules', () => {
    const packs = listRulesPacks();
    expect(packs.some((pack) => pack.id === 'community-focus-first')).toBe(true);
    const pack = getRegistryItem('community-focus-first');
    expect(pack?.type).toBe('registry:rules');
    expect(pack?.files.map((file) => file.path)).toEqual(
      expect.arrayContaining([
        'rules/community-focus-first/design-rules.json',
        'rules/community-focus-first/meta.json',
        'rules/community-focus-first/tokens.json',
      ]),
    );
  });

  it('installs a rules pack through install-core idempotently', async () => {
    const pack = getRegistryItem('community-focus-first');
    expect(pack).toBeDefined();
    const dir = await makeTemp();
    try {
      const kernel = createInstallKernel([pack!]);
      const first = await kernel.install(pack!, dir, { source: 'market' });
      expect(first.written.length).toBeGreaterThan(0);
      const rules = await readFile(
        join(dir, 'rules/community-focus-first/design-rules.json'),
        'utf-8',
      );
      expect(rules).toContain('"version": "1.0"');

      const second = await kernel.install(pack!, dir, { source: 'market' });
      expect(second.written).toEqual([]);
      expect(second.skipped.length).toBe(pack!.files.length);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('prepareRulesInstall authorizes free community packs', async () => {
    const client = createBundledRegistryClient();
    const prepared = await prepareRulesInstall(client, 'community-focus-first');
    expect(prepared?.item.type).toBe('registry:rules');
  });

  it('blocks homage ids from paid rules authorization', async () => {
    const homagePack = {
      ...getRegistryItem('community-focus-first')!,
      id: 'linear',
      type: 'registry:rules' as const,
      files: getRegistryItem('community-focus-first')!.files.map((file) => ({
        ...file,
        path: file.path.replace('community-focus-first', 'linear'),
      })),
    };
    await expect(
      prepareRulesInstall(
        {
          ...createBundledRegistryClient(),
          async getItem() {
            return homagePack;
          },
          async loadInstallGraph() {
            return [homagePack];
          },
        },
        'linear',
        { authContext: { paid: true, token: 'license-ok' } },
      ),
    ).rejects.toBeInstanceOf(RulesListingPolicyError);
  });
});
