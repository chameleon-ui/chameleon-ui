import './styles.css'

export interface ChartSeries {
  name: string
  data: number[]
}

export interface ChartProps {
  type?: 'bar' | 'line' | 'area'
  series: ChartSeries[]
  labels?: string[]
  label: string
  emptyLabel?: string
  className?: string
}

const WIDTH = 320
const HEIGHT = 160
const PADDING = 8
const SERIES_CLASSES = ['cu-chart__series--0', 'cu-chart__series--1', 'cu-chart__series--2', 'cu-chart__series--3']

function extent(series: ChartSeries[]) {
  let min = 0
  let max = 0
  for (const entry of series) {
    for (const value of entry.data) {
      if (value < min) min = value
      if (value > max) max = value
    }
  }
  if (max === min) max = min + 1
  return { min, max }
}

function linePoints(data: number[], min: number, max: number) {
  const innerW = WIDTH - PADDING * 2
  const innerH = HEIGHT - PADDING * 2
  const step = data.length > 1 ? innerW / (data.length - 1) : 0
  return data
    .map((value, index) => {
      const x = PADDING + index * step
      const y = PADDING + innerH - ((value - min) / (max - min)) * innerH
      return `${x},${y}`
    })
    .join(' ')
}

export function Chart({ type = 'line', series, labels, label, emptyLabel = 'No data', className }: ChartProps) {
  const classes = ['cu-chart', className].filter(Boolean).join(' ')
  const hasData = series.some((entry) => entry.data.length > 0)

  if (!hasData) {
    return (
      <div className={classes} data-ai-role="chart" data-ai-intent="visualize-data" data-ai-state="empty">
        <p className="cu-chart__empty">{emptyLabel}</p>
      </div>
    )
  }

  const { min, max } = extent(series)
  const slotCount = Math.max(...series.map((entry) => entry.data.length))
  const slotWidth = (WIDTH - PADDING * 2) / Math.max(1, slotCount)

  return (
    <figure className={classes} data-ai-role="chart" data-ai-intent="visualize-data" data-ai-state={type}>
      <svg
        className="cu-chart__svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={label}
        preserveAspectRatio="xMidYMid meet"
      >
        {series.map((entry, seriesIndex) => {
          const seriesClass = SERIES_CLASSES[seriesIndex % SERIES_CLASSES.length]
          if (type === 'bar') {
            const barWidth = (slotWidth * 0.7) / series.length
            return (
              <g key={entry.name} className={seriesClass}>
                {entry.data.map((value, index) => {
                  const height = ((value - min) / (max - min)) * (HEIGHT - PADDING * 2)
                  const x = PADDING + index * slotWidth + (slotWidth - barWidth * series.length) / 2 + seriesIndex * barWidth
                  const y = HEIGHT - PADDING - height
                  return <rect key={`${entry.name}-${index}`} x={x} y={y} width={barWidth} height={Math.max(0, height)} />
                })}
              </g>
            )
          }
          const points = linePoints(entry.data, min, max)
          const baseline = HEIGHT - PADDING
          return (
            <g key={entry.name} className={seriesClass}>
              {type === 'area' ? (
                <polygon className="cu-chart__area" points={`${PADDING},${baseline} ${points} ${PADDING + (entry.data.length - 1) * ((WIDTH - PADDING * 2) / Math.max(1, entry.data.length - 1))},${baseline}`} />
              ) : null}
              <polyline className="cu-chart__line" points={points} />
            </g>
          )
        })}
      </svg>
      {labels && labels.length > 0 ? (
        <figcaption className="cu-chart__labels">
          {labels.map((item) => (
            <span key={item} className="cu-chart__label">
              {item}
            </span>
          ))}
        </figcaption>
      ) : null}
      <ul className="cu-chart__legend">
        {series.map((entry, seriesIndex) => (
          <li key={entry.name} className={'cu-chart__legend-item ' + SERIES_CLASSES[seriesIndex % SERIES_CLASSES.length]}>
            {entry.name}
          </li>
        ))}
      </ul>
    </figure>
  )
}
