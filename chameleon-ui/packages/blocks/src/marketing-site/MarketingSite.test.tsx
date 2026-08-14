import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { MarketingSite } from './MarketingSite.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('MarketingSite', () => {
  it('renders hero, three plans, and expandable FAQ', async () => {
    const user = userEvent.setup()
    const onCta = vi.fn()
    render(<MarketingSite onCta={onCta} />)

    expect(document.querySelector('[data-ai-role="marketing-site"]')).toHaveClass('cu-block-marketing-site')
    expect(screen.getByRole('heading', { name: 'Ship interfaces that adapt' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Starter' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pro' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Team' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start building' }))
    expect(onCta).toHaveBeenCalledWith('hero')

    const faq = screen.getByRole('button', { name: 'Do blocks install like components?' })
    expect(faq).toHaveAttribute('aria-expanded', 'false')
    await user.click(faq)
    expect(faq).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Yes. Block writes go through the same install-core kernel.')).toBeInTheDocument()
  })

  it('formats ICU plan counts from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'marketing.planCount'), { count: 3 })).toBe(
      '3 plans',
    )
    expect(createCatalog(zhCN).get('marketing.heroCta')).toBe('开始构建')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<MarketingSite locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="marketing-site"]')).not.toHaveAttribute('dir', 'ltr')
  })
})
