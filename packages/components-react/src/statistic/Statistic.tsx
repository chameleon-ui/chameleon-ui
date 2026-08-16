import './styles.css'

export interface StatisticProps {
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
  trendLabel?: string
  className?: string
}

const TREND_GLYPH = { up: '▲', down: '▼', flat: '→' } as const

export function Statistic({ label, value, trend = 'flat', trendLabel, className }: StatisticProps) {
  const classes = ['cu-statistic', className].filter(Boolean).join(' ')
  return (
    <div className={classes} data-ai-role="statistic" data-ai-intent="highlight-count" data-ai-state={trend}>
      <span className="cu-statistic__label">{label}</span>
      <span className="cu-statistic__value">{value}</span>
      <span className={'cu-statistic__trend cu-statistic__trend--' + trend}>
        <span aria-hidden="true">{TREND_GLYPH[trend]}</span>
        {trendLabel ? <span className="cu-statistic__trend-sr">{trendLabel}</span> : null}
      </span>
    </div>
  )
}
