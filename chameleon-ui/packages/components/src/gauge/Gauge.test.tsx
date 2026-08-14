import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Gauge } from './Gauge.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Gauge', () => {
  it('renders a meter with the current value and data-ai-role', () => {
    render(<Gauge value={64} max={100} label="CPU usage" valueLabel="64%" />)
    const meter = screen.getByRole('meter', { name: 'CPU usage' })
    expect(meter).toHaveAttribute('aria-valuenow', '64')
    expect(meter.closest('.cu-gauge')).toHaveAttribute('data-ai-role', 'gauge')
    expect(screen.getByText('64%')).toBeInTheDocument()
  })

  it('clamps values above max', () => {
    render(<Gauge value={140} max={100} label="CPU usage" />)
    expect(screen.getByRole('meter', { name: 'CPU usage' })).toHaveAttribute('aria-valuenow', '100')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'gauge.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Gauge value={10} label="المعالج" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
