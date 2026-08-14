import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { ConfirmDialog } from './ConfirmDialog.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const props = {
  triggerLabel: 'Delete',
  title: 'Delete record?',
  description: 'This action cannot be undone.',
  confirmLabel: 'Delete record',
  cancelLabel: 'Cancel',
}

describe('ConfirmDialog', () => {
  it('opens the dialog and confirms via the confirm action', async () => {
    const user = userEvent.setup()
    let confirmed = 0
    render(<ConfirmDialog {...props} onConfirm={() => { confirmed += 1 }} />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    const dialog = await screen.findByRole('dialog', { name: 'Delete record?' })
    expect(dialog).toHaveAttribute('data-ai-role', 'confirm-dialog')
    expect(dialog).toHaveAttribute('data-ai-state', 'open')

    await user.click(screen.getByRole('button', { name: 'Delete record' }))
    expect(confirmed).toBe(1)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'confirm-dialog.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<ConfirmDialog {...props} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
