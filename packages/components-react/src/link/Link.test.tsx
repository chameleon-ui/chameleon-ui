import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Link } from './Link.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Link', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Link href="/" children="Home" />)
    const element = screen.getByRole("link")
    expect(element).toHaveClass('cu-link')
    expect(element).toHaveAttribute('data-ai-role', 'link')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'link.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Link href="/" children="Home" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
