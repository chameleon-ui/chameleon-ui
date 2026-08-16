import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { CommentThread } from './CommentThread.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const comments = [
  {
    id: 'c1',
    author: 'Ada',
    time: '10:00',
    text: 'Looks good overall.',
    replies: [{ id: 'c1-r1', author: 'Grace', time: '10:05', text: 'Agreed, ship it.' }],
  },
]

describe('CommentThread', () => {
  it('renders nested comments with data-ai-role', () => {
    render(<CommentThread comments={comments} label="Comments" />)
    const region = screen.getByRole('region', { name: 'Comments' })
    expect(region).toHaveAttribute('data-ai-role', 'comment-thread')
    expect(screen.getByText('Agreed, ship it.')).toBeInTheDocument()
  })

  it('emits the comment id on reply', () => {
    let replied = ''
    render(<CommentThread comments={comments} replyLabel="Reply" onReply={(id) => { replied = id }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Reply: Ada' }))
    expect(replied).toBe('c1')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'comment-thread.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<CommentThread comments={comments} label="تعليقات" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
