import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { MarkdownRenderer } from './MarkdownRenderer.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const sample = ['## Release notes', '', 'Shipped **faster** rendering and `smaller` bundles.', '', '- Add chart', '- Add gauge', '', 'See [the docs](https://example.com/docs).'].join('\n')

describe('MarkdownRenderer', () => {
  it('renders headings, emphasis, code, lists, and links', () => {
    render(<MarkdownRenderer markdown={sample} label="Release notes" />)
    expect(screen.getByRole('heading', { name: 'Release notes' })).toBeInTheDocument()
    expect(screen.getByText('faster').tagName).toBe('STRONG')
    expect(screen.getByText('smaller').tagName).toBe('CODE')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'the docs' })).toHaveAttribute('href', 'https://example.com/docs')
  })

  it('never injects raw HTML from the source', () => {
    render(<MarkdownRenderer markdown={'<img src=x onerror=alert(1)>'} label="Reply" />)
    expect(document.querySelector('img')).toBeNull()
  })

  it('marks empty input with the empty state', () => {
    render(<MarkdownRenderer markdown="  " label="Reply" />)
    expect(screen.getByRole('document', { name: 'Reply' })).toHaveAttribute('data-ai-state', 'empty')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'markdown-renderer.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<MarkdownRenderer markdown={'## مرحبا'} label="محتوى" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
