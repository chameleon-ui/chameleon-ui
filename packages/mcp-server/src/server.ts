import {
  createInstallKernel,
  emitIntentVsAdopt,
  emitOptOut,
  type TelemetryHook,
} from '@chameleon-ui/install-core'
import {
  createRegistryClientFromEnv,
  installWithTheme,
  prepareInstall,
  searchByIntent,
  type RegistryClient,
} from '@chameleon-ui/registry'
import { resolve } from 'node:path'
import { listComponentsByFamily } from './catalog-summary.js'
import { MCP_TOOL_NAMES } from './constants.js'
import { extractContract, extractDesignRules } from './extract.js'
import { getStartedPayload, MCP_INSTRUCTIONS } from './get-started.js'
import { consumerImportSpecifiers } from './specifiers.js'

export { MCP_TOOL_NAMES } from './constants.js'
export { MCP_INSTRUCTIONS } from './get-started.js'

export interface JsonRpcRequest {
  jsonrpc: '2.0'
  id?: number | string
  method: string
  params?: Record<string, unknown>
}

export interface JsonRpcResponse {
  jsonrpc: '2.0'
  id?: number | string
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

function log(message: string): void {
  console.error(message)
}

function createTelemetryHook(): TelemetryHook | undefined {
  const enabled = process.env.CU_TELEMETRY === '1'
  if (!enabled) return undefined
  return (event, payload) => {
    log(JSON.stringify({ event, payload }))
  }
}

function targetDir(): string {
  return resolve(process.cwd(), process.env.CU_TARGET_DIR ?? 'chameleon-ui')
}

export function jsonRpcError(
  id: number | string | undefined,
  code: number,
  message: string,
): JsonRpcResponse {
  return { jsonrpc: '2.0', id, error: { code, message } }
}

function createClient(): RegistryClient {
  return createRegistryClientFromEnv(process.env, 'mcp')
}

function stringArg(args: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = args[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export const TOOL_DEFINITIONS = [
  {
    name: 'get_started',
    description:
      'Call first in a Chameleon UI consumer session. Returns catalog summary, flagship theme line, CSS + ThemeProvider recipe, tool order, templates, and never-do rules.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_components',
    description:
      'List catalog slugs grouped by family (from packages/components/catalog.json). Use for browsing; prefer search_components with intent when the user describes a need.',
    inputSchema: {
      type: 'object',
      properties: {
        family: {
          type: 'string',
          description: 'Optional family filter, e.g. A, B, C. Omit to return all families.',
        },
      },
    },
  },
  {
    name: 'search_components',
    description:
      'Search UI components by id/name (query) or by intent (intent). Prefer intent for "I need a submit control" style requests. Results include explainable matched contract fields. If this is your first Chameleon call, call get_started first.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        intent: { type: 'string' },
      },
    },
  },
  {
    name: 'get_component',
    description: 'Get full registry metadata (files, deps) for a component id. For the v0.2 contract only, call get_contract.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_contract',
    description:
      'Return the v0.2 component-contract JSON for a slug (purpose, props, composition, dataAi triple). Use this before emitting JSX for that component.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Catalog slug, e.g. button' },
        id: { type: 'string', description: 'Alias of slug' },
      },
    },
  },
  {
    name: 'get_design_rules',
    description:
      'Return design-rules.json for an official theme id (or community rules pack id). Call before choosing spacing, radius, or RTL behavior.',
    inputSchema: {
      type: 'object',
      properties: {
        theme_id: { type: 'string', description: 'Theme id, e.g. line' },
        id: { type: 'string', description: 'Alias of theme_id' },
      },
    },
  },
  {
    name: 'get_import_specifiers',
    description:
      'Return the only legal CSS/JS import specifiers for an external (non-pnpm-workspace) app. Call this BEFORE writing any import. Default theme is line. Do not guess dist/ paths or write workspace:*.',
    inputSchema: {
      type: 'object',
      properties: {
        theme_id: { type: 'string' },
        slug: { type: 'string' },
      },
    },
  },
  {
    name: 'install_component',
    description: 'Install a single component into CU_TARGET_DIR via install-core (the only write path).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'install_block',
    description:
      'Install a scenario block (registry:block) and its component dependencies into CU_TARGET_DIR via install-core.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_themes',
    description: 'List the 8 official tribute themes. Flagship product chrome is line.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'install_theme',
    description: 'Install a single theme into CU_TARGET_DIR via install-core.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'install_bundle',
    description: 'Install a component and a theme together (two install-core runs). Prefer install_with_theme for the four-piece set.',
    inputSchema: {
      type: 'object',
      properties: {
        component_id: { type: 'string' },
        theme_id: { type: 'string' },
      },
      required: ['component_id', 'theme_id'],
    },
  },
  {
    name: 'install_with_theme',
    description:
      'Install a component together with a theme four-piece set (component + tokens + fonts + design-rules) in ONE idempotent install-core run.',
    inputSchema: {
      type: 'object',
      properties: {
        component_id: { type: 'string' },
        theme_id: { type: 'string' },
      },
      required: ['component_id', 'theme_id'],
    },
  },
  {
    name: 'telemetry_opt_out',
    description: 'Disable telemetry and record an opt-out event. Telemetry is off by default.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'record_intent',
    description: 'Record an intent-vs-adopt telemetry event (no-op unless CU_TELEMETRY=1).',
    inputSchema: {
      type: 'object',
      properties: {
        intent: { type: 'string' },
        adopted: { type: 'boolean' },
      },
      required: ['intent', 'adopted'],
    },
  },
] as const

function assertToolNamesLocked(): void {
  const listed = TOOL_DEFINITIONS.map((tool) => tool.name)
  if (listed.length !== MCP_TOOL_NAMES.length) {
    throw new Error('TOOL_DEFINITIONS length must match MCP_TOOL_NAMES')
  }
  for (let index = 0; index < MCP_TOOL_NAMES.length; index += 1) {
    if (listed[index] !== MCP_TOOL_NAMES[index]) {
      throw new Error(
        `TOOL_DEFINITIONS[${index}] is ${listed[index]}, expected ${MCP_TOOL_NAMES[index]}`,
      )
    }
  }
}

assertToolNamesLocked()

export async function handleToolCall(request: JsonRpcRequest): Promise<JsonRpcResponse> {
  const name = (request.params?.name as string) ?? ''
  const args = (request.params?.arguments as Record<string, unknown>) ?? {}
  const telemetry = createTelemetryHook()
  const dir = targetDir()
  const client = createClient()

  switch (name) {
    case 'get_started': {
      return { jsonrpc: '2.0', id: request.id, result: getStartedPayload() }
    }
    case 'list_components': {
      const family = stringArg(args, 'family')
      const listed = listComponentsByFamily()
      if (family) {
        const match = listed.families.find(
          (entry) => entry.family.toLowerCase() === family.toLowerCase(),
        )
        if (!match) {
          return jsonRpcError(request.id, -32602, `Unknown family: ${family}`)
        }
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            total: match.slugs.length,
            families: [match],
            components: listed.components.filter((entry) => entry.family === match.family),
          },
        }
      }
      return { jsonrpc: '2.0', id: request.id, result: listed }
    }
    case 'search_components': {
      const query = (args.query as string) ?? ''
      const intent = typeof args.intent === 'string' ? args.intent : ''
      if (intent.trim()) {
        const all = await client.search(undefined)
        const hits = searchByIntent(intent, all)
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            intent,
            items: hits.map((hit) => ({
              id: hit.item.id,
              name: hit.item.name,
              namespace: hit.item.namespace,
              version: hit.item.version,
              score: hit.score,
              matched: hit.matched.map((entry) => `${entry.field}: ${entry.value}`),
            })),
          },
        }
      }
      const items = (await client.search(query)).filter((item) => item.type === 'registry:ui')
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            namespace: item.namespace,
            version: item.version,
          })),
        },
      }
    }
    case 'get_component': {
      const id = (args.id as string) ?? ''
      const version = typeof args.version === 'string' ? args.version : undefined
      const item = await client.getItem(id, { version })
      if (!item) {
        return jsonRpcError(request.id, -32602, `Unknown component: ${id}`)
      }
      return { jsonrpc: '2.0', id: request.id, result: { item } }
    }
    case 'get_contract': {
      const slug = stringArg(args, 'slug', 'id')
      if (!slug) {
        return jsonRpcError(request.id, -32602, 'get_contract requires slug (or id)')
      }
      const item = await client.getItem(slug)
      if (!item || item.type !== 'registry:ui') {
        return jsonRpcError(request.id, -32602, `Unknown component: ${slug}`)
      }
      const contract = extractContract(item)
      if (!contract || typeof contract !== 'object') {
        return jsonRpcError(request.id, -32602, `No contract.json for slug: ${slug}`)
      }
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          slug,
          path: `packages/components/src/${slug}/contract.json`,
          export: `@chameleon-ui/components/contracts/${slug}`,
          schemaVersion: (contract as { schemaVersion?: string }).schemaVersion,
          contract,
        },
      }
    }
    case 'get_design_rules': {
      const themeId = stringArg(args, 'theme_id', 'id')
      if (!themeId) {
        return jsonRpcError(request.id, -32602, 'get_design_rules requires theme_id (or id)')
      }
      const item = await client.getItem(themeId)
      if (!item || (item.type !== 'registry:theme' && item.type !== 'registry:rules')) {
        return jsonRpcError(request.id, -32602, `Unknown theme or rules pack: ${themeId}`)
      }
      const rules = extractDesignRules(item)
      if (!rules || typeof rules !== 'object') {
        return jsonRpcError(request.id, -32602, `No design-rules.json for: ${themeId}`)
      }
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          id: themeId,
          type: item.type,
          path:
            item.type === 'registry:rules'
              ? `packages/themes/src/${themeId}/design-rules.json`
              : `packages/themes/src/${themeId}/design-rules.json`,
          export: `@chameleon-ui/themes/${themeId}/design-rules`,
          version: (rules as { version?: string }).version,
          rules,
        },
      }
    }
    case 'get_import_specifiers': {
      const themeId = stringArg(args, 'theme_id', 'theme') || undefined
      const slug = stringArg(args, 'slug') || undefined
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: consumerImportSpecifiers(themeId, slug),
      }
    }
    case 'install_component': {
      const id = (args.id as string) ?? ''
      const version = typeof args.version === 'string' ? args.version : undefined
      const prepared = await prepareInstall(client, id, { version })
      if (!prepared || prepared.item.type !== 'registry:ui') {
        return jsonRpcError(request.id, -32602, `Unknown component: ${id}`)
      }
      const kernel = createInstallKernel(prepared.registry)
      const result = await kernel.install(prepared.item, dir, { telemetry, source: 'mcp' })
      return { jsonrpc: '2.0', id: request.id, result }
    }
    case 'install_block': {
      const id = (args.id as string) ?? ''
      const version = typeof args.version === 'string' ? args.version : undefined
      const prepared = await prepareInstall(client, id, { version })
      if (!prepared || prepared.item.type !== 'registry:block') {
        return jsonRpcError(request.id, -32602, `Unknown block: ${id}`)
      }
      const kernel = createInstallKernel(prepared.registry)
      const result = await kernel.install(prepared.item, dir, { telemetry, source: 'mcp' })
      return { jsonrpc: '2.0', id: request.id, result }
    }
    case 'list_themes': {
      const themes = await client.listThemes()
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          themes: themes.map((item) => ({
            id: item.id,
            name: item.name,
            namespace: item.namespace,
            version: item.version,
          })),
        },
      }
    }
    case 'install_theme': {
      const id = (args.id as string) ?? ''
      const version = typeof args.version === 'string' ? args.version : undefined
      const prepared = await prepareInstall(client, id, { version })
      if (!prepared || prepared.item.type !== 'registry:theme') {
        return jsonRpcError(request.id, -32602, `Unknown theme: ${id}`)
      }
      const kernel = createInstallKernel(prepared.registry)
      const result = await kernel.install(prepared.item, dir, { telemetry, source: 'mcp' })
      return { jsonrpc: '2.0', id: request.id, result }
    }
    case 'install_bundle': {
      const componentId = (args.component_id as string) ?? ''
      const themeId = (args.theme_id as string) ?? ''
      const component = await prepareInstall(client, componentId)
      const theme = await prepareInstall(client, themeId)
      if (!component || component.item.type !== 'registry:ui') {
        return jsonRpcError(request.id, -32602, `Unknown component: ${componentId}`)
      }
      if (!theme || theme.item.type !== 'registry:theme') {
        return jsonRpcError(request.id, -32602, `Unknown theme: ${themeId}`)
      }
      const kernel = createInstallKernel([...component.registry, ...theme.registry])
      const componentResult = await kernel.install(component.item, dir, { telemetry, source: 'mcp' })
      const themeResult = await kernel.install(theme.item, dir, { telemetry, source: 'mcp' })
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          written: [...componentResult.written, ...themeResult.written],
          skipped: [...componentResult.skipped, ...themeResult.skipped],
          installed: [...componentResult.installed, ...themeResult.installed],
        },
      }
    }
    case 'install_with_theme': {
      const componentId = (args.component_id as string) ?? ''
      const themeId = (args.theme_id as string) ?? ''
      try {
        const result = await installWithTheme(client, componentId, themeId, dir, {
          telemetry,
          source: 'mcp',
        })
        return { jsonrpc: '2.0', id: request.id, result }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        return jsonRpcError(request.id, -32602, message)
      }
    }
    case 'telemetry_opt_out': {
      await emitOptOut(telemetry, { previousEvents: 0 })
      return { jsonrpc: '2.0', id: request.id, result: { disabled: true } }
    }
    case 'record_intent': {
      const intent = (args.intent as string) ?? ''
      const adopted = args.adopted === true
      await emitIntentVsAdopt(telemetry, { intent, adopted })
      return { jsonrpc: '2.0', id: request.id, result: { recorded: true } }
    }
    default: {
      return jsonRpcError(request.id, -32601, `Unknown tool: ${name}`)
    }
  }
}

export async function handleMessage(
  request: JsonRpcRequest,
): Promise<JsonRpcResponse | undefined> {
  switch (request.method) {
    case 'initialize': {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'chameleon-ui-mcp', version: '0.2.0' },
          instructions: MCP_INSTRUCTIONS,
        },
      }
    }
    case 'initialized': {
      return undefined
    }
    case 'tools/list': {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: { tools: TOOL_DEFINITIONS },
      }
    }
    case 'tools/call': {
      try {
        return await handleToolCall(request)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        return jsonRpcError(request.id, -32000, message)
      }
    }
    default: {
      return jsonRpcError(request.id, -32601, `Unknown method: ${request.method}`)
    }
  }
}
