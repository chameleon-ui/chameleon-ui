import { defineComponent, h, type PropType, type VNode } from 'vue'
import type { TreeNode } from './types.js'

export const TreeLevel = defineComponent({
  name: 'TreeLevel',
  props: {
    items: { type: Array as PropType<TreeNode[]>, required: true },
    root: { type: Boolean, default: false },
    toggleLabel: { type: String, required: true },
    isExpanded: { type: Function as PropType<(id: string) => boolean>, required: true },
  },
  emits: ['toggle'],
  setup(props, { emit }): () => VNode {
    return (): VNode =>
      h(
        'ul',
        { class: 'cu-tree__level', role: props.root ? 'tree' : 'group' },
        props.items.map((node) => {
          const hasChildren = Boolean(node.children?.length)
          const open = props.isExpanded(node.id)
          return h('li', { class: 'cu-tree__item', role: 'treeitem', 'aria-expanded': hasChildren ? open : undefined }, [
            h('div', { class: 'cu-tree__row' }, [
              hasChildren
                ? h(
                    'button',
                    {
                      type: 'button',
                      class: 'cu-tree__toggle',
                      'aria-label': `${props.toggleLabel}: ${node.label}`,
                      onClick: () => emit('toggle', node.id),
                    },
                    [h('span', { 'aria-hidden': 'true' }, open ? '▾' : '▸')],
                  )
                : h('span', { class: 'cu-tree__spacer', 'aria-hidden': 'true' }),
              h('span', { class: 'cu-tree__label' }, node.label),
            ]),
            hasChildren && open
              ? h(TreeLevel, {
                  items: node.children ?? [],
                  toggleLabel: props.toggleLabel,
                  isExpanded: props.isExpanded,
                  onToggle: (id: string) => emit('toggle', id),
                })
              : null,
          ])
        }),
      )
  },
})
