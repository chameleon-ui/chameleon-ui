import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SwitchPrimitive } from './SwitchPrimitive.js'

describe('SwitchPrimitive', () => {
  it('toggles on click and exposes the hidden checkbox', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <SwitchPrimitive.Root onCheckedChange={(details) => onChange(details.checked)}>
        <SwitchPrimitive.Label>Airplane mode</SwitchPrimitive.Label>
        <SwitchPrimitive.Control>
          <SwitchPrimitive.Thumb />
        </SwitchPrimitive.Control>
        <SwitchPrimitive.HiddenInput />
      </SwitchPrimitive.Root>,
    )

    const input = screen.getByRole('checkbox', { name: 'Airplane mode' })
    expect(input).not.toBeChecked()

    await user.click(screen.getByText('Airplane mode'))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(input).toBeChecked()
  })
})
