import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  Heading,
  Input,
  Stack,
  Typography,
} from '@chameleon-ui/components-react'
import { createElement, useMemo, type ComponentType, type ReactNode } from 'react'
import {
  compileSchema,
  ERROR_NODE_SLUG,
  type CompileIssue,
  type CompiledNode,
  type RenderSchema,
} from './schema.js'

/**
 * Slug → React component map shared with the protocol adapters (they resolve
 * protocol types to these same slugs). Only slugs in this map render.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaComponentMap = Record<string, ComponentType<any>>

export const DEFAULT_COMPONENT_MAP: SchemaComponentMap = {
  alert: Alert,
  badge: Badge,
  button: Button,
  card: Card,
  divider: Divider,
  'empty-state': EmptyState,
  heading: Heading,
  input: Input,
  stack: Stack,
  typography: Typography,
}

const noop = () => {}

function propsFor(slug: string, props: Record<string, unknown>): Record<string, unknown> {
  // Controlled inputs need an onChange; schema-driven render is display-first,
  // so a missing handler degrades to a no-op instead of a React warning storm.
  if (slug === 'input') {
    return {
      ...props,
      value: typeof props.value === 'string' ? props.value : String(props.value ?? ''),
      onChange: typeof props.onChange === 'function' ? props.onChange : noop,
    }
  }
  if (slug === 'button') {
    return { type: 'button', ...props }
  }
  return props
}

function renderNode(
  node: CompiledNode | string,
  map: SchemaComponentMap,
): ReactNode {
  if (typeof node === 'string') return node

  if (node.slug === ERROR_NODE_SLUG) {
    return createElement(
      'div',
      { key: node.key, 'data-schema-error': node.error ?? 'render error', role: 'note' },
      null,
    )
  }

  const Component = map[node.slug]
  if (!Component) {
    return createElement(
      'div',
      { key: node.key, 'data-schema-error': `no renderer for ${node.slug}`, role: 'note' },
      null,
    )
  }

  return createElement(
    Component,
    { key: node.key, ...propsFor(node.slug, node.props) },
    ...node.children.map((child, index) =>
      typeof child === 'string'
        ? child
        : renderNode({ ...child, key: child.key || `${node.key}.${index}` }, map),
    ),
  )
}

export interface SchemaRendererProps {
  schema: RenderSchema
  map?: SchemaComponentMap
  /** Receives recoverable compile issues (unknown slugs, invalid props). */
  onIssues?: (issues: CompileIssue[]) => void
}

/**
 * Render a JSON render-schema with real Chameleon UI components.
 * Compile errors are fatal only for structurally invalid schemas; unknown
 * components degrade to annotated placeholders (错误可恢复).
 */
export function SchemaRenderer({ schema, map, onIssues }: SchemaRendererProps) {
  const componentMap = map ?? DEFAULT_COMPONENT_MAP
  const { tree, issues } = useMemo(
    () => compileSchema(schema, new Set(Object.keys(componentMap))),
    [schema, componentMap],
  )

  if (issues.length > 0) {
    onIssues?.(issues)
  }

  if (!tree) return null
  return createElement('div', { 'data-schema-renderer': 'root' }, renderNode(tree, componentMap))
}
