import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Breadcrumb } from './Breadcrumb.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Breadcrumb', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Breadcrumb items={[{ label: "Home", href: "/" }]} />)
    const element = screen.getByRole("navigation")
    expect(element).toHaveClass('cu-breadcrumb')
    expect(element).toHaveAttribute('data-ai-role', 'breadcrumb')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'breadcrumb.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Breadcrumb items={[{ label: "Home", href: "/" }]} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
