#!/usr/bin/env node

import {
  createInstallKernel,
  emitOptOut,
  type RegistryItem,
  type TelemetryHook,
} from '@chameleon-ui/install-core';
import {
  createRegistryClientFromEnv,
  installWithTheme,
  prepareInstall,
  searchByIntent,
  type RegistryClient,
} from '@chameleon-ui/registry';
import { resolve } from 'node:path';

function createTelemetryHook(): TelemetryHook | undefined {
  const enabled = process.env.CU_TELEMETRY === '1';
  if (!enabled) return undefined;
  return (event, payload) => {
    // Phase 1: log to stderr only; no network analytics SDK.
    console.error(JSON.stringify({ event, payload }));
  };
}

function usage(): void {
  console.log(`Usage:
  chameleon add <component[@version]>          install a component
  chameleon add-theme <theme[@version]>          install a theme
  chameleon bundle <component> <theme>   install component + theme together
  chameleon install-with-theme <component> <theme>
                                         install component + tokens + fonts + rules in one idempotent run
  chameleon search [query]             list available items
  chameleon search --intent <intent>   search components by intent (contract-driven, explainable)
  chameleon telemetry-off              emit opt-out event and stop telemetry

Environment:
  CU_TELEMETRY=1           enable install telemetry (off by default)
  CU_TARGET_DIR            override the install target directory (default: ./chameleon-ui)
  CU_REGISTRY_URL          optional private registry base URL
  CU_REGISTRY_TOKEN        bearer token (required when URL is set)
  CU_REGISTRY_NAMESPACE    registry namespace (default: public)`);
}

function createClient(): RegistryClient {
  return createRegistryClientFromEnv(process.env, 'cli');
}

function mergeRegistry(items: RegistryItem[]): RegistryItem[] {
  const seen = new Set<string>();
  const merged: RegistryItem[] = [];
  for (const item of items) {
    const key = `${item.namespace ?? 'public'}:${item.id}@${item.version ?? '0.0.0'}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged;
}

async function installRef(
  client: RegistryClient,
  ref: string,
  targetDir: string,
  source: 'cli' | 'mcp',
): Promise<void> {
  const prepared = await prepareInstall(client, ref);
  if (!prepared) {
    console.error(`Unknown registry item: ${ref}`);
    process.exit(1);
  }
  const kernel = createInstallKernel(prepared.registry);
  const result = await kernel.install(prepared.item, targetDir, {
    telemetry: createTelemetryHook(),
    source,
  });
  console.log(JSON.stringify(result));
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    usage();
    process.exit(1);
  }

  const command = args[0];
  const targetDir = resolve(
    process.cwd(),
    process.env.CU_TARGET_DIR ?? 'chameleon-ui',
  );
  const client = createClient();

  switch (command) {
    case 'add': {
      const itemId = args[1];
      if (!itemId) {
        console.error('Missing component id');
        process.exit(1);
      }
      await installRef(client, itemId, targetDir, 'cli');
      break;
    }
    case 'add-theme': {
      const themeId = args[1];
      if (!themeId) {
        console.error('Missing theme id');
        process.exit(1);
      }
      await installRef(client, themeId, targetDir, 'cli');
      break;
    }
    case 'bundle': {
      const itemId = args[1];
      const themeId = args[2];
      if (!itemId || !themeId) {
        console.error('Usage: chameleon bundle <component> <theme>');
        process.exit(1);
      }
      const component = await prepareInstall(client, itemId);
      const theme = await prepareInstall(client, themeId);
      if (!component) {
        console.error(`Unknown component: ${itemId}`);
        process.exit(1);
      }
      if (!theme) {
        console.error(`Unknown theme: ${themeId}`);
        process.exit(1);
      }
      if (theme.item.type !== 'registry:theme') {
        console.error(`Not a theme: ${themeId}`);
        process.exit(1);
      }
      const kernel = createInstallKernel(
        mergeRegistry([...component.registry, ...theme.registry]),
      );
      const componentResult = await kernel.install(component.item, targetDir, {
        telemetry: createTelemetryHook(),
        source: 'cli',
      });
      const themeResult = await kernel.install(theme.item, targetDir, {
        telemetry: createTelemetryHook(),
        source: 'cli',
      });
      console.log(
        JSON.stringify({
          written: [
            ...componentResult.written,
            ...themeResult.written,
          ],
          skipped: [
            ...componentResult.skipped,
            ...themeResult.skipped,
          ],
          installed: [
            ...componentResult.installed,
            ...themeResult.installed,
          ],
        }),
      );
      break;
    }
    case 'search': {
      if (args[1] === '--intent') {
        const intent = args.slice(2).join(' ').trim();
        if (!intent) {
          console.error('Usage: chameleon search --intent <intent>');
          process.exit(1);
        }
        const hits = searchByIntent(intent, await client.search(undefined));
        console.log(
          JSON.stringify(
            hits.map((hit) => ({
              id: hit.item.id,
              name: hit.item.name,
              namespace: hit.item.namespace,
              version: hit.item.version,
              score: hit.score,
              matched: hit.matched.map((entry) => `${entry.field}: ${entry.value}`),
            })),
          ),
        );
        break;
      }
      const query = args[1];
      const items = await client.search(query);
      console.log(JSON.stringify(items.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        namespace: item.namespace,
        version: item.version,
      }))));
      break;
    }
    case 'install-with-theme': {
      const itemId = args[1];
      const themeId = args[2];
      if (!itemId || !themeId) {
        console.error('Usage: chameleon install-with-theme <component> <theme>');
        process.exit(1);
      }
      const result = await installWithTheme(client, itemId, themeId, targetDir, {
        telemetry: createTelemetryHook(),
        source: 'cli',
      });
      console.log(JSON.stringify(result));
      break;
    }
    case 'telemetry-off': {
      await emitOptOut(createTelemetryHook(), {
        previousEvents: 0,
      });
      console.log('Telemetry disabled.');
      break;
    }
    default: {
      usage();
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
