import './styles.css'
import { downsample } from '../virtual/downsample.js'

export interface SparklineProps {
  data: number[]
  label: string
  width?: number
  height?: number
  className?: string
}

export function Sparkline({ data, label, width = 96, height = 28, className }: SparklineProps) {
  const classes = ['cu-sparkline', className].filter(Boolean).join(' ')
  const samples = downsample(data, Math.max(2, Math.floor(width)))

  if (samples.length < 2) {
    return (
      <span className={classes} data-ai-role="sparkline" data-ai-intent="visualize-data" data-ai-state="empty" aria-label={label} role="img" />
    )
  }

  const min = Math.min(...samples)
  const max = Math.max(...samples)
  const span = max - min || 1
  const step = width / (samples.length - 1)
  const points = samples
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
