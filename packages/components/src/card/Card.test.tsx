import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Card } from './Card.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Card', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Card children="Content" />)
    const element = screen.getByText("Content")
    expect(element).toHaveClass('cu-card')
    expect(element).toHaveAttribute('data-ai-role', 'card')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'card.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Card children="Content" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
