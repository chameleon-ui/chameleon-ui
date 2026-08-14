import './styles.css'

export interface GraphNode {
  id: string
  label: string
}

export interface GraphLink {
  source: string
  target: string
}

export interface GraphViewProps {
  nodes: GraphNode[]
  links: GraphLink[]
  label: string
  className?: string
}

const SIZE = 320
const CENTER = SIZE / 2
const RADIUS = 120

/**
 * @complexity time O(n + m) | space O(n) | n = nodes, m = links; ring layout places node i at a fixed angle
 * @guarantees deterministic positions with no simulation; large graphs must paginate or filter upstream
 */
export function GraphView({ nodes, links, label, className }: GraphViewProps) {
  const classes = ['cu-graph-view', className].filter(Boolean).join(' ')
  const positions = new Map<string, { x: number; y: number }>()
  nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / Math.max(1, nodes.length) - Math.PI / 2
    positions.set(node.id, { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) })
  })

  return (
    <div className={classes} data-ai-role="graph-view" data-ai-intent="enumerate-items" data-ai-state={nodes.length === 0 ? 'empty' : 'default'}>
      <svg className="cu-graph-view__svg" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={label}>
        {links.map((link, index) => {
          const from = positions.get(link.source)
          const to = positions.get(link.target)
          if (!from || !to) return null
          return <line key={index} className="cu-graph-view__link" x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
        })}
        {nodes.map((node) => {
          const position = positions.get(node.id)
          if (!position) return null
          return (
            <g key={node.id} className="cu-graph-view__node">
              <circle cx={position.x} cy={position.y} r={16} />
              <text x={position.x} y={position.y + 32} textAnchor="middle" className="cu-graph-view__label">
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>
      <ul className="cu-graph-view__list">
        {nodes.map((node) => (
          <li key={node.id}>{node.label}</li>
        ))}
      </ul>
    </div>
  )
}
