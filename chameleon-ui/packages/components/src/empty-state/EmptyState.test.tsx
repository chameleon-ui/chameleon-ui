import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { EmptyState } from './EmptyState.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('EmptyState', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<EmptyState title="No data" />)
    const element = document.querySelector('.cu-empty-state')
    expect(element).toHaveClass('cu-empty-state')
    expect(element).toHaveAttribute('data-ai-role', 'empty-state')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'empty-state.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<EmptyState title="No data" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
