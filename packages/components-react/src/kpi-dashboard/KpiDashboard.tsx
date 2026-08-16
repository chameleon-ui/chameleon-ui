import { Statistic } from '../statistic/index.js'
import './styles.css'

export interface KpiItem {
  id: string
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
}

export interface KpiDashboardProps {
  items: KpiItem[]
  label?: string
  className?: string
}

export function KpiDashboard({ items, label = 'KPI dashboard', className }: KpiDashboardProps) {
  const classes = ['cu-kpi-dashboard', className].filter(Boolean).join(' ')
  return (
    <section
      className={classes}
      aria-label={label}
      data-ai-role="kpi-dashboard" data-ai-intent="highlight-count"
      data-ai-state={items.length === 0 ? 'empty' : 'default'}
    >
      <div className="cu-kpi-dashboard__grid">
        {items.map((item) => (
          <div key={item.id} className="cu-kpi-dashboard__tile">
            <Statistic label={item.label} value={item.value} trend={item.trend ?? 'flat'} trendLabel={item.trend} />
          </div>
        ))}
      </div>
    </section>
  )
}
