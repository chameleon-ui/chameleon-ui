import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { TabBar } from './TabBar.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const items = [
  { value: 'home', label: 'Home' },
  { value: 'search', label: 'Search' },
  { value: 'settings', label: 'Settings' },
]

describe('TabBar', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<TabBar label="Main navigation" items={items} />)
    const element = document.querySelector('.cu-tab-bar')
    expect(element).toHaveClass('cu-tab-bar')
    expect(element).toHaveAttribute('data-ai-role', 'tab-bar')
    expect(element).toHaveAttribute('data-ai-state', 'home')
  })

  it('renders every destination as a tab trigger with touch-target class', () => {
    render(<TabBar label="Main navigation" items={items} />)
    for (const item of items) {
      expect(screen.getByRole('tab', { name: item.label })).toHaveClass('cu-tab-bar__item')
    }
  })

  it('changes the active value and reports it', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TabBar label="Main navigation" items={items} defaultValue="home" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Search' }))
    expect(onChange).toHaveBeenCalledWith('search')
  })

  it('reflects the controlled value in data-ai-state', () => {
    render(<TabBar label="Main navigation" items={items} value="settings" />)
    expect(document.querySelector('.cu-tab-bar')).toHaveAttribute('data-ai-state', 'settings')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'tabBar.label')).toBeDefined()
    expect(requireMessage(createCatalog(zhCN), 'tabBar.label')).toBe('标签栏')
    expect(requireMessage(createCatalog(de), 'tabBar.label')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'tabBar.label')).toBeDefined()
  })

  it('keeps item order with the document direction in RTL', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<TabBar label="التنقل" items={items} />)
    expect(document.documentElement.dir).toBe('rtl')
    const rendered = Array.from(document.querySelectorAll('.cu-tab-bar__item')).map((node) =>
      node.textContent?.trim(),
    )
    expect(rendered).toEqual(['Home', 'Search', 'Settings'])
  })
})
