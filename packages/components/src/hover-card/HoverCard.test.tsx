import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { HoverCard } from './HoverCard.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('HoverCard', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<HoverCard trigger={<span>Hover</span>} children="Content" />)
    const element = document.querySelector('.cu-hover-card')
    expect(element).toHaveClass('cu-hover-card')
    expect(element).toHaveAttribute('data-ai-role', 'hover-card')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'hover-card.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<HoverCard trigger={<span>Hover</span>} children="Content" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
