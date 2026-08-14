import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createInstallKernel,
  install,
  InstallError,
  type RegistryItem,
} from '../index';

async function makeTemp(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'cu-install-'));
}

const buttonItem: RegistryItem = {
  id: 'button',
  type: 'registry:ui',
  name: 'Button',
  files: [{ path: 'Button.tsx', content: 'export const Button = () => <button />' }],
  dependencies: [],
};

const iconItem: RegistryItem = {
  id: 'icon',
  type: 'registry:ui',
  name: 'Icon',
  files: [{ path: 'Icon.tsx', content: 'export const Icon = () => <svg />' }],
  dependencies: [],
};

const buttonWithDep: RegistryItem = {
  id: 'button',
  type: 'registry:ui',
  name: 'Button',
  files: [
    {
      path: 'Button.tsx',
      content: 'import { Icon } from "./Icon"; export const Button = () => <Icon />',
    },
  ],
  dependencies: ['icon'],
};

describe('install-core', () => {
  it('writes files and returns the written list', async () => {
    const dir = await makeTemp();
    try {
      const result = await install({ item: buttonItem, targetDir: dir, mode: 'copy' });
      expect(result.written).toEqual(['Button.tsx']);
      expect(result.skipped).toEqual([]);
      const content = await readFile(join(dir, 'Button.tsx'), 'utf-8');
      expect(content).toBe(buttonItem.files[0].content);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('detects conflicts when a file exists with different content', async () => {
    const dir = await makeTemp();
    try {
      await writeFile(join(dir, 'Button.tsx'), 'different', 'utf-8');
      await expect(
        install({ item: buttonItem, targetDir: dir, mode: 'copy' }),
      ).rejects.toThrow(InstallError);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('is idempotent: a re-run skips identical files', async () => {
    const dir = await makeTemp();
    try {
      await install({ item: buttonItem, targetDir: dir, mode: 'copy' });
      const result = await install({ item: buttonItem, targetDir: dir, mode: 'copy' });
      expect(result.written).toEqual([]);
      expect(result.skipped).toEqual(['Button.tsx']);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('telemetry is off by default', async () => {
    const dir = await makeTemp();
    const events: Array<{ event: string; payload: Record<string, unknown> }> = [];
    try {
      await install({ item: buttonItem, targetDir: dir, mode: 'copy' });
      expect(events).toHaveLength(0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('emits install events only when a telemetry hook is provided', async () => {
    const dir = await makeTemp();
    const events: Array<{ event: string; payload: Record<string, unknown> }> = [];
    const hook = (event: string, payload: Record<string, unknown>) => {
      events.push({ event, payload });
    };
    try {
      await install({
        item: buttonItem,
        targetDir: dir,
        mode: 'copy',
        options: { telemetry: hook, source: 'cli' },
      });
      expect(events).toHaveLength(1);
      expect(events[0].event).toBe('install');
      expect(events[0].payload.itemId).toBe('button');
      expect(events[0].payload.source).toBe('cli');
      expect(events[0].payload.namespace).toBeUndefined();
      expect(events[0].payload.version).toBeUndefined();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('includes namespace and version on install events when the item carries them', async () => {
    const dir = await makeTemp();
    const events: Array<{ event: string; payload: Record<string, unknown> }> = [];
    const hook = (event: string, payload: Record<string, unknown>) => {
      events.push({ event, payload });
    };
    const namespaced: RegistryItem = {
      ...buttonItem,
      namespace: 'acme',
      version: '1.0.0',
    };
    try {
      await install({
        item: namespaced,
        targetDir: dir,
        mode: 'copy',
        options: { telemetry: hook, source: 'mcp' },
      });
      expect(events[0]?.event).toBe('install');
      expect(events[0]?.payload.namespace).toBe('acme');
      expect(events[0]?.payload.version).toBe('1.0.0');
      expect(events[0]?.payload.source).toBe('mcp');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('accepts docs as an install source for the public docs CTA path', async () => {
    const dir = await makeTemp();
    const events: Array<{ event: string; payload: Record<string, unknown> }> = [];
    const hook = (event: string, payload: Record<string, unknown>) => {
      events.push({ event, payload });
    };
    try {
      await install({
        item: buttonItem,
        targetDir: dir,
        mode: 'copy',
        options: { telemetry: hook, source: 'docs' },
      });
      expect(events[0]?.payload.source).toBe('docs');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('kernel resolves dependencies and installs them in order', async () => {
    const dir = await makeTemp();
    try {
      const kernel = createInstallKernel([iconItem, buttonWithDep]);
      const result = await kernel.install(buttonWithDep, dir);
      expect(result.installed).toEqual(['icon', 'button']);
      expect(result.written).toEqual(['Icon.tsx', 'Button.tsx']);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('fails on circular dependencies', async () => {
    const a: RegistryItem = {
      id: 'a',
      type: 'registry:ui',
      name: 'A',
      files: [],
      dependencies: ['b'],
    };
    const b: RegistryItem = {
      id: 'b',
      type: 'registry:ui',
      name: 'B',
      files: [],
      dependencies: ['a'],
    };
    const kernel = createInstallKernel([a, b]);
    await expect(kernel.install(a, '/tmp')).rejects.toThrow(InstallError);
  });

  it('reports conflicts in dependency files before writing anything', async () => {
    const dir = await makeTemp();
    try {
      await writeFile(join(dir, 'Icon.tsx'), 'stale', 'utf-8');
      const kernel = createInstallKernel([iconItem, buttonWithDep]);
      await expect(kernel.install(buttonWithDep, dir)).rejects.toThrow(InstallError);
      const buttonPath = join(dir, 'Button.tsx');
      await expect(readFile(buttonPath, 'utf-8')).rejects.toThrow();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
