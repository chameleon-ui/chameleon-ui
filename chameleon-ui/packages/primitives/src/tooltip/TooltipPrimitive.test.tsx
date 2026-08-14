import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TooltipPrimitive } from './TooltipPrimitive.js'

describe('TooltipPrimitive', () => {
  it('shows the tooltip on keyboard focus', async () => {
    const user = userEvent.setup()

    render(
      <TooltipPrimitive.Root openDelay={0} closeDelay={0}>
        <TooltipPrimitive.Trigger>Info</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Positioner>
          <TooltipPrimitive.Content>More information</TooltipPrimitive.Content>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Root>,
    )

    const trigger = screen.getByRole('button', { name: 'Info' })
    await user.tab()
    expect(trigger).toHaveFocus()

    await waitFor(() => {
      expect(screen.getByText('More information')).toBeInTheDocument()
    })
  })
})
