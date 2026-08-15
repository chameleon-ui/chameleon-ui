import {
  getRegistryItem,
  listBlocks,
  listComponents,
  listThemes,
  registry,
  searchRegistry,
  type RegistryItem,
} from './catalog.js';
import {
  authorizeRulesPackDownload,
  createStubRulesDownloadAuth,
  type RulesDownloadAuthContext,
  type RulesDownloadAuthPort,
} from './rules.js';

export class RegistryClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'RegistryClientError';
  }
}

export class RegistryAuthError extends RegistryClientError {
  constructor(message = 'Private registry authentication failed') {
    super(message, 401, 'unauthorized');
    this.name = 'RegistryAuthError';
  }
}

export interface RegistryClientOptions {
  namespace?: string;
  version?: string;
}

export interface RegistryClient {
  readonly kind: 'bundled' | 'http';
  readonly namespace: string;
  getItem(id: string, options?: RegistryClientOptions): Promise<RegistryItem | undefined>;
  search(query?: string, options?: RegistryClientOptions): Promise<RegistryItem[]>;
  listThemes(options?: RegistryClientOptions): Promise<RegistryItem[]>;
  listComponents(options?: RegistryClientOptions): Promise<RegistryItem[]>;
  listBlocks(options?: RegistryClientOptions): Promise<RegistryItem[]>;
  listRulesPacks(options?: RegistryClientOptions): Promise<RegistryItem[]>;
  listVersions(id: string, options?: RegistryClientOptions): Promise<string[]>;
  loadInstallGraph(id: string, options?: RegistryClientOptions): Promise<RegistryItem[]>;
}

export interface HttpRegistryClientConfig {
  url: string;
  token: string;
  namespace?: string;
  source?: 'cli' | 'mcp' | 'docs';
}

function matchesVersion(item: RegistryItem, version?: string): boolean {
  if (!version) return true;
  return item.version === version;
}

function matchesNamespace(item: RegistryItem, namespace?: string): boolean {
  if (!namespace) return true;
  return (item.namespace ?? 'public') === namespace;
}

export function parseItemRef(ref: string): { id: string; version?: string } {
  const match = /^(?<id>[^@]+)@(?<version>\d+\.\d+\.\d+)$/.exec(ref);
  if (match?.groups?.id && match.groups.version) {
    return { id: match.groups.id, version: match.groups.version };
  }
  return { id: ref };
}

export function createBundledRegistryClient(
  defaultNamespace = 'public',
): RegistryClient {
  return {
    kind: 'bundled',
    namespace: defaultNamespace,
    async getItem(id, options) {
      const item = getRegistryItem(id);
      if (!item) return undefined;
      if (!matchesNamespace(item, options?.namespace ?? defaultNamespace)) {
        return undefined;
      }
      if (!matchesVersion(item, options?.version)) return undefined;
      return item;
    },
    async search(query, options) {
      const namespace = options?.namespace ?? defaultNamespace;
      return searchRegistry(query).filter((item) => matchesNamespace(item, namespace));
    },
    async listThemes(options) {
      const namespace = options?.namespace ?? defaultNamespace;
      return listThemes().filter((item) => matchesNamespace(item, namespace));
    },
    async listComponents(options) {
      const namespace = options?.namespace ?? defaultNamespace;
      return listComponents().filter((item) => matchesNamespace(item, namespace));
    },
    async listBlocks(options) {
      const namespace = options?.namespace ?? defaultNamespace;
      return listBlocks().filter((item) => matchesNamespace(item, namespace));
    },
    async listRulesPacks(options) {
      const namespace = options?.namespace ?? defaultNamespace;
      const { listRulesPacks } = await import('./catalog.js');
      return listRulesPacks().filter((item) => matchesNamespace(item, namespace));
    },
    async listVersions(id, options) {
      const item = await this.getItem(id, { namespace: options?.namespace });
      return item?.version ? [item.version] : [];
    },
    async loadInstallGraph(id, options) {
      const item = await this.getItem(id, options);
      if (!item) return [];
      return registry;
    },
  };
}

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}${path}`;
}

async function readJson(
  response: Response,
): Promise<Record<string, unknown>> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { error: { message: text } };
  }
}

function errorMessage(body: Record<string, unknown>, fallback: string): string {
  const error = body.error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return fallback;
}

export function createHttpRegistryClient(
  config: HttpRegistryClientConfig,
): RegistryClient {
  const base = config.url.replace(/\/+$/, '');
  const namespace = config.namespace ?? 'public';
  const source = config.source ?? 'cli';

  async function request(path: string): Promise<Response> {
    const response = await fetch(joinUrl(base, path), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${config.token}`,
        'X-CU-Source': source,
      },
    });
    if (response.status === 401) {
      throw new RegistryAuthError();
    }
    return response;
  }

  async function getItem(
    id: string,
    options?: RegistryClientOptions,
  ): Promise<RegistryItem | undefined> {
    const ns = options?.namespace ?? namespace;
    const path = options?.version
      ? `/v1/namespaces/${encodeURIComponent(ns)}/items/${encodeURIComponent(id)}/versions/${encodeURIComponent(options.version)}`
      : `/v1/namespaces/${encodeURIComponent(ns)}/items/${encodeURIComponent(id)}`;
    const response = await request(path);
    if (response.status === 404) return undefined;
    const body = await readJson(response);
    if (!response.ok) {
      throw new RegistryClientError(
        errorMessage(body, `Registry request failed (${response.status})`),
        response.status,
      );
    }
    return body.item as RegistryItem;
  }

  return {
    kind: 'http',
    namespace,
    getItem,
    async search(query, options) {
      const ns = options?.namespace ?? namespace;
      const params = new URLSearchParams({ full: '1' });
      if (query) params.set('q', query);
      const response = await request(
        `/v1/namespaces/${encodeURIComponent(ns)}/items?${params.toString()}`,
      );
      const body = await readJson(response);
      if (!response.ok) {
        throw new RegistryClientError(
          errorMessage(body, `Registry search failed (${response.status})`),
          response.status,
        );
      }
      return (body.items as RegistryItem[]) ?? [];
    },
    async listThemes(options) {
      const items = await this.search(undefined, options);
      return items.filter((item) => item.type === 'registry:theme');
    },
    async listComponents(options) {
      const items = await this.search(undefined, options);
      return items.filter((item) => item.type === 'registry:ui');
    },
    async listBlocks(options) {
      const items = await this.search(undefined, options);
      return items.filter((item) => item.type === 'registry:block');
    },
    async listRulesPacks(options) {
      const items = await this.search(undefined, options);
      return items.filter((item) => item.type === 'registry:rules');
    },
    async listVersions(id, options) {
      const ns = options?.namespace ?? namespace;
      const response = await request(
        `/v1/namespaces/${encodeURIComponent(ns)}/items/${encodeURIComponent(id)}/versions`,
      );
      if (response.status === 404) return [];
      const body = await readJson(response);
      if (!response.ok) {
        throw new RegistryClientError(
          errorMessage(body, `Registry versions failed (${response.status})`),
          response.status,
        );
      }
      return (body.versions as string[]) ?? [];
    },
    async loadInstallGraph(id, options) {
      const seen = new Set<string>();
      const items: RegistryItem[] = [];

      async function visit(itemId: string, version?: string) {
        if (seen.has(itemId)) return;
        seen.add(itemId);
        const item = await getItem(itemId, { ...options, version });
        if (!item) {
          throw new RegistryClientError(`Missing registry item: ${itemId}`, 404, 'not_found');
        }
        items.push(item);
        for (const dep of item.dependencies ?? []) {
          await visit(dep);
        }
      }

      await visit(id, options?.version);
      return items;
    },
  };
}

export function createRegistryClientFromEnv(
  env: NodeJS.ProcessEnv = process.env,
  source: 'cli' | 'mcp' | 'docs' = 'cli',
): RegistryClient {
  const url = env.CU_REGISTRY_URL?.trim();
  const namespace = env.CU_REGISTRY_NAMESPACE?.trim() || 'public';
  if (!url) {
    return createBundledRegistryClient(namespace);
  }
  const token = env.CU_REGISTRY_TOKEN?.trim();
  if (!token) {
    throw new RegistryAuthError(
      'CU_REGISTRY_URL is set but CU_REGISTRY_TOKEN is missing',
    );
  }
  return createHttpRegistryClient({ url, token, namespace, source });
}

export async function prepareInstall(
  client: RegistryClient,
  ref: string,
  options?: RegistryClientOptions,
): Promise<{ item: RegistryItem; registry: RegistryItem[] } | undefined> {
  const parsed = parseItemRef(ref);
  const version = options?.version ?? parsed.version;
  const item = await client.getItem(parsed.id, { ...options, version });
  if (!item) return undefined;
  const graph = await client.loadInstallGraph(parsed.id, {
    ...options,
    version: version ?? item.version,
  });
  return { item, registry: graph };
}

export interface PrepareRulesInstallOptions extends RegistryClientOptions {
  auth?: RulesDownloadAuthPort;
  authContext?: RulesDownloadAuthContext;
}

/**
 * Authorize (when paid) and resolve a discipline pack for install-core.
 */
export async function prepareRulesInstall(
  client: RegistryClient,
  ref: string,
  options?: PrepareRulesInstallOptions,
): Promise<{ item: RegistryItem; registry: RegistryItem[] } | undefined> {
  const prepared = await prepareInstall(client, ref, options);
  if (!prepared) return undefined;
  if (prepared.item.type !== 'registry:rules') {
    throw new RegistryClientError(
      `Item ${prepared.item.id} is not a discipline pack (expected type registry:rules, got ${prepared.item.type})`,
      400,
      'invalid_rules_item',
    );
  }
  await authorizeRulesPackDownload(
    prepared.item,
    options?.auth ?? createStubRulesDownloadAuth(),
    options?.authContext,
  );
  return prepared;
}
