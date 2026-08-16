import './styles.css'

export interface GaugeProps {
  value: number
  max?: number
  label: string
  valueLabel?: string
  className?: string
}

const RADIUS = 70
const CENTER = 80

export function Gauge({ value, max = 100, label, valueLabel, className }: GaugeProps) {
  const classes = ['cu-gauge', className].filter(Boolean).join(' ')
  const clamped = Math.min(max, Math.max(0, value))
  const percent = max > 0 ? (clamped / max) * 100 : 0
  const startX = CENTER - RADIUS
  const endX = CENTER + RADIUS

  return (
    <div className={classes} data-ai-role="gauge" data-ai-intent="visualize-data" data-ai-state="default">
      <svg
        className="cu-gauge__svg"
        viewBox={`0 0 ${CENTER * 2} ${CENTER + 12}`}
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
      >
        <path
          className="cu-gauge__track"
          d={`M ${startX} ${CENTER} A ${RADIUS} ${RADIUS} 0 0 1 ${endX} ${CENTER}`}
          pathLength={100}
        />
        <path
          className="cu-gauge__fill"
          d={`M ${startX} ${CENTER} A ${RADIUS} ${RADIUS} 0 0 1 ${endX} ${CENTER}`}
          pathLength={100}
          strokeDasharray={`${percent} 100`}
        />
        <text className="cu-gauge__value" x={CENTER} y={CENTER - 8} textAnchor="middle">
          {valueLabel ?? String(clamped)}
        </text>
      </svg>
    </div>
  )
}
