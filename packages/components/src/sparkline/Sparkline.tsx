import './styles.css'

export interface SparklineProps {
  data: number[]
  label: string
  width?: number
  height?: number
  className?: string
}

export function Sparkline({ data, label, width = 96, height = 28, className }: SparklineProps) {
  const classes = ['cu-sparkline', className].filter(Boolean).join(' ')

  if (data.length < 2) {
    return (
      <span className={classes} data-ai-role="sparkline" data-ai-intent="visualize-data" data-ai-state="empty" aria-label={label} role="img" />
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const step = width / (data.length - 1)
  const points = data
    .map((value, index) => `${index * step},${height - ((value - min) / span) * height}`)
    .join(' ')

  return (
    <svg
      className={classes}
      data-ai-role="sparkline" data-ai-intent="visualize-data"
      data-ai-state="default"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
    >
      <polyline className="cu-sparkline__line" points={points} />
    </svg>
  )
}
