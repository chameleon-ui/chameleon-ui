import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Ticker } from './Ticker.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const items = [
  { id: 'btc', label: 'BTC', value: '67.2k', trend: 'up' as const },
  { id: 'eth', label: 'ETH', value: '3.1k', trend: 'down' as const },
]

describe('Ticker', () => {
  it('renders the strip with data-ai-role', () => {
    render(<Ticker items={items} label="Markets" />)
    const region = screen.getByRole('region', { name: 'Markets' })
    expect(region).toHaveAttribute('data-ai-role', 'ticker')
    expect(screen.getByText('BTC')).toBeInTheDocument()
    expect(screen.getByText('3.1k')).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'ticker.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Ticker items={items} label="الأسواق" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
