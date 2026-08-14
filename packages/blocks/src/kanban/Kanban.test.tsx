import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { Kanban } from './Kanban.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Kanban', () => {
  it('renders three columns and moves a card forward', async () => {
    const user = userEvent.setup()
    const onMove = vi.fn()
    render(<Kanban onMove={onMove} />)

    expect(document.querySelector('[data-ai-role="kanban"]')).toHaveAttribute('data-ai-intent', 'organize-cards')
    expect(screen.getByRole('heading', { name: 'To do' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'In progress' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Done' })).toBeInTheDocument()
    expect(screen.getByText('Sketch layout')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Move Design login forward' }))
    expect(onMove).toHaveBeenCalledTimes(1)
    expect(onMove.mock.calls[0]?.[1]).toBe('doing')
    expect(screen.getByRole('button', { name: 'Move Design login back' })).not.toBeDisabled()
  })

  it('renders the empty state when no cards are provided', () => {
    render(<Kanban cards={[]} />)
    expect(screen.getAllByText('This column has no cards yet.')).toHaveLength(3)
    expect(document.querySelector('[data-ai-role="kanban"]')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'kanban.cardCount'), { count: 4 })).toBe('4 cards')
    expect(createCatalog(zhCN).get('kanban.colTodo')).toBe('待办')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Kanban locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="kanban"]')).not.toHaveAttribute('dir', 'ltr')
  })
})
