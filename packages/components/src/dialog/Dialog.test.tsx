import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Dialog } from './Dialog.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Dialog', () => {
  it('opens from the keyboard, closes with Escape, and restores trigger focus', async () => {
    const user = userEvent.setup()
    const copy = createCatalog(en)
    render(
      <Dialog
        closeLabel={copy.get('dialog.close') ?? ''}
        description={copy.get('dialog.description') ?? ''}
        title={copy.get('dialog.title') ?? ''}
        triggerLabel={copy.get('dialog.trigger') ?? ''}
      >
        <button type="button">Save preferences</button>
      </Dialog>,
    )

    await user.tab()
    const trigger = screen.getByRole('button', { name: copy.get('dialog.trigger') ?? '' })
    expect(trigger).toHaveFocus()

    await user.keyboard('{Enter}')
    const dialog = await screen.findByRole('dialog', { name: copy.get('dialog.title') ?? '' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('data-ai-role', 'dialog')
    expect(dialog).toHaveClass('cu-dialog__content')

    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: copy.get('dialog.title') ?? '' })).not.toBeInTheDocument()
      expect(trigger).toHaveFocus()
    })
  })

  it('opens under Arabic rtl without forcing ltr on the dialog', async () => {
    const user = userEvent.setup()
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(
      <Dialog
        closeLabel={copy.get('dialog.close') ?? ''}
        description={copy.get('dialog.description') ?? ''}
        title={copy.get('dialog.title') ?? ''}
        triggerLabel={copy.get('dialog.trigger') ?? ''}
      />,
    )

    await user.click(screen.getByRole('button', { name: copy.get('dialog.trigger') ?? '' }))
    const dialog = await screen.findByRole('dialog', { name: copy.get('dialog.title') ?? '' })
    expect(document.documentElement.dir).toBe('rtl')
    expect(dialog).not.toHaveAttribute('dir', 'ltr')
  })
})
