import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Avatar } from './Avatar.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Avatar', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Avatar fallback="AB" />)
    const element = document.querySelector('.cu-avatar')
    expect(element).toHaveClass('cu-avatar')
    expect(element).toHaveAttribute('data-ai-role', 'avatar')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'avatar.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Avatar fallback="AB" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
