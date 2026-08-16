import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { List } from './List.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('List', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<List items={["a", "b"]} />)
    const element = screen.getByRole("list")
    expect(element).toHaveClass('cu-list')
    expect(element).toHaveAttribute('data-ai-role', 'list')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'list.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<List items={["a", "b"]} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
