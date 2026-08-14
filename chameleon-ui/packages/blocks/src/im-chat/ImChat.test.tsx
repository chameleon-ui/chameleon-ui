import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { ImChat } from './ImChat.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('ImChat', () => {
  it('renders rooms, markdown, and sends a composer reply', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ImChat onSend={onSend} />)

    expect(document.querySelector('[data-ai-role="im-chat"]')).toHaveAttribute('data-ai-intent', 'converse')
    expect(screen.getByRole('complementary', { name: 'Rooms' })).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
    expect(screen.getByText('healthy').tagName).toBe('STRONG')

    fireEvent.input(screen.getByRole('textbox', { name: 'Message composer' }), {
      target: { innerHTML: '<p>Need a hand</p>' },
    })
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(onSend).toHaveBeenCalledWith('Need a hand')
    expect(screen.getByText('Need a hand')).toBeInTheDocument()
    expect(screen.getByText('Received.')).toBeInTheDocument()
  })

  it('announces an empty composer without calling onSend', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ImChat onSend={onSend} />)

    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Write a message before sending.')
    expect(onSend).not.toHaveBeenCalled()
  })

  it('renders the empty state when no messages are provided', () => {
    render(<ImChat messages={[]} />)
    expect(screen.getByText('No messages yet')).toBeInTheDocument()
    expect(document.querySelector('[data-ai-role="im-chat"]')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'im.messageCount'), { count: 2 })).toBe('2 messages')
    expect(createCatalog(zhCN).get('im.send')).toBe('发送')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<ImChat locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="im-chat"]')).not.toHaveAttribute('dir', 'ltr')
  })
})
