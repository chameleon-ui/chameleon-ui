import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Sheet } from './Sheet.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Sheet', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Sheet triggerLabel="Open" title="Title" closeLabel="Close" />)
    const element = document.querySelector('.cu-sheet')
    expect(element).toHaveClass('cu-sheet')
    expect(element).toHaveAttribute('data-ai-role', 'sheet')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'sheet.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Sheet triggerLabel="Open" title="Title" closeLabel="Close" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
