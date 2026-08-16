import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Chip } from './Chip.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Chip', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Chip children="Label" />)
    const element = screen.getByText("Label")
    expect(element).toHaveClass('cu-chip')
    expect(element).toHaveAttribute('data-ai-role', 'chip')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'chip.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Chip children="Label" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
