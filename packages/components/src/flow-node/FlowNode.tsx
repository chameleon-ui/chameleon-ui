import './styles.css'

export interface FlowNodeProps {
  id: string
  x: number
  y: number
  title: string
  status?: 'default' | 'active' | 'success' | 'failed'
  /** Optional ARIA role (e.g. treeitem inside MindMap). */
  role?: 'treeitem'
  className?: string
}

export function FlowNode({ id, x, y, title, status = 'default', role, className }: FlowNodeProps) {
  const classes = ['cu-flow-node', 'cu-flow-node--' + status, className].filter(Boolean).join(' ')
  return (
    <div
      id={id}
      className={classes}
      role={role}
      aria-label={role ? title : undefined}
      data-ai-role="flow-node"
      data-ai-intent="group-content"
      data-ai-state={status}
      data-canvas-node
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <span className="cu-flow-node__port cu-flow-node__port--in" aria-hidden="true" />
      <span className="cu-flow-node__title">{title}</span>
      <span className="cu-flow-node__port cu-flow-node__port--out" aria-hidden="true" />
    </div>
  )
}
