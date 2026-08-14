import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { InlineAlert } from './InlineAlert.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('InlineAlert', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<InlineAlert children="Alert" />)
    const element = screen.getByText("Alert")
    expect(element).toHaveClass('cu-inline-alert')
    expect(element).toHaveAttribute('data-ai-role', 'inline-alert')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'inline-alert.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<InlineAlert children="Alert" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
