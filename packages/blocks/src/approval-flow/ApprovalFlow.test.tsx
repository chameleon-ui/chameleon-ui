import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { ApprovalFlow } from './ApprovalFlow.js'
import { approvalFlowLocaleTrees } from './locale-map.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('ApprovalFlow', () => {
  it('records an approval and exposes block markers', async () => {
    const user = userEvent.setup()
    const onDecide = vi.fn()

    render(<ApprovalFlow onDecide={onDecide} />)
    const root = document.querySelector('[data-ai-role="approval-flow"]')
    expect(root).toHaveAttribute('data-ai-intent', 'review-request')
    expect(root).toHaveAttribute('data-ai-state', 'pending')
    expect(root).toHaveClass('cu-block-approval-flow')
    expect(screen.getByRole('navigation', { name: 'Approval steps' })).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Approve' }))
    await user.type(screen.getByLabelText('Comment'), 'Looks good for Q3.')
    await user.click(screen.getByRole('button', { name: 'Submit decision' }))

    expect(onDecide).toHaveBeenCalledWith({
      decision: 'approve',
      comment: 'Looks good for Q3.',
    })
    expect(document.querySelector('[data-ai-role="approval-flow"]')).toHaveAttribute('data-ai-state', 'approved')
    expect(screen.getByRole('status')).toHaveTextContent('Request approved')
  })

  it('announces missing fields without calling onDecide', async () => {
    const user = userEvent.setup()
    const onDecide = vi.fn()
    render(<ApprovalFlow onDecide={onDecide} />)

    await user.click(screen.getByRole('button', { name: 'Submit decision' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a decision and add a comment.')
    expect(onDecide).not.toHaveBeenCalled()
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'approval.requestCount'), { count: 0 })).toBe(
      'No open requests',
    )
    expect(createCatalog(zhCN).get('approval.submit')).toBe('提交决定')
    expect(createCatalog(approvalFlowLocaleTrees.de).get('approval.title')).toBe('Approval request')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<ApprovalFlow locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="approval-flow"]')).not.toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('button', { name: 'Submit decision' })).toBeInTheDocument()
  })
})
