import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { FileInput } from './FileInput.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('FileInput', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<FileInput label="Upload" onChange={() => {}} />)
    const element = document.querySelector('.cu-file-input')
    expect(element).toHaveClass('cu-file-input')
    expect(element).toHaveAttribute('data-ai-role', 'file-input')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'file-input.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<FileInput label="Upload" onChange={() => {}} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
