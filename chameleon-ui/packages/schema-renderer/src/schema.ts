/**
 * SchemaRenderer core: compile a declarative JSON render-schema into a
 * component tree description. Protocol-agnostic; the L3/L4 protocol adapters
 * (a2ui / mcp-apps / ag-ui) translate their wire formats, this package renders
 * the result with real Chameleon UI components.
 */

export const RENDER_SCHEMA_ID =
  'https://chameleon-ui.dev/schemas/ui-render/v1.0.json' as const

export interface SchemaNode {
  /** Chameleon UI component slug (must exist in the component map). */
  component: string
  props?: Record<string, unknown>
  children?: Array<SchemaNode | string>
  key?: string
}

export interface RenderSchema {
  $schema?: string
  version: '1.0'
  root: SchemaNode
}

export type CompileErrorReason =
  | 'invalid_schema'
  | 'unknown_component'
  | 'invalid_props'
  | 'depth_exceeded'
  | 'node_budget_exceeded'

export class SchemaCompileError extends Error {
  constructor(
    message: string,
    public readonly path: string,
    public readonly reason: CompileErrorReason,
  ) {
    super(message)
    this.name = 'SchemaCompileError'
  }
}

export interface CompileIssue {
  path: string
  reason: CompileErrorReason
  message: string
}

export interface CompiledNode {
  key: string
  slug: string
  props: Record<string, unknown>
  children: Array<CompiledNode | string>
  /** Set when the source node failed to compile but the tree recovered. */
  error?: string
}

export interface CompileResult {
  tree: CompiledNode | null
  issues: CompileIssue[]
}

/** Hard guards against exponential/pathing blow-ups (禁指数展开). */
export const MAX_RENDER_DEPTH = 32
export const MAX_RENDER_NODES = 500

/** Sentinel slug used for recovered error nodes in the compiled tree. */
export const ERROR_NODE_SLUG = '__error__' as const

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Compile a render-schema into a node tree.
 *
 * @complexity time O(n) | space O(n) | n = schema node count; depth and node budget are hard caps
 * @guarantees recoverable: unknown components become error nodes instead of throwing
 */
export function compileSchema(
  schema: unknown,
  knownSlugs: ReadonlySet<string>,
): CompileResult {
  const issues: CompileIssue[] = []

  if (!isObject(schema) || schema.version !== '1.0' || !isObject(schema.root)) {
    throw new SchemaCompileError(
      'Render schema must be an object with version "1.0" and a root node.',
      '/',
      'invalid_schema',
    )
  }

  let nodeCount = 0

  function compileNode(node: unknown, path: string, depth: number): CompiledNode | string {
    if (typeof node === 'string') return node

    nodeCount += 1
    if (nodeCount > MAX_RENDER_NODES) {
      throw new SchemaCompileError(
        `Render schema exceeds the ${MAX_RENDER_NODES}-node budget.`,
        path,
        'node_budget_exceeded',
      )
    }
    if (depth > MAX_RENDER_DEPTH) {
      throw new SchemaCompileError(
        `Render schema exceeds the ${MAX_RENDER_DEPTH}-level depth cap.`,
        path,
        'depth_exceeded',
      )
    }

    if (!isObject(node) || typeof node.component !== 'string') {
      issues.push({
        path,
        reason: 'invalid_schema',
        message: 'Node must be an object with a component slug, or a string.',
      })
      return { key: path, slug: ERROR_NODE_SLUG, props: {}, children: [], error: 'invalid node' }
    }

    const props = node.props ?? {}
    if (!isObject(props)) {
      issues.push({
        path,
        reason: 'invalid_props',
        message: `props of "${node.component}" must be a plain object.`,
      })
      return {
        key: path,
        slug: ERROR_NODE_SLUG,
        props: {},
        children: [],
        error: 'invalid props',
      }
    }

    if (!knownSlugs.has(node.component)) {
      issues.push({
        path,
        reason: 'unknown_component',
        message: `Unknown component slug "${node.component}".`,
      })
      return {
        key: path,
        slug: ERROR_NODE_SLUG,
        props: {},
        children: [],
        error: `unknown component: ${node.component}`,
      }
    }

    const rawChildren = Array.isArray(node.children) ? node.children : []
    const children = rawChildren.map((child: unknown, index: number) =>
      compileNode(child, `${path}/${index}`, depth + 1),
    )

    return {
      key: typeof node.key === 'string' ? node.key : path,
      slug: node.component,
      props,
      children,
    }
  }

  const tree = compileNode(schema.root, '/root', 0)
  if (typeof tree === 'string') {
    throw new SchemaCompileError('Render schema root cannot be a string.', '/root', 'invalid_schema')
  }
  return { tree, issues }
}
