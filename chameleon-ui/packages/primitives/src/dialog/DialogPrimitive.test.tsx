import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DialogPrimitive } from './DialogPrimitive.js'

describe('DialogPrimitive', () => {
  it('opens from the keyboard, traps focus, closes on Escape, and restores the trigger', async () => {
    const user = userEvent.setup()

    render(
      <DialogPrimitive.Root lazyMount restoreFocus unmountOnExit>
        <DialogPrimitive.Trigger>Open</DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop />
          <DialogPrimitive.Positioner>
            <DialogPrimitive.Content>
              <DialogPrimitive.Title>Preferences</DialogPrimitive.Title>
              <DialogPrimitive.Description>Focus stays inside.</DialogPrimitive.Description>
              <button type="button">Inside</button>
              <DialogPrimitive.CloseTrigger>Close</DialogPrimitive.CloseTrigger>
            </DialogPrimitive.Content>
          </DialogPrimitive.Positioner>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>,
    )

    await user.tab()
    const trigger = screen.getByRole('button', { name: 'Open' })
    expect(trigger).toHaveFocus()
    await user.keyboard('{Enter}')

    const dialog = await screen.findByRole('dialog', { name: 'Preferences' })
    expect(dialog).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Preferences' })).not.toBeInTheDocument()
      expect(trigger).toHaveFocus()
    })
  })
})
