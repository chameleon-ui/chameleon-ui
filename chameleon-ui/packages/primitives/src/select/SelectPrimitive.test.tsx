import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { SelectPrimitive } from './SelectPrimitive.js'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
]

const collection = SelectPrimitive.createListCollection({ items })

function Fixture() {
  const [value, setValue] = useState('')
  return (
    <SelectPrimitive.Root
      collection={collection}
      value={[value]}
      onValueChange={(details) => setValue(details.value[0] ?? '')}
    >
      <SelectPrimitive.Label>Fruit</SelectPrimitive.Label>
      <SelectPrimitive.Control>
        <SelectPrimitive.Trigger>
          <SelectPrimitive.ValueText placeholder="Pick a fruit" />
          <SelectPrimitive.Indicator>▼</SelectPrimitive.Indicator>
        </SelectPrimitive.Trigger>
      </SelectPrimitive.Control>
      <SelectPrimitive.Positioner>
        <SelectPrimitive.Content>
          <SelectPrimitive.List>
            {items.map((item) => (
              <SelectPrimitive.Item key={item.value} item={item}>
                <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>✓</SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.List>
        </SelectPrimitive.Content>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Root>
  )
}

describe('SelectPrimitive', () => {
  it('opens a listbox and lets the user select a value', async () => {
    const user = userEvent.setup()

    render(<Fixture />)
    const trigger = screen.getByRole('combobox', { name: 'Fruit' })
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'Banana' }))
    await waitFor(() => {
      expect(trigger).toHaveTextContent('Banana')
    })
  })
})
