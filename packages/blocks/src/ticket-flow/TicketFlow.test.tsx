import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { TicketFlow } from './TicketFlow.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('TicketFlow', () => {
  it('lists seed notes, appends a note, and advances the stage', async () => {
    const user = userEvent.setup()
    const onNote = vi.fn()
    const onAdvance = vi.fn()
    render(<TicketFlow onAdvance={onAdvance} onNote={onNote} />)

    expect(document.querySelector('[data-ai-role="ticket-flow"]')).toHaveAttribute(
      'data-ai-intent',
      'progress-ticket',
    )
    expect(screen.getByRole('navigation', { name: 'Ticket stages' })).toBeInTheDocument()
    expect(screen.getByText('Needs a repro')).toBeInTheDocument()
    expect(screen.getByText('Triage').closest('[aria-current="step"]')).not.toBeNull()

    await user.type(screen.getByLabelText('Add a note'), 'Linked the failing trace')
    await user.click(screen.getByRole('button', { name: 'Add note' }))
    expect(onNote).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Linked the failing trace')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Advance stage' }))
    expect(onAdvance).toHaveBeenCalledWith('progress')
    const steps = screen.getByRole('navigation', { name: 'Ticket stages' })
    expect(within(steps).getByText('In progress').closest('[aria-current="step"]')).not.toBeNull()
    expect(screen.getByText('Moved to In progress')).toBeInTheDocument()
  })

  it('renders the empty state when no notes are provided', () => {
    render(<TicketFlow notes={[]} />)
    expect(screen.getByText('No notes yet')).toBeInTheDocument()
    expect(document.querySelector('[data-ai-role="ticket-flow"]')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'ticket.noteCount'), { count: 2 })).toBe('2 notes')
    expect(createCatalog(zhCN).get('ticket.advance')).toBe('推进一步')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<TicketFlow locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="ticket-flow"]')).not.toHaveAttribute('dir', 'ltr')
  })
})
