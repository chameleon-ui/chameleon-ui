import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

/**
 * Optional telemetry hook.
 * @phase-1 @telemetry:hook
 *
 * When provided, install-core calls this hook with event names defined in
 * {@link TELEMETRY_EVENTS}. The hook implementation decides where to send data.
 * install-core itself performs **no network request** and defaults to **no hook**,
 * so telemetry is off-by-default.
 */
export type TelemetryHook = (
  event: string,
  payload: Readonly<Record<string, unknown>>,
) => void | Promise<void>;

export interface RegistryFile {
  path: string;
  content: string;
}

export interface RegistryItem {
  id: string;
  type: 'registry:ui' | 'registry:theme' | (string & {});
  name: string;
  files: RegistryFile[];
  dependencies?: string[];
  namespace?: string;
  version?: string;
}

export interface InstallOptions {
  telemetry?: TelemetryHook;
  source?: 'cli' | 'mcp' | 'docs' | 'market' | 'ag-ui';
  session?: string;
}

export interface InstallRequest {
  item: RegistryItem;
  targetDir: string;
  mode: 'copy';
  options?: InstallOptions;
}

export interface InstallResult {
  written: string[];
  skipped: string[];
  installed: string[];
}

export interface InstallPlanEntry {
  item: RegistryItem;
  files: RegistryFile[];
}

export interface InstallKernel {
  /**
   * Install a registry item and its declared dependencies.
   * @complexity time O(e+v) | space O(v) | v = registry items, e = dependency edges
   */
  install(
    item: RegistryItem,
    targetDir: string,
    options?: InstallOptions,
  ): Promise<InstallResult>;
}

export interface ConflictReport {
  path: string;
  reason: 'different_content' | 'unreadable';
}

export class InstallError extends Error {
  constructor(
    message: string,
    public readonly conflicts: ConflictReport[],
  ) {
    super(message);
    this.name = 'InstallError';
  }
}

/** Stable telemetry event names. @phase-1 @telemetry:hook */
export const TELEMETRY_EVENTS = {
  install: 'install',
  intentVsAdopt: 'intent_vs_adopt',
  optOut: 'opt_out',
} as const;

/**
 * Resolve dependency graph in topological order.
 * @complexity time O(e+v) | space O(v) | v = registry items, e = dependency edges
 * @guarantees deterministic, cycle-safe
 */
export function resolveDependencies(
  registry: RegistryItem[],
  itemId: string,
): string[] {
  const byId = new Map(registry.map((item) => [item.id, item]));
  const visited = new Set<string>();
  const temp = new Set<string>();
  const order: string[] = [];

  function visit(id: string, stack: string[]) {
    if (temp.has(id)) {
      const cycle = stack.slice(stack.indexOf(id)).concat(id);
      throw new InstallError(
        `Circular dependency detected: ${cycle.join(' -> ')}`,
        [],
      );
    }
    if (visited.has(id)) return;

    const item = byId.get(id);
    if (!item) {
      throw new InstallError(`Missing registry item: ${id}`, []);
    }

    temp.add(id);
    stack.push(id);
    for (const dep of item.dependencies ?? []) {
      visit(dep, stack);
    }
    stack.pop();
    temp.delete(id);
    visited.add(id);
    order.push(id);
  }

  visit(itemId, []);
  return order;
}

/**
 * Build an install plan from a registry item and its dependencies.
 */
export function planInstall(
  registry: RegistryItem[],
  itemId: string,
): InstallPlanEntry[] {
  const order = resolveDependencies(registry, itemId);
  const byId = new Map(registry.map((item) => [item.id, item]));
  return order.map((id) => {
    const item = byId.get(id)!;
    return { item, files: item.files };
  });
}

/**
 * Detect conflicts between the install plan and existing files.
 * A file is a conflict only if it exists with **different** content. Identical
 * files are skipped later (idempotent re-run).
 */
export async function detectConflicts(
  targetDir: string,
  plan: InstallPlanEntry[],
): Promise<ConflictReport[]> {
  const conflicts: ConflictReport[] = [];
  for (const entry of plan) {
    for (const file of entry.files) {
      const fullPath = resolve(targetDir, file.path);
      try {
        const existing = await readFile(fullPath, 'utf-8');
        if (existing !== file.content) {
          conflicts.push({ path: file.path, reason: 'different_content' });
        }
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        if (code !== 'ENOENT') {
          conflicts.push({ path: file.path, reason: 'unreadable' });
        }
      }
    }
  }
  return conflicts;
}

/**
 * Write planned files to disk, skipping identical files.
 */
export async function writePlanFiles(
  targetDir: string,
  plan: InstallPlanEntry[],
): Promise<{ written: string[]; skipped: string[] }> {
  const written: string[] = [];
  const skipped: string[] = [];
  for (const entry of plan) {
    for (const file of entry.files) {
      const fullPath = resolve(targetDir, file.path);
      await mkdir(dirname(fullPath), { recursive: true });
      try {
        const existing = await readFile(fullPath, 'utf-8');
        if (existing === file.content) {
          skipped.push(file.path);
          continue;
        }
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        if (code !== 'ENOENT') {
          throw err;
        }
      }
      await writeFile(fullPath, file.content, 'utf-8');
      written.push(file.path);
    }
  }
  return { written, skipped };
}

async function emitInstallEvent(
  hook: TelemetryHook,
  payload: Record<string, unknown>,
): Promise<void> {
  await hook(TELEMETRY_EVENTS.install, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Install a single registry item. Does not resolve dependencies.
 * Use {@link createInstallKernel} for dependency-aware installs.
 * @phase-1 @telemetry:hook
 */
export async function install(req: InstallRequest): Promise<InstallResult> {
  const { item, targetDir, options } = req;
  const plan: InstallPlanEntry[] = [{ item, files: item.files }];
  const conflicts = await detectConflicts(targetDir, plan);
  if (conflicts.length > 0) {
    throw new InstallError(
      `Install conflicts detected in ${conflicts.map((c) => c.path).join(', ')}`,
      conflicts,
    );
  }
  const { written, skipped } = await writePlanFiles(targetDir, plan);
  if (options?.telemetry) {
    await emitInstallEvent(options.telemetry, {
      itemId: item.id,
      itemType: item.type,
      source: options.source ?? 'unknown',
      session: options.session,
      namespace: item.namespace,
      version: item.version,
    });
  }
  return { written, skipped, installed: [item.id] };
}

/**
 * Create a registry-aware install kernel. This is the single kernel that
 * CLI and MCP must use; it does not allow callers to bypass it and write
 * files directly.
 */
export function createInstallKernel(registry: RegistryItem[]): InstallKernel {
  return {
    async install(item, targetDir, options) {
      const plan = planInstall(registry, item.id);
      const conflicts = await detectConflicts(targetDir, plan);
      if (conflicts.length > 0) {
        throw new InstallError(
          `Install conflicts detected in ${conflicts.map((c) => c.path).join(', ')}`,
          conflicts,
        );
      }
      const { written, skipped } = await writePlanFiles(targetDir, plan);
      if (options?.telemetry) {
        for (const entry of plan) {
          await emitInstallEvent(options.telemetry, {
            itemId: entry.item.id,
            itemType: entry.item.type,
            source: options.source ?? 'unknown',
            session: options.session,
            bundled: entry.item.id !== item.id,
            namespace: entry.item.namespace,
            version: entry.item.version,
          });
        }
      }
      return {
        written,
        skipped,
        installed: plan.map((entry) => entry.item.id),
      };
    },
  };
}

/**
 * Emit an opt-out telemetry event. The hook is optional; if absent, the event
 * is silently dropped, keeping opt-out safe even when telemetry is off.
 */
export async function emitOptOut(
  hook: TelemetryHook | undefined,
  payload: Record<string, unknown> = {},
): Promise<void> {
  if (!hook) return;
  await hook(TELEMETRY_EVENTS.optOut, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Emit an intent-vs-adopt telemetry event. MCP may call this after a search
 * recommendation to record whether the user adopted the recommendation.
 */
export async function emitIntentVsAdopt(
  hook: TelemetryHook | undefined,
  payload: Record<string, unknown>,
): Promise<void> {
  if (!hook) return;
  await hook(TELEMETRY_EVENTS.intentVsAdopt, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
}

export {
  assertPaidRulesListingAllowed,
  isOfficialHomageRulesId,
  OFFICIAL_HOMAGE_RULES_IDS,
  RulesListingPolicyError,
  type OfficialHomageRulesId,
} from './rules-policy.js';
export {
  detectRulesMergeConflicts,
  mergeDesignRules,
  RulesMergeError,
  type RulesMergeConflict,
} from './rules-merge.js';
export {
  assertRulesDownloadAuthorized,
  createStubRulesDownloadAuth,
  RulesDownloadAuthError,
  type RulesAuthStatus,
  type RulesDownloadAuthContext,
  type RulesDownloadAuthPort,
} from './rules-auth.js';
