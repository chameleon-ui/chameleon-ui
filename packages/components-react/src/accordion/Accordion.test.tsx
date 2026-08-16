import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Accordion } from './Accordion.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Accordion', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Accordion items={[{ title: "Q1", content: "A1" }]} />)
    const element = document.querySelector('.cu-accordion')
    expect(element).toHaveClass('cu-accordion')
    expect(element).toHaveAttribute('data-ai-role', 'accordion')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'accordion.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Accordion items={[{ title: "Q1", content: "A1" }]} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
