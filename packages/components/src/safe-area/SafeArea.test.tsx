import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { SafeArea } from './SafeArea.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('SafeArea', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<SafeArea>Content</SafeArea>)
    const element = document.querySelector('.cu-safe-area')
    expect(element).toHaveClass('cu-safe-area')
    expect(element).toHaveClass('cu-safe-area--bottom')
    expect(element).not.toHaveClass('cu-safe-area--top')
    expect(element).toHaveAttribute('data-ai-role', 'safe-area')
    expect(element).toHaveAttribute('data-ai-state', 'default')
  })

  it('toggles edges via logical-property modifier classes', () => {
    render(
      <SafeArea top start end bottom={false}>
        Content
      </SafeArea>,
    )
    const element = document.querySelector('.cu-safe-area')
    expect(element).toHaveClass('cu-safe-area--top')
    expect(element).toHaveClass('cu-safe-area--start')
    expect(element).toHaveClass('cu-safe-area--end')
    expect(element).not.toHaveClass('cu-safe-area--bottom')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'safeArea.label')).toBeDefined()
    expect(requireMessage(createCatalog(zhCN), 'safeArea.label')).toBe('安全区')
    expect(requireMessage(createCatalog(de), 'safeArea.label')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'safeArea.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<SafeArea start>Content</SafeArea>)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
