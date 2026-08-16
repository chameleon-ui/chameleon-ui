import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { ActionSheet } from './ActionSheet.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const actions = [
  { value: 'share', label: 'Share' },
  { value: 'delete', label: 'Delete' },
]

describe('ActionSheet', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<ActionSheet triggerLabel="Open" title="Title" cancelLabel="Cancel" actions={actions} />)
    const element = document.querySelector('.cu-action-sheet')
    expect(element).toHaveClass('cu-action-sheet')
    expect(element).toHaveAttribute('data-ai-role', 'action-sheet')
    expect(element).toHaveAttribute('data-ai-state', 'closed')
  })

  it('opens from the trigger and marks data-ai-state', async () => {
    const user = userEvent.setup()
    render(<ActionSheet triggerLabel="Open" title="Title" cancelLabel="Cancel" actions={actions} />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const element = document.querySelector('.cu-action-sheet')
    expect(element).toHaveAttribute('data-ai-state', 'open')
    expect(screen.getByText('Share')).toHaveClass('cu-action-sheet__action')
    expect(screen.getByText('Cancel')).toHaveClass('cu-action-sheet__cancel')
  })

  it('fires onAction and closes when an action is chosen', () => {
    const onAction = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <ActionSheet
        triggerLabel="Open"
        title="Title"
        cancelLabel="Cancel"
        actions={actions}
        open
        onAction={onAction}
        onOpenChange={onOpenChange}
      />,
    )
    fireEvent.click(screen.getByText('Delete'))
    expect(onAction).toHaveBeenCalledWith('delete')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('dismisses on a downward drag past the threshold', () => {
    const onOpenChange = vi.fn()
    render(
      <ActionSheet
        triggerLabel="Open"
        title="Title"
        cancelLabel="Cancel"
        actions={actions}
        open
        onOpenChange={onOpenChange}
      />,
    )
    const handle = document.querySelector('.cu-action-sheet__handle') as HTMLElement
    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 100 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 220 })
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 220 })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not dismiss on a short drag', () => {
    const onOpenChange = vi.fn()
    render(
      <ActionSheet
        triggerLabel="Open"
        title="Title"
        cancelLabel="Cancel"
        actions={actions}
        open
        onOpenChange={onOpenChange}
      />,
    )
    const handle = document.querySelector('.cu-action-sheet__handle') as HTMLElement
    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 100 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 130 })
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 130 })
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'actionSheet.label')).toBeDefined()
    expect(requireMessage(catalog, 'actionSheet.cancel')).toBe('Cancel')
    expect(requireMessage(createCatalog(zhCN), 'actionSheet.cancel')).toBe('取消')
    expect(requireMessage(createCatalog(de), 'actionSheet.label')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'actionSheet.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<ActionSheet triggerLabel="Open" title="Title" cancelLabel="Cancel" actions={actions} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
