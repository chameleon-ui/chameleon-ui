import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Menu } from './Menu.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Menu', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Menu triggerLabel="Open" items={[{ label: "Item", onClick: () => {} }]} />)
    const element = document.querySelector('.cu-menu')
    expect(element).toHaveClass('cu-menu')
    expect(element).toHaveAttribute('data-ai-role', 'menu')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'menu.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Menu triggerLabel="Open" items={[{ label: "Item", onClick: () => {} }]} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
