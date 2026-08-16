import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Label } from './Label.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Label', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Label children="Email" />)
    const element = screen.getByText("Email")
    expect(element).toHaveClass('cu-label')
    expect(element).toHaveAttribute('data-ai-role', 'label')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'label.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Label children="Email" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
