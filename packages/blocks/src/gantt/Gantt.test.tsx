import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { Gantt } from './Gantt.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Gantt', () => {
  it('renders task bars on a date scale and notifies on select', async () => {
    const user = userEvent.setup()
    const onSelectTask = vi.fn()
    render(<Gantt onSelectTask={onSelectTask} />)

    expect(document.querySelector('[data-ai-role="gantt"]')).toHaveAttribute('data-ai-intent', 'schedule-tasks')
    expect(screen.getByRole('heading', { name: 'Schedule' })).toBeInTheDocument()
    expect(screen.getAllByText('Design system').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Auth blocks').length).toBeGreaterThan(0)

    const bar = screen.getByRole('button', { name: 'Design system from 2026-08-01 to 2026-08-10' })
    expect(bar.style.insetInlineStart).toMatch(/%$/)
    expect(bar.style.inlineSize).toMatch(/%$/)

    await user.click(bar)
    expect(onSelectTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'task-1', title: 'Design system' }),
    )
  })

  it('renders the empty state when no tasks are provided', () => {
    render(<Gantt tasks={[]} />)
    expect(screen.getByText('Add a task to plot the schedule.')).toBeInTheDocument()
    expect(document.querySelector('[data-ai-role="gantt"]')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'gantt.taskCount'), { count: 3 })).toBe('3 tasks')
    expect(createCatalog(zhCN).get('gantt.title')).toBe('进度计划')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Gantt locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="gantt"]')).not.toHaveAttribute('dir', 'ltr')
  })
})
