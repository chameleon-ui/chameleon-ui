import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('opens by keyboard, closes with Escape, and restores trigger focus', async () => {
    const user = userEvent.setup()

    render(
      <Dialog
        triggerLabel="Review"
        title="Ready?"
        description="Review before continuing."
        closeLabel="Return"
      >
        <button type="button">Confirm</button>
      </Dialog>,
    )

    const trigger = screen.getByRole('button', { name: 'Review' })
    await user.tab()
    await user.keyboard('{Enter}')

    const dialog = screen.getByRole('dialog', { name: 'Ready?' })
    expect(dialog).toBeTruthy()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.tab()
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    await user.tab({ shift: true })
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })
  })
})
