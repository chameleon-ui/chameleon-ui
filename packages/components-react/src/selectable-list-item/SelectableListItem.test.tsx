import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { SelectableListItem } from './SelectableListItem.js'
import en from './locales/en.json'

describe('SelectableListItem', () => {
  it('renders a selectable queue row and fires onSelect', () => {
    const onSelect = vi.fn()
    render(
      <SelectableListItem selected onSelect={onSelect} meta={<span>queued</span>} actions={<button type="button">Delete</button>}>
        Job A
      </SelectableListItem>,
    )
    const option = screen.getByRole('option', { selected: true })
    expect(option).toHaveClass('cu-selectable-list-item')
    expect(option).toHaveAttribute('data-ai-role', 'selectable-list-item')
    fireEvent.click(option)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not select when disabled', () => {
    const onSelect = vi.fn()
    render(
      <SelectableListItem disabled onSelect={onSelect}>
        Job B
      </SelectableListItem>,
    )
    fireEvent.click(screen.getByRole('option'))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'selectable-list-item.label')).toBeDefined()
  })
})
