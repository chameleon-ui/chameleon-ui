import { Chart, Grid, KpiDashboard, Typography } from '@chameleon-ui/components'
import type { ChartSeries, KpiItem } from '@chameleon-ui/components'
import { useEffect, useRef, useState } from 'react'
import { createBlockCopy } from '../copy.js'
import { dataScreenLocaleTrees } from './locale-map.js'
import './styles.css'

/** 1280px == breakpoint.desktop at a 16px root. */
export const DATA_SCREEN_DESIGN_INLINE = 1280
/** 720px design canvas. */
export const DATA_SCREEN_DESIGN_BLOCK = 720

export interface DataScreenProps {
  locale?: string
  kpis?: KpiItem[]
  traffic?: ChartSeries[]
  conversions?: ChartSeries[]
  className?: string
}

function defaultKpis(t: (key: string) => string): KpiItem[] {
  return [
    { id: 'sessions', label: t('screen.kpiSessions'), value: t('screen.kpiSessionsValue'), trend: 'up' },
    { id: 'conversion', label: t('screen.kpiConversion'), value: t('screen.kpiConversionValue'), trend: 'up' },
    { id: 'latency', label: t('screen.kpiLatency'), value: t('screen.kpiLatencyValue'), trend: 'down' },
    { id: 'errors', label: t('screen.kpiErrors'), value: t('screen.kpiErrorsValue'), trend: 'flat' },
  ]
}

export function DataScreen({
  locale = 'en',
  kpis,
  traffic,
  conversions,
  className,
}: DataScreenProps) {
  const { t } = createBlockCopy(dataScreenLocaleTrees, locale)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const classes = ['cu-block-data-screen', className].filter(Boolean).join(' ')
  const items = kpis ?? defaultKpis(t)
  const trafficSeries = traffic ?? [{ name: t('screen.trafficSeries'), data: [12, 18, 16, 22, 28, 24] }]
  const conversionSeries = conversions ?? [{ name: t('screen.conversionSeries'), data: [4, 6, 5, 8, 7, 9] }]
  const panelCount = 2 + (items.length > 0 ? 1 : 0)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || typeof ResizeObserver === 'undefined') return

    const measure = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return
      setScale(Math.min(width / DATA_SCREEN_DESIGN_INLINE, height / DATA_SCREEN_DESIGN_BLOCK, 1))
    }

    measure(viewport.clientWidth, viewport.clientHeight)
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      measure(entry.contentRect.width, entry.contentRect.height)
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className={classes}
      data-ai-role="data-screen"
      data-ai-intent="monitor-metrics"
      data-ai-state={items.length === 0 ? 'empty' : 'default'}
    >
      <div className="cu-block-data-screen__header">
        <Typography variant="heading-1">{t('screen.title')}</Typography>
        <Typography variant="body">{t('screen.subtitle')}</Typography>
        <p className="cu-block-data-screen__meta">{t('screen.panelCount', { count: panelCount })}</p>
      </div>
      <div
        className="cu-block-data-screen__viewport"
        data-scale={String(scale)}
        ref={viewportRef}
      >
        <div
          className="cu-block-data-screen__stage"
          style={{ transform: `scale(${scale})` }}
        >
          <KpiDashboard items={items} label={t('screen.kpiLabel')} />
          <Grid columns={2} gap="lg">
            <Chart
              emptyLabel={t('screen.emptyLabel')}
              label={t('screen.trafficLabel')}
              series={trafficSeries}
              type="area"
            />
            <Chart
              emptyLabel={t('screen.emptyLabel')}
              label={t('screen.conversionLabel')}
              series={conversionSeries}
              type="bar"
            />
          </Grid>
        </div>
      </div>
    </section>
  )
}
