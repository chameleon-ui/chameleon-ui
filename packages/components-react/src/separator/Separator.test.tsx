import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Separator } from './Separator.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Separator', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Separator />)
    const element = screen.getByRole("separator")
    expect(element).toHaveClass('cu-separator')
    expect(element).toHaveAttribute('data-ai-role', 'separator')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'separator.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Separator />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
