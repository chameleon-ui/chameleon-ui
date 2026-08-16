import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { NumberInput } from './NumberInput.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('NumberInput', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<NumberInput value={1} onChange={() => {}} label="Count" />)
    const element = document.querySelector('.cu-number-input')
    expect(element).toHaveClass('cu-number-input')
    expect(element).toHaveAttribute('data-ai-role', 'number-input')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'number-input.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<NumberInput value={1} onChange={() => {}} label="Count" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
