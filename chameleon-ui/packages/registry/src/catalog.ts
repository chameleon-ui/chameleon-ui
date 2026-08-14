import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface RegistryFile {
  path: string;
  content: string;
}

export interface RegistryItem {
  id: string;
  type: 'registry:ui' | 'registry:theme' | 'registry:rules' | (string & {});
  name: string;
  files: RegistryFile[];
  dependencies?: string[];
  /** Public catalog is `public`. Private servers may expose other namespaces. */
  namespace?: string;
  /** Semver string. Bundled catalog items default to `0.0.0`. */
  version?: string;
}

const registryRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'registry');

function loadItems(kind: 'r' | 't' | 'rules'): RegistryItem[] {
  const directory = join(registryRoot, kind);
  return readdirSync(directory)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const item = JSON.parse(readFileSync(join(directory, name), 'utf8')) as RegistryItem;
      return {
        ...item,
        namespace: item.namespace ?? 'public',
        version: item.version ?? '0.0.0',
      };
    });
}

export const registry: RegistryItem[] = [
  ...loadItems('r'),
  ...loadItems('t'),
  ...loadItems('rules'),
];

export const registryById = new Map<string, RegistryItem>(
  registry.map((item) => [item.id, item]),
);

export function getRegistryItem(id: string): RegistryItem | undefined {
  return registryById.get(id);
}

export function searchRegistry(query?: string): RegistryItem[] {
  if (!query) return registry;
  const q = query.toLowerCase();
  return registry.filter(
    (item) =>
      item.id.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q),
  );
}

export function listThemes(): RegistryItem[] {
  return registry.filter((item) => item.type === 'registry:theme');
}

export function listComponents(): RegistryItem[] {
  return registry.filter((item) => item.type === 'registry:ui');
}

export function listRulesPacks(): RegistryItem[] {
  return registry.filter((item) => item.type === 'registry:rules');
}
