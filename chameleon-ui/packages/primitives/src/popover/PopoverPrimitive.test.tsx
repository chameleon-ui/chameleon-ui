import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { PopoverPrimitive } from './PopoverPrimitive.js'

describe('PopoverPrimitive', () => {
  it('opens from the trigger and closes with the close control', async () => {
    const user = userEvent.setup()

    render(
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger>Open</PopoverPrimitive.Trigger>
        <PopoverPrimitive.Positioner>
          <PopoverPrimitive.Content>
            <PopoverPrimitive.Title>Filters</PopoverPrimitive.Title>
            <PopoverPrimitive.Description>Filter the list.</PopoverPrimitive.Description>
            <PopoverPrimitive.CloseTrigger>Close</PopoverPrimitive.CloseTrigger>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Root>,
    )

    const trigger = screen.getByRole('button', { name: 'Open' })
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /close/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Filters' })).not.toBeInTheDocument()
    })
  })
})
