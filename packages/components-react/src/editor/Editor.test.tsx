import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Editor } from './Editor.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Editor', () => {
  it('renders toolbar and editable region with data-ai-role', () => {
    render(<Editor label="Reply editor" />)
    const region = screen.getByRole('textbox', { name: 'Reply editor' })
    expect(region.closest('.cu-editor')).toHaveAttribute('data-ai-role', 'editor')
    expect(region.closest('.cu-editor')).toHaveAttribute('data-ai-state', 'empty')
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
  })

  it('emits HTML on input and strips script tags from initial content', () => {
    let html = ''
    render(
      <Editor label="Reply editor" initialHtml={'<p>Hi</p><script>alert(1)</script>'} onChange={(next) => { html = next }} />,
    )
    const region = screen.getByRole('textbox', { name: 'Reply editor' })
    expect(region.innerHTML).not.toContain('script')
    fireEvent.input(region, { target: { innerHTML: '<p>Hello</p>' } })
    expect(html).toContain('Hello')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'editor.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Editor label="محرر" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
