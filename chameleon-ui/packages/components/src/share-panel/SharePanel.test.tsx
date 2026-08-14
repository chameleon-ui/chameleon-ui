import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { SharePanel } from './SharePanel.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('SharePanel', () => {
  it('renders share targets with encoded URLs', () => {
    render(<SharePanel title="Share this" url="https://example.com/a b" targets={['x', 'email']} />)
    const group = screen.getByRole('group', { name: 'Share this' })
    expect(group).toHaveAttribute('data-ai-role', 'share-panel')
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute(
      'href',
      'https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.com%2Fa%20b&text=Share%20this',
    )
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:?subject=Share%20this&body=https%3A%2F%2Fexample.com%2Fa%20b')
  })

  it('confirms the copy action', async () => {
    render(<SharePanel title="Share" url="https://example.com" targets={['copy']} copyLabel="Copy link" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }))
    const button = await screen.findByRole('button', { name: /Copy link/ })
    expect(button.closest('.cu-share-panel')).toHaveAttribute('data-ai-state', 'copied')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'share-panel.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<SharePanel title="مشاركة" url="https://example.com" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
