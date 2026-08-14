import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createInstallKernel,
  type TelemetryHook,
} from '@chameleon-ui/install-core';
import {
  createHttpRegistryClient,
  createRegistryClientFromEnv,
  prepareInstall,
} from '@chameleon-ui/registry';
import { createPrivateRegistryServer, type PrivateRegistryServer } from '../index.js';

const TOKEN = 'cu-phase3-local-token';

const servers: PrivateRegistryServer[] = [];

afterEach(async () => {
  while (servers.length > 0) {
    const server = servers.pop();
    if (server) await server.close();
  }
});

async function start(): Promise<PrivateRegistryServer> {
  const server = await createPrivateRegistryServer({
    token: TOKEN,
    host: '127.0.0.1',
    port: 0,
  });
  servers.push(server);
  return server;
}

describe('private registry server', () => {
  it('refuses to start without a token', async () => {
    await expect(
      createPrivateRegistryServer({ token: '   ', host: '127.0.0.1', port: 0 }),
    ).rejects.toThrow(/token is required/);
  });

  it('serves /health without a bearer token', async () => {
    const server = await start();
    const response = await fetch(`${server.url}/health`);
    expect(response.status).toBe(200);
    const body = (await response.json()) as { ok: boolean; telemetry: string };
    expect(body.ok).toBe(true);
    expect(body.telemetry).toBe('off');
  });

  it('returns 401 when the bearer token is missing or wrong', async () => {
    const server = await start();
    const missing = await fetch(`${server.url}/v1/namespaces/public/items/button`);
    expect(missing.status).toBe(401);
    const wrong = await fetch(`${server.url}/v1/namespaces/public/items/button`, {
      headers: { Authorization: 'Bearer definitely-not-the-token' },
    });
    expect(wrong.status).toBe(401);
    expect(JSON.stringify(server.auditLog)).not.toContain(TOKEN);
    expect(JSON.stringify(server.auditLog)).not.toContain('definitely-not-the-token');
  });

  it('returns the public button with the same item schema as the bundled catalog', async () => {
    const server = await start();
    const client = createHttpRegistryClient({
      url: server.url,
      token: TOKEN,
      namespace: 'public',
      source: 'cli',
    });
    const item = await client.getItem('button');
    expect(item?.id).toBe('button');
    expect(item?.type).toBe('registry:ui');
    expect(item?.namespace).toBe('public');
    expect(item?.version).toBe('0.0.0');
    expect(item?.files?.length).toBeGreaterThan(0);
    expect(item?.files[0]?.path).toContain('button');
    expect(item?.files[0]?.content).toEqual(expect.any(String));
    expect(
      server.auditLog.some(
        (entry) => entry.source === 'cli' && entry.itemId === 'button' && entry.status === 200,
      ),
    ).toBe(true);
  });

  it('keeps private items in a different namespace and selects the latest version', async () => {
    const server = await start();
    const client = createHttpRegistryClient({
      url: server.url,
      token: TOKEN,
      namespace: 'acme',
      source: 'mcp',
    });
    const versions = await client.listVersions('button');
    expect(versions).toEqual(['0.9.0', '1.0.0', '1.1.0']);
    const latest = await client.getItem('button');
    expect(latest?.namespace).toBe('acme');
    expect(latest?.version).toBe('1.1.0');
    const pinned = await client.getItem('button', { version: '1.0.0' });
    expect(pinned?.version).toBe('1.0.0');
    const namespaces = await fetch(`${server.url}/v1/namespaces`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const body = (await namespaces.json()) as { namespaces: string[] };
    expect(body.namespaces).toEqual(['acme', 'public']);
  });

  it('installs public button through install-core with telemetry off by default', async () => {
    const server = await start();
    const client = createHttpRegistryClient({
      url: server.url,
      token: TOKEN,
      namespace: 'public',
      source: 'cli',
    });
    const prepared = await prepareInstall(client, 'button');
    expect(prepared).toBeDefined();
    const dir = await mkdtemp(join(tmpdir(), 'cu-private-reg-'));
    const events: Array<{ event: string; payload: Record<string, unknown> }> = [];
    try {
      const kernel = createInstallKernel(prepared!.registry);
      const result = await kernel.install(prepared!.item, dir, { source: 'cli' });
      expect(result.installed).toContain('button');
      expect(result.written.length).toBeGreaterThan(0);
      const written = await readFile(join(dir, prepared!.item.files[0].path), 'utf8');
      expect(written).toBe(prepared!.item.files[0].content);
      expect(events).toHaveLength(0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('emits the public install event name with namespace and version when a hook is passed', async () => {
    const server = await start();
    const client = createHttpRegistryClient({
      url: server.url,
      token: TOKEN,
      namespace: 'acme',
      source: 'mcp',
    });
    const prepared = await prepareInstall(client, 'button@1.0.0');
    const dir = await mkdtemp(join(tmpdir(), 'cu-private-reg-'));
    const events: Array<{ event: string; payload: Record<string, unknown> }> = [];
    const hook: TelemetryHook = (event, payload) => {
      events.push({ event, payload });
    };
    try {
      const kernel = createInstallKernel(prepared!.registry);
      await kernel.install(prepared!.item, dir, {
        telemetry: hook,
        source: 'mcp',
      });
      expect(events[0]?.event).toBe('install');
      expect(events[0]?.payload.source).toBe('mcp');
      expect(events[0]?.payload.itemId).toBe('button');
      expect(events[0]?.payload.namespace).toBe('acme');
      expect(events[0]?.payload.version).toBe('1.0.0');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('uses the bundled catalog when CU_REGISTRY_URL is unset', async () => {
    const client = createRegistryClientFromEnv(
      { CU_REGISTRY_NAMESPACE: 'public' },
      'cli',
    );
    expect(client.kind).toBe('bundled');
    const item = await client.getItem('button');
    expect(item?.id).toBe('button');
    expect(item?.namespace).toBe('public');
  });

  it('fails closed when a URL is set without a token', () => {
    expect(() =>
      createRegistryClientFromEnv({ CU_REGISTRY_URL: 'http://127.0.0.1:8787' }, 'cli'),
    ).toThrow(/CU_REGISTRY_TOKEN/);
  });
});
