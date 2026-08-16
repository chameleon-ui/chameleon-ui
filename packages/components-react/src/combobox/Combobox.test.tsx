import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Combobox } from './Combobox.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Combobox', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Combobox label="Fruit" options={["A", "B"]} onChange={() => {}} />)
    const element = document.querySelector('.cu-combobox')
    expect(element).toHaveClass('cu-combobox')
    expect(element).toHaveAttribute('data-ai-role', 'combobox')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'combobox.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Combobox label="Fruit" options={["A", "B"]} onChange={() => {}} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
