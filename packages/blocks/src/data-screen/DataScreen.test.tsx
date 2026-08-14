import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { DataScreen } from './DataScreen.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('DataScreen', () => {
  it('renders KPIs, charts, and a scaling stage', () => {
    render(<DataScreen />)

    const root = document.querySelector('[data-ai-role="data-screen"]')
    expect(root).toHaveAttribute('data-ai-intent', 'monitor-metrics')
    expect(root).toHaveClass('cu-block-data-screen')
    expect(screen.getByRole('region', { name: 'Key metrics' })).toBeInTheDocument()
    expect(screen.getByText('18.4k')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Traffic' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Conversion' })).toBeInTheDocument()
    expect(document.querySelector('.cu-block-data-screen__viewport')).toHaveAttribute('data-scale', '1')
  })

  it('marks an empty KPI list on data-ai-state', () => {
    render(<DataScreen kpis={[]} />)
    expect(document.querySelector('[data-ai-role="data-screen"]')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'screen.panelCount'), { count: 3 })).toBe('3 panels')
    expect(createCatalog(zhCN).get('screen.title')).toBe('运营大屏')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<DataScreen locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="data-screen"]')).not.toHaveAttribute('dir', 'ltr')
  })
})
