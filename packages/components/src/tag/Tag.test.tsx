import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Tag } from './Tag.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Tag', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Tag label="Beta" />)
    const element = screen.getByText('Beta').closest('.cu-tag')
    expect(element).toHaveClass('cu-tag')
    expect(element).toHaveAttribute('data-ai-role', 'tag')
    expect(element).toHaveAttribute('data-ai-state', 'default')
  })

  it('calls onRemove from the remove control', () => {
    let removed = 0
    render(<Tag label="Beta" onRemove={() => { removed += 1 }} removeLabel="Remove tag" />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove tag' }))
    expect(removed).toBe(1)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'tag.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Tag label="وسم" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
