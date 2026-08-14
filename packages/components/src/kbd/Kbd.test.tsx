import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Kbd } from './Kbd.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Kbd', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Kbd children="Ctrl" />)
    const element = screen.getByText("Ctrl")
    expect(element).toHaveClass('cu-kbd')
    expect(element).toHaveAttribute('data-ai-role', 'kbd')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'kbd.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Kbd children="Ctrl" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
