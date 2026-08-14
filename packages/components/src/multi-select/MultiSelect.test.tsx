import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { MultiSelect } from './MultiSelect.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const options = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
]

describe('MultiSelect', () => {
  it('opens the listbox and toggles options', () => {
    let next: string[] = []
    render(
      <MultiSelect options={options} values={['red']} onChange={(values) => { next = values }} label="Colors" selectedLabel="selected" />,
    )
    const root = screen.getByText('Colors').closest('.cu-multi-select')
    expect(root).toHaveAttribute('data-ai-role', 'multi-select')
    expect(root).toHaveAttribute('data-ai-state', 'default')
    fireEvent.click(screen.getByRole('button', { name: 'Colors' }))
    expect(root).toHaveAttribute('data-ai-state', 'open')
    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true')
    fireEvent.click(screen.getByRole('option', { name: 'Green' }))
    expect(next).toEqual(['red', 'green'])
    fireEvent.click(screen.getByRole('option', { name: 'Red' }))
    expect(next).toEqual([])
  })

  it('removes a selection from its chip', () => {
    let next: string[] = []
    render(
      <MultiSelect options={options} values={['red']} onChange={(values) => { next = values }} label="Colors" clearLabel="Clear all" />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Clear all: Red' }))
    expect(next).toEqual([])
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'multi-select.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<MultiSelect options={options} values={[]} onChange={() => {}} label="الألوان" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
