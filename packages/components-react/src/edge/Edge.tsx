import './styles.css'

export interface EdgeProps {
  x1: number
  y1: number
  x2: number
  y2: number
  variant?: 'bezier' | 'straight'
  label?: string
  className?: string
}

export function Edge({ x1, y1, x2, y2, variant = 'bezier', label, className }: EdgeProps) {
  const classes = ['cu-edge', className].filter(Boolean).join(' ')
  const left = Math.min(x1, x2)
  const top = Math.min(y1, y2)
  const width = Math.max(1, Math.abs(x2 - x1))
  const height = Math.max(1, Math.abs(y2 - y1))
  const sx = x1 - left
  const sy = y1 - top
  const ex = x2 - left
  const ey = y2 - top
  const path =
    variant === 'straight'
      ? `M ${sx} ${sy} L ${ex} ${ey}`
      : `M ${sx} ${sy} C ${sx + (ex - sx) / 2} ${sy}, ${sx + (ex - sx) / 2} ${ey}, ${ex} ${ey}`

  return (
    <svg
      className={classes}
      data-ai-role="edge" data-ai-intent="connect-nodes"
      data-ai-state="default"
      style={{ insetInlineStart: left, insetBlockStart: top }}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path className="cu-edge__path" d={path} />
      {label ? (
        <text className="cu-edge__label" x={width / 2} y={height / 2} textAnchor="middle">
          {label}
        </text>
      ) : null}
    </svg>
  )
}
