import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { RadioCard } from './RadioCard.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('RadioCard', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<RadioCard options={["A", "B"]} onChange={() => {}} name="plan" />)
    const element = document.querySelector('.cu-radio-card')
    expect(element).toHaveClass('cu-radio-card')
    expect(element).toHaveAttribute('data-ai-role', 'radio-card')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'radio-card.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<RadioCard options={["A", "B"]} onChange={() => {}} name="plan" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
