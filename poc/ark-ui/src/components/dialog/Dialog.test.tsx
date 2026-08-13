import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('opens from the keyboard, closes with Escape, and restores trigger focus', async () => {
    const user = userEvent.setup()
    render(
      <Dialog
        closeLabel="Close"
        description="Dialog focus regression"
        title="Preferences"
        triggerLabel="Open preferences"
      >
        <button type="button">Save preferences</button>
      </Dialog>,
    )

    await user.tab()
    const trigger = screen.getByRole('button', { name: 'Open preferences' })
    expect(trigger).toHaveFocus()

    await user.keyboard('{Enter}')
    const dialog = await screen.findByRole('dialog', { name: 'Preferences' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveFocus()

    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.tab({ shift: true })
    expect(dialog.contains(document.activeElement)).toBe(true)

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Preferences' })).not.toBeInTheDocument()
      expect(trigger).toHaveFocus()
    })
  })
})
