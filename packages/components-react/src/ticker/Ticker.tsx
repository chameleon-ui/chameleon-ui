import './styles.css'

export interface TickerItem {
  id: string
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
}

export interface TickerProps {
  items: TickerItem[]
  label?: string
  className?: string
}

const TREND_GLYPH = { up: '▲', down: '▼', flat: '→' } as const

export function Ticker({ items, label = 'Ticker', className }: TickerProps) {
  const classes = ['cu-ticker', className].filter(Boolean).join(' ')
  return (
    <section
      className={classes}
      aria-label={label}
      data-ai-role="ticker" data-ai-intent="notify-status"
      data-ai-state={items.length === 0 ? 'empty' : 'default'}
    >
      <ul className="cu-ticker__strip">
        {items.map((item) => (
          <li key={item.id} className="cu-ticker__item">
            <span className="cu-ticker__label">{item.label}</span>
            <span className="cu-ticker__value">{item.value}</span>
            {item.trend ? (
              <span className={'cu-ticker__trend cu-ticker__trend--' + item.trend}>
                <span aria-hidden="true">{TREND_GLYPH[item.trend]}</span>
                <span className="cu-ticker__trend-text">{item.trend}</span>
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
