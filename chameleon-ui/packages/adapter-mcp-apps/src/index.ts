import { planInstall, type InstallPlanEntry } from '@chameleon-ui/install-core'
import { getRegistryItem, type RegistryItem } from '@chameleon-ui/registry'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

/** SEP-1865 MCP Apps extension id. Optional; hosts must negotiate it. */
export const MCP_APPS_EXTENSION = 'io.modelcontextprotocol/ui' as const

export const MCP_APPS_PROTOCOL = 'mcp-apps' as const

/** Initial MCP Apps content type (HTML-only MVP). */
export const MCP_APPS_MIME = 'text/html;profile=mcp-app' as const

export const MCP_APPS_SPEC_VERSION = '2026-01-26' as const

export interface McpAppsWidget {
  id: string
  type: string
  props?: Record<string, unknown>
  children?: McpAppsWidget[]
}

/**
 * Local document shape for this POC.
 * Not the full host wire protocol. `kind` keeps protocol logic out of L1/L2.
 */
export interface McpAppsDocument {
  version: typeof MCP_APPS_SPEC_VERSION
  kind: typeof MCP_APPS_PROTOCOL
  uri: string
  mimeType: typeof MCP_APPS_MIME
  title?: string
  root: McpAppsWidget
}

export type McpAppsComponentMap = Record<string, string>

/**
 * Default mapping from MCP Apps widget types to Chameleon UI component slugs.
 * @complexity lookup O(1) | m = number of mapped types
 */
export const DEFAULT_MCP_APPS_COMPONENT_MAP: McpAppsComponentMap = {
  button: 'button',
  'text-field': 'input',
  'text-input': 'input',
  form: 'form',
  submit: 'button',
  select: 'select',
}

export class McpAppsAdapterError extends Error {
  constructor(
    message: string,
    public readonly path: string[],
    public readonly reason: 'unknown_type' | 'missing_registry_item' | 'invalid_document' | 'invalid_uri',
  ) {
    super(message)
    this.name = 'McpAppsAdapterError'
  }
}

export interface McpAppsRenderNode {
  id: string
  protocolType: string
  slug?: string
  item?: RegistryItem
  props?: Record<string, unknown>
  children: McpAppsRenderNode[]
}

export interface McpAppsInstallPlanEntry extends InstallPlanEntry {
  source: typeof MCP_APPS_PROTOCOL
}

export interface McpAppsUiResource {
  uri: string
  mimeType: typeof MCP_APPS_MIME
  text: string
}

export interface McpAppsToolUiMeta {
  _meta: {
    ui: {
      resourceUri: string
    }
  }
}

function lookupRegistryItem(registry: RegistryItem[], slug: string): RegistryItem | undefined {
  return getRegistryItem(slug) ?? registry.find((item) => item.id === slug)
}

function assertUiUri(uri: string, path: string[]): void {
  if (!uri.startsWith('ui://')) {
    throw new McpAppsAdapterError(
      `MCP Apps resource URI must use the ui:// scheme (got ${uri}).`,
      path,
      'invalid_uri',
    )
  }
}

/**
 * Map a single MCP Apps widget to a Chameleon registry item.
 * @complexity time O(1) for the map lookup + O(1) registry lookup | space O(1)
 */
export function mapMcpAppsWidget(
  widget: McpAppsWidget,
  registry: RegistryItem[],
  map: McpAppsComponentMap = DEFAULT_MCP_APPS_COMPONENT_MAP,
): { slug: string; item: RegistryItem } {
  const slug = map[widget.type]
  if (!slug) {
    throw new McpAppsAdapterError(
      `MCP Apps widget type "${widget.type}" has no Chameleon UI mapping.`,
      [widget.id],
      'unknown_type',
    )
  }
  const item = lookupRegistryItem(registry, slug)
  if (!item) {
    throw new McpAppsAdapterError(
      `Mapped component "${slug}" is not available in the registry.`,
      [widget.id],
      'missing_registry_item',
    )
  }
  return { slug, item }
}

/**
 * Convert an MCP Apps document into an install plan.
 * The plan is handed to `install-core` for the actual disk write.
 * @complexity time O(n + e + v) | n = widget count, e = dependency edges, v = registry items touched
 */
export function adapt(
  doc: McpAppsDocument,
  registry: RegistryItem[],
  map: McpAppsComponentMap = DEFAULT_MCP_APPS_COMPONENT_MAP,
): McpAppsInstallPlanEntry[] {
  if (doc.kind !== MCP_APPS_PROTOCOL) {
    throw new McpAppsAdapterError(
      `Document is not kind=${MCP_APPS_PROTOCOL}.`,
      ['kind'],
      'invalid_document',
    )
  }
  assertUiUri(doc.uri, ['uri'])

  const found = new Map<string, McpAppsInstallPlanEntry>()
  const order: string[] = []

  function collect(widget: McpAppsWidget) {
    const { item } = mapMcpAppsWidget(widget, registry, map)
    if (!found.has(item.id)) {
      const plan = planInstall(registry, item.id)
      for (const entry of plan) {
        if (!found.has(entry.item.id)) {
          found.set(entry.item.id, { ...entry, source: MCP_APPS_PROTOCOL })
          order.push(entry.item.id)
        }
      }
    }
    for (const child of widget.children ?? []) {
      collect(child)
    }
  }

  collect(doc.root)
  return order.map((id) => found.get(id)!)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderWidgetHtml(widget: McpAppsWidget): string {
  const label = typeof widget.props?.label === 'string' ? widget.props.label : widget.id
  const name = typeof widget.props?.name === 'string' ? widget.props.name : widget.id
  const children = (widget.children ?? []).map(renderWidgetHtml).join('\n')

  if (widget.type === 'form') {
    return `<form data-cu-widget="${escapeHtml(widget.id)}" data-cu-type="form">${children}</form>`
  }
  if (widget.type === 'text-field' || widget.type === 'text-input') {
    return `<label data-cu-widget="${escapeHtml(widget.id)}">${escapeHtml(label)} <input name="${escapeHtml(name)}" type="text"></label>`
  }
  if (widget.type === 'button' || widget.type === 'submit') {
    const type = widget.props?.intent === 'submit' || widget.type === 'submit' ? 'submit' : 'button'
    return `<button data-cu-widget="${escapeHtml(widget.id)}" type="${type}">${escapeHtml(label)}</button>`
  }
  if (widget.type === 'select') {
    return `<label data-cu-widget="${escapeHtml(widget.id)}">${escapeHtml(label)} <select name="${escapeHtml(name)}"></select></label>`
  }
  return `<div data-cu-widget="${escapeHtml(widget.id)}" data-cu-type="${escapeHtml(widget.type)}">${children}</div>`
}

/**
 * Emit a predeclared MCP Apps HTML resource (text/html;profile=mcp-app).
 * Bidirectional host JSON-RPC is not wired in this POC.
 * @complexity time O(n) | n = widget count
 */
export function toUiResource(doc: McpAppsDocument): McpAppsUiResource {
  if (doc.kind !== MCP_APPS_PROTOCOL) {
    throw new McpAppsAdapterError(
      `Document is not kind=${MCP_APPS_PROTOCOL}.`,
      ['kind'],
      'invalid_document',
    )
  }
  assertUiUri(doc.uri, ['uri'])
  const title = escapeHtml(doc.title ?? 'Chameleon UI MCP App POC')
  const body = renderWidgetHtml(doc.root)
  const text = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="color-scheme" content="light dark">',
    `  <title>${title}</title>`,
    '</head>',
    '<body>',
    '  <p data-cu-poc="mcp-apps">POC HTML template. Not a host certification. Bidirectional JSON-RPC is not wired.</p>',
    `  ${body}`,
    '</body>',
    '</html>',
    '',
  ].join('\n')

  return {
    uri: doc.uri,
    mimeType: MCP_APPS_MIME,
    text,
  }
}

/** Tool metadata that associates a tool with a predeclared ui:// resource. */
export function toolUiMeta(resourceUri: string): McpAppsToolUiMeta {
  assertUiUri(resourceUri, ['resourceUri'])
  return { _meta: { ui: { resourceUri } } }
}

function buildRenderNode(
  widget: McpAppsWidget,
  registry: RegistryItem[],
  map: McpAppsComponentMap,
): McpAppsRenderNode {
  const slug = map[widget.type]
  const item = slug ? lookupRegistryItem(registry, slug) : undefined
  return {
    id: widget.id,
    protocolType: widget.type,
    slug,
    item,
    props: widget.props,
    children: (widget.children ?? []).map((child) => buildRenderNode(child, registry, map)),
  }
}

/**
 * SchemaRenderer: MCP Apps document → mapped Chameleon UI component slugs.
 * Keeps protocol-specific logic inside the adapter (L3/L4).
 */
export class SchemaRenderer {
  constructor(
    private readonly registry: RegistryItem[],
    private readonly map: McpAppsComponentMap = DEFAULT_MCP_APPS_COMPONENT_MAP,
  ) {}

  renderDocument(doc: McpAppsDocument): McpAppsRenderNode {
    if (doc.kind !== MCP_APPS_PROTOCOL) {
      throw new McpAppsAdapterError(
        `Document is not kind=${MCP_APPS_PROTOCOL}.`,
        ['kind'],
        'invalid_document',
      )
    }
    assertUiUri(doc.uri, ['uri'])
    return buildRenderNode(doc.root, this.registry, this.map)
  }

  /**
   * Read all `.json` files in a directory and render each MCP Apps document.
   * @complexity time O(k + n) | k = files in directory, n = total widgets
   */
  async renderDirectory(dir: string): Promise<McpAppsRenderNode[]> {
    const entries = await readdir(dir)
    const docs: McpAppsDocument[] = []

    for (const name of entries.sort()) {
      if (!name.endsWith('.json')) continue
      const text = await readFile(join(dir, name), 'utf-8')
      const parsed = JSON.parse(text) as Partial<McpAppsDocument>
      if (parsed.kind !== MCP_APPS_PROTOCOL) {
        throw new McpAppsAdapterError(
          `File ${name} is not an MCP Apps document (kind=${parsed.kind ?? 'undefined'}).`,
          [name],
          'invalid_document',
        )
      }
      docs.push(parsed as McpAppsDocument)
    }

    return docs.map((doc) => this.renderDocument(doc))
  }
}
