import type { RegistryItem } from '@chameleon-ui/registry';

export function compareSemver(a: string, b: string): number {
  const pa = a.split('.').map((part) => Number.parseInt(part, 10) || 0);
  const pb = b.split('.').map((part) => Number.parseInt(part, 10) || 0);
  for (let i = 0; i < 3; i += 1) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) return da - db;
  }
  return 0;
}

export function latestVersion(versions: string[]): string | undefined {
  if (versions.length === 0) return undefined;
  return [...versions].sort(compareSemver).at(-1);
}

type VersionMap = Map<string, RegistryItem>;
type ItemMap = Map<string, VersionMap>;

export class RegistryStore {
  private readonly namespaces = new Map<string, ItemMap>();

  listNamespaces(): string[] {
    return [...this.namespaces.keys()].sort();
  }

  put(item: RegistryItem): void {
    const namespace = item.namespace ?? 'public';
    const version = item.version ?? '0.0.0';
    let items = this.namespaces.get(namespace);
    if (!items) {
      items = new Map();
      this.namespaces.set(namespace, items);
    }
    let versions = items.get(item.id);
    if (!versions) {
      versions = new Map();
      items.set(item.id, versions);
    }
    versions.set(version, {
      ...item,
      namespace,
      version,
    });
  }

  get(namespace: string, id: string, version?: string): RegistryItem | undefined {
    const versions = this.namespaces.get(namespace)?.get(id);
    if (!versions || versions.size === 0) return undefined;
    if (version) return versions.get(version);
    const latest = latestVersion([...versions.keys()]);
    return latest ? versions.get(latest) : undefined;
  }

  listVersions(namespace: string, id: string): string[] {
    const versions = this.namespaces.get(namespace)?.get(id);
    if (!versions) return [];
    return [...versions.keys()].sort(compareSemver);
  }

  listItems(namespace: string, query?: string): RegistryItem[] {
    const items = this.namespaces.get(namespace);
    if (!items) return [];
    const latest = [...items.keys()]
      .sort()
      .map((id) => this.get(namespace, id))
      .filter((item): item is RegistryItem => Boolean(item));
    if (!query) return latest;
    const q = query.toLowerCase();
    return latest.filter(
      (item) =>
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q),
    );
  }

  hasNamespace(namespace: string): boolean {
    return this.namespaces.has(namespace);
  }
}
