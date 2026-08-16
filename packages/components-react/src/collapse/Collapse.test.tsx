import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Collapse } from './Collapse.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Collapse', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Collapse title="Show more" children="Content" />)
    const element = document.querySelector('.cu-collapse')
    expect(element).toHaveClass('cu-collapse')
    expect(element).toHaveAttribute('data-ai-role', 'collapse')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'collapse.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Collapse title="Show more" children="Content" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
