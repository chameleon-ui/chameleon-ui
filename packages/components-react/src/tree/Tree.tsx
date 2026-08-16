import { useState } from 'react'
import './styles.css'

export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

export interface TreeProps {
  nodes: TreeNode[]
  defaultExpandedIds?: string[]
  toggleLabel?: string
  className?: string
}

export function Tree({ nodes, defaultExpandedIds = [], toggleLabel = 'Toggle node', className }: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpandedIds))
  const classes = ['cu-tree', className].filter(Boolean).join(' ')

  const toggle = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const renderNodes = (items: TreeNode[]) => (
    <ul className="cu-tree__level" role={items === nodes ? 'tree' : 'group'}>
      {items.map((node) => {
        const hasChildren = Boolean(node.children?.length)
        const isExpanded = expanded.has(node.id)
        return (
          <li key={node.id} className="cu-tree__item" role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
            <div className="cu-tree__row">
              {hasChildren ? (
                <button
                  type="button"
                  className="cu-tree__toggle"
                  aria-label={`${toggleLabel}: ${node.label}`}
                  onClick={() => toggle(node.id)}
                >
                  <span aria-hidden="true">{isExpanded ? '▾' : '▸'}</span>
                </button>
              ) : (
                <span className="cu-tree__spacer" aria-hidden="true" />
              )}
              <span className="cu-tree__label">{node.label}</span>
            </div>
            {hasChildren && isExpanded ? renderNodes(node.children ?? []) : null}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className={classes} data-ai-role="tree" data-ai-intent="navigate-hierarchy" data-ai-state={nodes.length === 0 ? 'empty' : 'default'}>
      {renderNodes(nodes)}
    </div>
  )
}
