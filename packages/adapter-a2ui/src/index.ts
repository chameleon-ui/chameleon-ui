import { planInstall, type InstallPlanEntry } from '@chameleon-ui/install-core'
import { getRegistryItem, type RegistryItem } from '@chameleon-ui/registry'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const A2UI_PROTOCOL = 'a2ui' as const

export interface A2UIElement {
  id: string
  type: string
  name?: string
  props?: Record<string, unknown>
  children?: A2UIElement[]
}

export interface A2UIDocument {
  version: '1.0'
  kind: 'a2ui'
  root: A2UIElement
}

export type A2UIComponentMap = Record<string, string>

/**
 * Default mapping from A2UI protocol element types to Chameleon UI component slugs.
 * @complexity lookup O(1) | m = number of mapped types
 */
export const DEFAULT_A2UI_COMPONENT_MAP: A2UIComponentMap = {
  button: 'button',
  'text-field': 'input',
  'text-input': 'input',
  form: 'form',
  submit: 'button',
  select: 'select',
}

export class A2UIAdapterError extends Error {
  constructor(
    message: string,
    public readonly path: string[],
    public readonly reason: 'unknown_type' | 'missing_registry_item' | 'invalid_document',
  ) {
    super(message)
    this.name = 'A2UIAdapterError'
  }
}

export interface A2UIRenderNode {
  id: string
  protocolType: string
  slug?: string
  item?: RegistryItem
  props?: Record<string, unknown>
  children: A2UIRenderNode[]
}

export interface A2UIInstallPlanEntry extends InstallPlanEntry {
  /** Protocol source marker for telemetry and audit. */
  source: typeof A2UI_PROTOCOL
}

function lookupRegistryItem(registry: RegistryItem[], slug: string): RegistryItem | undefined {
  return getRegistryItem(slug) ?? registry.find((item) => item.id === slug)
}

/**
 * Map a single A2UI element to a Chameleon registry item.
 * @complexity time O(1) for the map lookup + O(1) registry lookup with the pre-built index | space O(1)
 */
export function mapA2UIElement(
  element: A2UIElement,
  registry: RegistryItem[],
  map: A2UIComponentMap = DEFAULT_A2UI_COMPONENT_MAP,
): { slug: string; item: RegistryItem } {
  const slug = map[element.type]
  if (!slug) {
    throw new A2UIAdapterError(
      `A2UI element type "${element.type}" has no Chameleon UI mapping.`,
      [element.id],
      'unknown_type',
    )
  }
  const item = lookupRegistryItem(registry, slug)
  if (!item) {
    throw new A2UIAdapterError(
      `Mapped component "${slug}" is not available in the registry.`,
      [element.id],
      'missing_registry_item',
    )
  }
  return { slug, item }
}

/**
 * Convert an A2UI document into an install plan.
 * The plan is handed to `install-core` for the actual disk write.
 * @complexity time O(n + e + v) | n = element count, e = dependency edges, v = registry items touched
 */
export function adapt(
  doc: A2UIDocument,
  registry: RegistryItem[],
  map: A2UIComponentMap = DEFAULT_A2UI_COMPONENT_MAP,
): A2UIInstallPlanEntry[] {
  const found = new Map<string, A2UIInstallPlanEntry>()
  const order: string[] = []

  function collect(element: A2UIElement) {
    const { item } = mapA2UIElement(element, registry, map)
    if (!found.has(item.id)) {
      const plan = planInstall(registry, item.id)
      for (const entry of plan) {
        if (!found.has(entry.item.id)) {
          found.set(entry.item.id, { ...entry, source: A2UI_PROTOCOL })
          order.push(entry.item.id)
        }
      }
    }
    for (const child of element.children ?? []) {
      collect(child)
    }
  }

  collect(doc.root)
  return order.map((id) => found.get(id)!)
}

function buildRenderNode(
  element: A2UIElement,
  registry: RegistryItem[],
  map: A2UIComponentMap,
): A2UIRenderNode {
  const slug = map[element.type]
  const item = slug ? lookupRegistryItem(registry, slug) : undefined
  return {
    id: element.id,
    protocolType: element.type,
    slug,
    item,
    props: element.props,
    children: (element.children ?? []).map((child) => buildRenderNode(child, registry, map)),
  }
}

function buildRenderTree(
  doc: A2UIDocument,
  registry: RegistryItem[],
  map: A2UIComponentMap,
): A2UIRenderNode {
  return buildRenderNode(doc.root, registry, map)
}

/**
 * SchemaRenderer: input protocol directory → mapped Chameleon UI component slugs.
 * Keeps protocol-specific logic inside the adapter (L3/L4) and away from L1/L2.
 */
export class SchemaRenderer {
  constructor(
    private readonly registry: RegistryItem[],
    private readonly map: A2UIComponentMap = DEFAULT_A2UI_COMPONENT_MAP,
  ) {}

  renderDocument(doc: A2UIDocument): A2UIRenderNode {
    return buildRenderTree(doc, this.registry, this.map)
  }

  /**
   * Read all `.json` files in a directory and render each A2UI document.
   * @complexity time O(k + n) | k = files in directory, n = total elements
   */
  async renderDirectory(dir: string): Promise<A2UIRenderNode[]> {
    const entries = await readdir(dir)
    const docs: A2UIDocument[] = []

    for (const name of entries.sort()) {
      if (!name.endsWith('.json')) continue
      const text = await readFile(join(dir, name), 'utf-8')
      const parsed = JSON.parse(text) as Partial<A2UIDocument>
      if (parsed.kind !== 'a2ui') {
        throw new A2UIAdapterError(
          `File ${name} is not an A2UI document (kind=${parsed.kind ?? 'undefined'}).`,
          [name],
          'invalid_document',
        )
      }
      docs.push(parsed as A2UIDocument)
    }

    return docs.map((doc) => buildRenderTree(doc, this.registry, this.map))
  }
}
