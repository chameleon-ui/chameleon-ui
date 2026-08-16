import { Button, Card, ChatBubble, Editor, EmptyState, List, MarkdownRenderer, Typography } from '@chameleon-ui/components-react'
import { useState } from 'react'
import { createBlockCopy } from '../copy.js'
import { imChatLocaleTrees } from './locale-map.js'
import './styles.css'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  markdown: string
  time?: string
}

export interface ImChatProps {
  locale?: string
  messages?: ChatMessage[]
  rooms?: string[]
  onSend?: (markdown: string) => void
  className?: string
}

function htmlToPlainText(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function seedMessages(t: (key: string) => string): ChatMessage[] {
  return [
    { id: 'msg-1', role: 'user', markdown: t('im.seedUser'), time: '09:41' },
    { id: 'msg-2', role: 'assistant', markdown: t('im.seedAssistant'), time: '09:42' },
  ]
}

export function ImChat({ locale = 'en', messages: initialMessages, rooms, onSend, className }: ImChatProps) {
  const { t } = createBlockCopy(imChatLocaleTrees, locale)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages ?? seedMessages(t))
  const [draft, setDraft] = useState('')
  const [composerKey, setComposerKey] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const classes = ['cu-block-im-chat', className].filter(Boolean).join(' ')
  const roomItems = rooms ?? [t('im.roomSupport'), t('im.roomDesign'), t('im.roomOps')]

  const handleSend = () => {
    const text = htmlToPlainText(draft)
    if (!text) {
      setError(t('im.errorRequired'))
      return
    }
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      markdown: text,
    }
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-reply`,
      role: 'assistant',
      markdown: t('im.assistantReply'),
    }
    setMessages((current) => [...current, userMessage, assistantMessage])
    setDraft('')
    setError(null)
    setComposerKey((value) => value + 1)
    onSend?.(text)
  }

  return (
    <section
      className={classes}
      data-ai-role="im-chat"
      data-ai-intent="converse"
      data-ai-state={messages.length === 0 ? 'empty' : 'default'}
    >
      <div className="cu-block-im-chat__header">
        <Typography variant="heading-1">{t('im.title')}</Typography>
        <Typography variant="body">{t('im.subtitle')}</Typography>
        <p className="cu-block-im-chat__meta">{t('im.messageCount', { count: messages.length })}</p>
      </div>
      <div className="cu-block-im-chat__layout">
        <aside aria-label={t('im.roomsLabel')} className="cu-block-im-chat__rooms">
          <Typography as="h2" variant="heading-2">
            {t('im.roomsLabel')}
          </Typography>
          <List items={roomItems} />
        </aside>
        <Card className="cu-block-im-chat__thread" padding="md" variant="outlined">
          <Typography as="h2" variant="heading-2">
            {t('im.threadLabel')}
          </Typography>
          {messages.length === 0 ? (
            <EmptyState description={t('im.emptyDescription')} title={t('im.emptyTitle')} />
          ) : (
            <div className="cu-block-im-chat__messages">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  label={message.role === 'user' ? t('im.userLabel') : t('im.assistantLabel')}
                  role={message.role}
                  status={message.role === 'user' ? 'sent' : undefined}
                  statusLabel={message.role === 'user' ? t('im.sentLabel') : undefined}
                  time={message.time}
                >
                  {message.role === 'assistant' ? (
                    <MarkdownRenderer label={t('im.assistantLabel')} markdown={message.markdown} />
                  ) : (
                    message.markdown
                  )}
                </ChatBubble>
              ))}
            </div>
          )}
          {error ? (
            <p className="cu-block-im-chat__error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="cu-block-im-chat__composer">
            <Editor
              key={composerKey}
              boldLabel={t('im.bold')}
              italicLabel={t('im.italic')}
              label={t('im.composerLabel')}
              onChange={setDraft}
              placeholder={t('im.placeholder')}
            />
            <Button onClick={handleSend} type="button">
              {t('im.send')}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
