import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Tabs } from './Tabs.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const items = [
  { value: 'account', label: 'Account', content: <div>Account content</div> },
  { value: 'security', label: 'Security', content: <div>Security content</div> },
]

describe('Tabs', () => {
  it('shows the default tab and switches on click', async () => {
    const user = userEvent.setup()

    render(<Tabs defaultValue="account" items={items} />)
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Account content')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Security' }))
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Security content')).toBeInTheDocument()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    const arItems = [
      { value: 'account', label: copy.get('tabs.account') ?? '', content: <div>محتوى الحساب</div> },
      { value: 'security', label: copy.get('tabs.security') ?? '', content: <div>محتوى الأمان</div> },
    ]

    render(<Tabs defaultValue="account" items={arItems} />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('tab', { name: 'الحساب' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('tabs.account')).toBe('Account')
    expect(createCatalog(de).get('tabs.security')).toBe('Sicherheitseinstellungen')
    expect(createCatalog(zhCN).get('tabs.account')).toBe('账户')
  })
})
