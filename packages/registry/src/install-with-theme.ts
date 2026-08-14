import {
  createInstallKernel,
  planInstall,
  type InstallOptions,
  type InstallResult,
  type RegistryFile,
  type RegistryItem,
} from '@chameleon-ui/install-core';
import { prepareInstall, type RegistryClient, type RegistryClientOptions } from './client.js';

export interface InstallWithThemePlan {
  component: RegistryItem;
  theme: RegistryItem;
  bundle: RegistryItem;
  registry: RegistryItem[];
}

export interface InstallWithThemeResult extends InstallResult {
  /** The four artifact groups written in one run: component, tokens, fonts (meta), design-rules. */
  pieces: {
    component: string;
    theme: string;
    tokens: string[];
    fonts: string[];
    designRules: string[];
  };
}

export class InstallWithThemeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstallWithThemeError';
  }
}

function mergeRegistries(items: RegistryItem[][]): RegistryItem[] {
  const seen = new Set<string>();
  const merged: RegistryItem[] = [];
  for (const list of items) {
    for (const item of list) {
      const key = `${item.namespace ?? 'public'}:${item.id}@${item.version ?? '0.0.0'}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }
  return merged;
}

function dedupeFiles(files: RegistryFile[]): RegistryFile[] {
  const seen = new Set<string>();
  const out: RegistryFile[] = [];
  for (const file of files) {
    if (seen.has(file.path)) continue;
    seen.add(file.path);
    out.push(file);
  }
  return out;
}

/**
 * Resolve the install_with_theme playbook: component + theme are flattened
 * into ONE synthetic bundle item whose dependency-closed file list is written
 * by a single install-core kernel pass (single conflict check, single write,
 * idempotent re-run). No other write path is involved (轨道卡红线: 单核不可破).
 *
 * The on-disk four-piece set (四件套):
 *  - component sources under `components/<slug>/`
 *  - token overlay `themes/<theme>/tokens.json`
 *  - font configuration inside `themes/<theme>/meta.json`
 *  - design discipline `themes/<theme>/design-rules.json`
 *
 * @complexity time O(e+v+f) | space O(v+f) | v = items, e = dependency edges, f = files
 */
export async function planInstallWithTheme(
  client: RegistryClient,
  componentRef: string,
  themeRef: string,
  options?: RegistryClientOptions,
): Promise<InstallWithThemePlan> {
  const component = await prepareInstall(client, componentRef, options);
  if (!component || component.item.type !== 'registry:ui') {
    throw new InstallWithThemeError(`Unknown component: ${componentRef}`);
  }
  const theme = await prepareInstall(client, themeRef, options);
  if (!theme || theme.item.type !== 'registry:theme') {
    throw new InstallWithThemeError(`Unknown theme: ${themeRef}`);
  }

  const registry = mergeRegistries([component.registry, theme.registry]);
  const componentPlan = planInstall(registry, component.item.id);
  const themePlan = planInstall(registry, theme.item.id);

  const files = dedupeFiles([
    ...componentPlan.flatMap((entry) => entry.files),
    ...themePlan.flatMap((entry) => entry.files),
  ]);

  const bundle: RegistryItem = {
    id: `bundle:${component.item.id}+${theme.item.id}`,
    type: 'registry:bundle',
    name: `${component.item.name} with ${theme.item.name}`,
    files,
    dependencies: [],
    namespace: component.item.namespace,
    version: component.item.version,
  };

  return {
    component: component.item,
    theme: theme.item,
    bundle,
    registry: [...registry, bundle],
  };
}

export async function installWithTheme(
  client: RegistryClient,
  componentRef: string,
  themeRef: string,
  targetDir: string,
  options?: InstallOptions & RegistryClientOptions,
): Promise<InstallWithThemeResult> {
  const plan = await planInstallWithTheme(client, componentRef, themeRef, options);
  const kernel = createInstallKernel(plan.registry);
  const result = await kernel.install(plan.bundle, targetDir, options);

  const themePrefix = `themes/${plan.theme.id}/`;
  return {
    ...result,
    pieces: {
      component: plan.component.id,
      theme: plan.theme.id,
      tokens: [`${themePrefix}tokens.json`],
      fonts: [`${themePrefix}meta.json`],
      designRules: [`${themePrefix}design-rules.json`],
    },
  };
}
