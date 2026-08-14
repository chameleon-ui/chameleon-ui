import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CheckboxPrimitive } from './CheckboxPrimitive.js'

describe('CheckboxPrimitive', () => {
  it('toggles checked state and calls onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <CheckboxPrimitive.Root onCheckedChange={(details) => onChange(details.checked)}>
        <CheckboxPrimitive.Control>
          <CheckboxPrimitive.Indicator>✓</CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Control>
        <CheckboxPrimitive.Label>Subscribe</CheckboxPrimitive.Label>
        <CheckboxPrimitive.HiddenInput />
      </CheckboxPrimitive.Root>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Subscribe' })
    expect(checkbox).not.toBeChecked()

    await user.click(screen.getByText('Subscribe'))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(checkbox).toBeChecked()
  })
})
