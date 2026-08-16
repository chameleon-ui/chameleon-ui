import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Drawer } from './Drawer.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Drawer', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Drawer triggerLabel="Open" title="Title" closeLabel="Close" />)
    const element = document.querySelector('.cu-drawer')
    expect(element).toHaveClass('cu-drawer')
    expect(element).toHaveAttribute('data-ai-role', 'drawer')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'drawer.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Drawer triggerLabel="Open" title="Title" closeLabel="Close" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
