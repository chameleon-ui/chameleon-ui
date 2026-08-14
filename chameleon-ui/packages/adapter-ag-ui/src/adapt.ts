import { planInstall, type InstallPlanEntry } from '@chameleon-ui/install-core'
import { getRegistryItem, type RegistryItem } from '@chameleon-ui/registry'

export const AG_UI_PROTOCOL = 'ag-ui' as const

/** Minimal render-directive document this adapter accepts from an AG-UI host. */
export interface AgUiRenderElement {
  id: string
  type: string
  props?: Record<string, unknown>
  children?: AgUiRenderElement[]
}

export interface AgUiRenderDirective {
  kind: typeof AG_UI_PROTOCOL
  version: '1.0'
  root: AgUiRenderElement
}

export type AgUiComponentMap = Record<string, string>

export const DEFAULT_AG_UI_COMPONENT_MAP: AgUiComponentMap = {
  button: 'button',
  'text-field': 'input',
  'text-input': 'input',
  form: 'form',
  submit: 'button',
  select: 'select',
}

export class AgUiAdapterError extends Error {
  constructor(
    message: string,
    public readonly path: string[],
    public readonly reason: 'unknown_type' | 'missing_registry_item' | 'invalid_document',
  ) {
    super(message)
    this.name = 'AgUiAdapterError'
  }
}

export interface AgUiInstallPlanEntry extends InstallPlanEntry {
  /** Protocol source marker for telemetry and audit (source=ag-ui). */
  source: typeof AG_UI_PROTOCOL
}

function lookupRegistryItem(registry: RegistryItem[], slug: string): RegistryItem | undefined {
  return getRegistryItem(slug) ?? registry.find((item) => item.id === slug)
}

/**
 * Convert an AG-UI render directive into an install plan. The plan is handed
 * to install-core for the actual disk write — this adapter never writes.
 * Protocol logic stays in L3/L4 (this package); L1/L2 stay clean.
 *
 * @complexity time O(n + e + v) | n = elements, e = dependency edges, v = registry items touched
 */
export function adapt(
  directive: AgUiRenderDirective,
  registry: RegistryItem[],
  map: AgUiComponentMap = DEFAULT_AG_UI_COMPONENT_MAP,
): AgUiInstallPlanEntry[] {
  if (directive.kind !== AG_UI_PROTOCOL) {
    throw new AgUiAdapterError(
      `Document is not kind=${AG_UI_PROTOCOL}.`,
      ['kind'],
      'invalid_document',
    )
  }

  const found = new Map<string, AgUiInstallPlanEntry>()
  const order: string[] = []

  function collect(element: AgUiRenderElement) {
    const slug = map[element.type]
    if (!slug) {
      throw new AgUiAdapterError(
        `AG-UI element type "${element.type}" has no Chameleon UI mapping.`,
        [element.id],
        'unknown_type',
      )
    }
    const item = lookupRegistryItem(registry, slug)
    if (!item) {
      throw new AgUiAdapterError(
        `Mapped component "${slug}" is not available in the registry.`,
        [element.id],
        'missing_registry_item',
      )
    }
    if (!found.has(item.id)) {
      const plan = planInstall(registry, item.id)
      for (const entry of plan) {
        if (!found.has(entry.item.id)) {
          found.set(entry.item.id, { ...entry, source: AG_UI_PROTOCOL })
          order.push(entry.item.id)
        }
      }
    }
    for (const child of element.children ?? []) {
      collect(child)
    }
  }

  collect(directive.root)
  return order.map((id) => found.get(id)!)
}
