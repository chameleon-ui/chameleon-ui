import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { ChatBubble } from './ChatBubble.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('ChatBubble', () => {
  it('renders the bubble with role-driven state', () => {
    render(<ChatBubble role="user" time="10:01">Summarize this</ChatBubble>)
    const bubble = screen.getByRole('article', { name: 'user' })
    expect(bubble).toHaveClass('cu-chat-bubble--user')
    expect(bubble).toHaveAttribute('data-ai-role', 'chat-bubble')
    expect(bubble).toHaveAttribute('data-ai-state', 'user')
    expect(bubble).toHaveTextContent('Summarize this')
  })

  it('renders the avatar and status label', () => {
    render(
      <ChatBubble role="assistant" avatarSrc="/ada.png" avatarAlt="Ada" status="sent" statusLabel="Sent">
        Done
      </ChatBubble>,
    )
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveClass('cu-chat-bubble__avatar')
    expect(screen.getByText('Sent')).toHaveClass('cu-chat-bubble__status')
  })

  it('marks streaming bubbles with aria-live and a streaming state', () => {
    render(
      <ChatBubble role="assistant" status="streaming" statusLabel="Typing">
        Partial answer
      </ChatBubble>,
    )
    const bubble = screen.getByRole('article', { name: 'assistant' })
    expect(bubble).toHaveAttribute('data-ai-state', 'streaming')
    expect(bubble.querySelector('.cu-chat-bubble__body')).toHaveAttribute('aria-live', 'polite')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'chat-bubble.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<ChatBubble role="assistant">مرحبا</ChatBubble>)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
