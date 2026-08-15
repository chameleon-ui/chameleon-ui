import { FlowNode } from '../flow-node/index.js'
import { Edge } from '../edge/index.js'
import './styles.css'

export interface MindMapNode {
  id: string
  label: string
  children?: MindMapNode[]
}

export interface MindMapProps {
  root: MindMapNode
  label: string
  className?: string
}

interface PositionedNode {
  node: MindMapNode
  x: number
  y: number
}

const LEVEL_WIDTH = 200
const ROW_HEIGHT = 72
const NODE_HEIGHT = 32

/**
 * @complexity time O(n) | space O(n) | n = node count; leaves take successive rows, parents center on children
 * @guarantees deterministic layout: same input tree always yields the same positions
 */
function layout(root: MindMapNode) {
  const positioned: PositionedNode[] = []
  const links: { from: PositionedNode; to: PositionedNode }[] = []
  let nextRow = 0

  const visit = (node: MindMapNode, depth: number): PositionedNode => {
    const entry: PositionedNode = { node, x: depth * LEVEL_WIDTH, y: 0 }
    if (!node.children || node.children.length === 0) {
      entry.y = nextRow * ROW_HEIGHT
      nextRow += 1
    } else {
      const children = node.children.map((child) => {
        const placed = visit(child, depth + 1)
        links.push({ from: entry, to: placed })
        return placed
      })
      entry.y = (children[0].y + children[children.length - 1].y) / 2
    }
    positioned.push(entry)
    return entry
  }

  visit(root, 0)
  return { positioned, links, height: Math.max(ROW_HEIGHT, nextRow * ROW_HEIGHT) }
}

export function MindMap({ root, label, className }: MindMapProps) {
  const classes = ['cu-mind-map', className].filter(Boolean).join(' ')
  const { positioned, links, height } = layout(root)

  return (
    <div
      className={classes}
      role="tree"
      aria-label={label}
      data-ai-role="mind-map" data-ai-intent="enumerate-items"
      data-ai-state={positioned.length === 0 ? 'empty' : 'default'}
      style={{ minBlockSize: height + NODE_HEIGHT }}
    >
      {links.map(({ from, to }) => (
        <Edge
          key={`${from.node.id}-${to.node.id}`}
          x1={from.x + 140}
          y1={from.y + NODE_HEIGHT / 2}
          x2={to.x}
          y2={to.y + NODE_HEIGHT / 2}
        />
      ))}
      {positioned.map(({ node, x, y }) => (
        <FlowNode key={node.id} id={node.id} x={x} y={y} title={node.label} role="treeitem" />
      ))}
    </div>
  )
}
