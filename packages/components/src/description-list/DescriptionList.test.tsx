import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { DescriptionList } from './DescriptionList.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('DescriptionList', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<DescriptionList items={[{ term: "T", description: "D" }]} />)
    const element = document.querySelector('.cu-description-list')
    expect(element).toHaveClass('cu-description-list')
    expect(element).toHaveAttribute('data-ai-role', 'description-list')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'description-list.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<DescriptionList items={[{ term: "T", description: "D" }]} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
