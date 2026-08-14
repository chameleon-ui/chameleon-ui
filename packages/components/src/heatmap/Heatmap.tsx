import './styles.css'

export interface HeatmapProps {
  rows: string[]
  columns: string[]
  values: number[][]
  label: string
  className?: string
}

export function Heatmap({ rows, columns, values, label, className }: HeatmapProps) {
  const classes = ['cu-heatmap', className].filter(Boolean).join(' ')
  const flat = values.flat()
  const max = flat.length > 0 ? Math.max(...flat) : 0
  const empty = rows.length === 0 || columns.length === 0 || flat.length === 0

  return (
    <div className={classes} data-ai-role="heatmap" data-ai-intent="visualize-data" data-ai-state={empty ? 'empty' : 'default'}>
      <div
        className="cu-heatmap__grid"
        role="grid"
        aria-label={label}
        style={{ gridTemplateColumns: `auto repeat(${columns.length}, minmax(var(--cu-space-3), 1fr))` }}
      >
        <span className="cu-heatmap__corner" />
        {columns.map((column) => (
          <span key={column} className="cu-heatmap__column" role="columnheader">
            {column}
          </span>
        ))}
        {rows.map((row, rowIndex) => (
          <span key={row} className="cu-heatmap__row-wrap" role="row">
            <span className="cu-heatmap__row" role="rowheader">
              {row}
            </span>
            {columns.map((column, columnIndex) => {
              const value = values[rowIndex]?.[columnIndex] ?? 0
              const intensity = max > 0 ? Math.round((value / max) * 90) : 0
              return (
                <span
                  key={`${row}-${column}`}
                  className="cu-heatmap__cell"
                  role="gridcell"
                  aria-label={`${row} ${column}: ${value}`}
                  style={{ background: `color-mix(in srgb, var(--cu-color-palette-brand) ${intensity}%, var(--cu-color-background-default))` }}
                >
                  <span className="cu-heatmap__value">{value}</span>
                </span>
              )
            })}
          </span>
        ))}
      </div>
    </div>
  )
}
