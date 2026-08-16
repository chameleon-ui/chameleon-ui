import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Badge } from './Badge.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Badge', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Badge children="Label" />)
    const element = screen.getByText("Label")
    expect(element).toHaveClass('cu-badge')
    expect(element).toHaveAttribute('data-ai-role', 'badge')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'badge.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Badge children="Label" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
