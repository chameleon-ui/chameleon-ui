import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RadioGroupPrimitive } from './RadioGroupPrimitive.js'

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
]

describe('RadioGroupPrimitive', () => {
  it('selects a radio value with the keyboard', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <RadioGroupPrimitive.Root name="number" onValueChange={(details) => onChange(details.value)}>
        <RadioGroupPrimitive.Label>Pick a number</RadioGroupPrimitive.Label>
        {options.map((option) => (
          <RadioGroupPrimitive.Item key={option.value} value={option.value}>
            <RadioGroupPrimitive.ItemControl>
              <RadioGroupPrimitive.Indicator>●</RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.ItemControl>
            <RadioGroupPrimitive.ItemText>{option.label}</RadioGroupPrimitive.ItemText>
            <RadioGroupPrimitive.ItemHiddenInput />
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>,
    )

    const first = screen.getByRole('radio', { name: 'One' })
    await user.click(first)
    expect(onChange).toHaveBeenCalledWith('one')
    expect(first).toBeChecked()
  })
})
