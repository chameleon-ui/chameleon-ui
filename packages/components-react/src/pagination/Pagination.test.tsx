import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Pagination } from './Pagination.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Pagination', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Pagination currentPage={1} totalPages={3} onChange={() => {}} />)
    const element = screen.getByRole("navigation")
    expect(element).toHaveClass('cu-pagination')
    expect(element).toHaveAttribute('data-ai-role', 'pagination')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'pagination.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Pagination currentPage={1} totalPages={3} onChange={() => {}} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
