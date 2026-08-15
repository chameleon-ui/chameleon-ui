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
} from '@chameleon-ui/components-vue'
import { defineComponent, h, watch, type Component, type PropType, type VNode } from 'vue'
import {
  compileSchema,
  ERROR_NODE_SLUG,
  type CompileIssue,
  type CompiledNode,
  type RenderSchema,
} from './schema.js'

export type SchemaComponentMap = Record<string, Component>

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
  if (slug === 'input') {
    return {
      ...props,
      modelValue: typeof props.value === 'string' ? props.value : String(props.value ?? ''),
      'onUpdate:modelValue': typeof props.onChange === 'function' ? props.onChange : noop,
    }
  }
  if (slug === 'button') {
    return { type: 'button', ...props }
  }
  return props
}

function renderNode(node: CompiledNode | string, map: SchemaComponentMap): VNode | string {
  if (typeof node === 'string') return node

  if (node.slug === ERROR_NODE_SLUG) {
    return h('div', { key: node.key, 'data-schema-error': node.error ?? 'render error', role: 'note' })
  }

  const Component = map[node.slug]
  if (!Component) {
    return h('div', { key: node.key, 'data-schema-error': `no renderer for ${node.slug}`, role: 'note' })
  }

  return h(
    Component,
    { key: node.key, ...propsFor(node.slug, node.props) },
    () =>
      node.children.map((child, index) =>
        typeof child === 'string'
          ? child
          : renderNode({ ...child, key: child.key || `${node.key}.${index}` }, map),
      ),
  )
}

export const SchemaRenderer = defineComponent({
  name: 'SchemaRenderer',
  props: {
    schema: { type: Object as PropType<RenderSchema>, required: true },
    map: { type: Object as PropType<SchemaComponentMap>, required: false },
    onIssues: { type: Function as PropType<(issues: CompileIssue[]) => void>, required: false },
  },
  setup(props) {
    watch(
      () => [props.schema, props.map] as const,
      () => {
        const componentMap = props.map ?? DEFAULT_COMPONENT_MAP
        const { issues } = compileSchema(props.schema, new Set(Object.keys(componentMap)))
        if (issues.length > 0) props.onIssues?.(issues)
      },
      { immediate: true },
    )

    return () => {
      const componentMap = props.map ?? DEFAULT_COMPONENT_MAP
      const { tree } = compileSchema(props.schema, new Set(Object.keys(componentMap)))
      if (!tree) return null
      return h('div', { 'data-schema-renderer': 'root' }, [renderNode(tree, componentMap)])
    }
  },
})
