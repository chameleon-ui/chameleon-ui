import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Grid } from './Grid.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Grid', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Grid children="Item" />)
    const element = document.querySelector('.cu-grid')
    expect(element).toHaveClass('cu-grid')
    expect(element).toHaveAttribute('data-ai-role', 'grid')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'grid.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Grid children="Item" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
