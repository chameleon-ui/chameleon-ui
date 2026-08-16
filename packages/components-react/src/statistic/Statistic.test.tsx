import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Statistic } from './Statistic.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Statistic', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Statistic label="Revenue" value="$12k" trend="up" trendLabel="Trending up" />)
    const element = screen.getByText('Revenue').closest('.cu-statistic')
    expect(element).toHaveClass('cu-statistic')
    expect(element).toHaveAttribute('data-ai-role', 'statistic')
    expect(element).toHaveAttribute('data-ai-state', 'up')
  })

  it('exposes the trend as accessible text, not color alone', () => {
    render(<Statistic label="Revenue" value="$12k" trend="down" trendLabel="Trending down" />)
    expect(screen.getByText('Trending down')).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'statistic.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Statistic label="إحصائية" value="42" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
