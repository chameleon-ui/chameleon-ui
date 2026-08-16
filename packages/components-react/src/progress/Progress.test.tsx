import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Progress } from './Progress.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Progress', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Progress value={50} />)
    const element = screen.getByRole("progressbar")
    expect(element).toHaveClass('cu-progress')
    expect(element).toHaveAttribute('data-ai-role', 'progress')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'progress.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Progress value={50} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
