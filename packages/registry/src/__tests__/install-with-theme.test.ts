import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createBundledRegistryClient } from '../client.js';
import { installWithTheme, InstallWithThemeError, planInstallWithTheme } from '../install-with-theme.js';

async function makeTemp(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'cu-iwt-'));
}

describe('A2 install_with_theme playbook', () => {
  it('writes the four-piece set (component + tokens + fonts + rules) in one run', async () => {
    const dir = await makeTemp();
    try {
      const client = createBundledRegistryClient();
      const result = await installWithTheme(client, 'button', 'cupertino', dir, {
        source: 'cli',
      });

      expect(result.pieces.component).toBe('button');
      expect(result.pieces.theme).toBe('cupertino');
      expect(result.installed).toEqual(['bundle:button+cupertino']);

      // component files
      const componentSource = await readFile(join(dir, 'components/button/Button.tsx'), 'utf8');
      expect(componentSource).toContain('data-ai-role');
      // token overlay
      const tokens = JSON.parse(await readFile(join(dir, 'themes/cupertino/tokens.json'), 'utf8'));
      expect(typeof tokens).toBe('object');
      // font configuration inside meta.json
      const meta = JSON.parse(await readFile(join(dir, 'themes/cupertino/meta.json'), 'utf8'));
      expect(meta.fonts).toBeDefined();
      // design rules
      const rules = JSON.parse(
        await readFile(join(dir, 'themes/cupertino/design-rules.json'), 'utf8'),
      );
      expect(rules.version).toBe('1.0');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('is idempotent: the second run writes nothing and skips everything', async () => {
    const dir = await makeTemp();
    try {
      const client = createBundledRegistryClient();
      const first = await installWithTheme(client, 'input', 'line', dir, { source: 'mcp' });
      expect(first.written.length).toBeGreaterThan(0);
      const second = await installWithTheme(client, 'input', 'line', dir, { source: 'mcp' });
      expect(second.written).toEqual([]);
      expect(second.skipped.length).toBe(first.written.length);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('rejects unknown components and themes before writing', async () => {
    const dir = await makeTemp();
    try {
      const client = createBundledRegistryClient();
      await expect(installWithTheme(client, 'nope', 'line', dir)).rejects.toThrow(
        InstallWithThemeError,
      );
      await expect(installWithTheme(client, 'button', 'nope', dir)).rejects.toThrow(
        InstallWithThemeError,
      );
      await expect(installWithTheme(client, 'line', 'button', dir)).rejects.toThrow(
        InstallWithThemeError,
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('plans a single flattened bundle with no duplicate file paths', async () => {
    const client = createBundledRegistryClient();
    const plan = await planInstallWithTheme(client, 'button', 'line');
    const paths = plan.bundle.files.map((file) => file.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.some((path) => path.startsWith('components/button/'))).toBe(true);
    expect(paths).toContain('themes/line/tokens.json');
    expect(paths).toContain('themes/line/meta.json');
    expect(paths).toContain('themes/line/design-rules.json');
  });
});
