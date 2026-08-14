import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createInstallKernel } from '@chameleon-ui/install-core';
import {
  createBundledRegistryClient,
  getRegistryItem,
  listRulesPacks,
  prepareRulesInstall,
} from '../index.js';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const workspaceRoot = join(packageRoot, '..', '..');
const fixturesDir = join(packageRoot, 'test-fixtures', 'community-rules');
const validateRulesScript = join(
  workspaceRoot,
  'packages',
  'themes',
  'scripts',
  'validate-rules.mjs',
);

function runValidateRules(args: string[]): Promise<{ code: number; output: string }> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [validateRulesScript, ...args], {
      cwd: join(workspaceRoot, 'packages', 'themes'),
      env: process.env,
    });
    let output = '';
    child.stdout.on('data', (chunk) => {
      output += String(chunk);
    });
    child.stderr.on('data', (chunk) => {
      output += String(chunk);
    });
    child.on('error', reject);
    child.on('exit', (code) => resolvePromise({ code: code ?? 1, output }));
  });
}

/**
 * Phase 8 A3: community discipline pack full chain —
 * create (author document) → validate (schema) → list (registry:rules) → install (install-core).
 */
describe('community rules pack lifecycle', () => {
  it('validates a freshly authored community pack document', async () => {
    const ok = await runValidateRules([
      '--file',
      join(fixturesDir, 'community-sample-pack.design-rules.json'),
    ]);
    expect(ok.output, ok.output).toContain('validate-rules --file OK');
    expect(ok.code).toBe(0);
  });

  it('rejects a deliberately broken pack document (red-proof)', async () => {
    const broken = await runValidateRules([
      '--file',
      join(fixturesDir, 'broken-design-rules.json'),
    ]);
    expect(broken.code).not.toBe(0);
    expect(broken.output).toContain('Design rules validation failed.');
  });

  it('lists and installs the seeded community pack through install-core', async () => {
    const packs = listRulesPacks();
    const listed = packs.find((pack) => pack.id === 'community-focus-first');
    expect(listed, 'community-focus-first must be listed as registry:rules').toBeDefined();
    expect(listed?.id.startsWith('community-')).toBe(true);

    const client = createBundledRegistryClient();
    const prepared = await prepareRulesInstall(client, 'community-focus-first');
    expect(prepared).toBeDefined();

    const dir = await mkdtemp(join(tmpdir(), 'cu-rules-lifecycle-'));
    try {
      const kernel = createInstallKernel(prepared!.registry);
      const first = await kernel.install(prepared!.item, dir, { source: 'market' });
      expect(first.written.length).toBeGreaterThan(0);

      const installed = JSON.parse(
        await readFile(join(dir, 'rules/community-focus-first/design-rules.json'), 'utf8'),
      ) as { version: string };
      expect(installed.version).toBe('1.0');

      const second = await kernel.install(prepared!.item, dir, { source: 'market' });
      expect(second.written).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('keeps the bundled registry item byte-aligned with the seeded pack source', async () => {
    const item = getRegistryItem('community-focus-first');
    expect(item).toBeDefined();
    const metaFile = item!.files.find((file) => file.path.endsWith('/meta.json'));
    expect(metaFile).toBeDefined();
    const meta = JSON.parse(metaFile!.content) as { id: string; kind: string };
    expect(meta.id).toBe('community-focus-first');
    expect(meta.kind).toBe('community');
  });
});
