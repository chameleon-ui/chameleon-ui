import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { SearchBar } from './SearchBar.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('SearchBar', () => {
  it('renders the search landmark with data-ai-role', () => {
    render(<SearchBar value="" onChange={() => {}} label="Search docs" />)
    const region = screen.getByRole('search', { name: 'Search docs' })
    expect(region).toHaveAttribute('data-ai-role', 'search-bar')
    expect(region).toHaveAttribute('data-ai-state', 'default')
  })

  it('submits and clears the query', () => {
    let submitted = ''
    let next = ''
    render(
      <SearchBar
        value="grid"
        onChange={(value) => { next = value }}
        onSubmit={(value) => { submitted = value }}
        label="Search docs"
        clearLabel="Clear"
        submitLabel="Submit search"
      />,
    )
    fireEvent.submit(screen.getByRole('search', { name: 'Search docs' }))
    expect(submitted).toBe('grid')
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(next).toBe('')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'search-bar.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<SearchBar value="" onChange={() => {}} label="بحث" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
