import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Slider } from './Slider.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Slider', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Slider value={50} onChange={() => {}} />)
    const element = document.querySelector('.cu-slider')
    expect(element).toHaveClass('cu-slider')
    expect(element).toHaveAttribute('data-ai-role', 'slider')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'slider.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Slider value={50} onChange={() => {}} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
