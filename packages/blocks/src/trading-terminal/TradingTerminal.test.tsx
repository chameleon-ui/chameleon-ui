import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { TradingTerminal } from './TradingTerminal.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('TradingTerminal', () => {
  it('renders the ticker and switches the chart with a symbol action', async () => {
    const user = userEvent.setup()
    const onSelectSymbol = vi.fn()
    render(<TradingTerminal onSelectSymbol={onSelectSymbol} />)

    expect(document.querySelector('[data-ai-role="trading-terminal"]')).toHaveAttribute(
      'data-ai-intent',
      'watch-markets',
    )
    expect(screen.getByRole('region', { name: 'Markets' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select BTC' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Price · BTC' })).toBeInTheDocument()
    expect(screen.getByRole('grid', { name: 'Orders' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Select ETH' }))
    expect(onSelectSymbol).toHaveBeenCalledWith('eth')
    expect(screen.getByRole('img', { name: 'Price · ETH' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select ETH' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'trade.orderCount'), { count: 0 })).toBe(
      'No working orders',
    )
    expect(createCatalog(zhCN).get('trade.title')).toBe('交易终端')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<TradingTerminal locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="trading-terminal"]')).not.toHaveAttribute('dir', 'ltr')
  })
})
