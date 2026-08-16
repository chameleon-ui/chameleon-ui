import type { ReactNode } from 'react'
import './styles.css'

export interface ChatBubbleProps {
  role?: 'user' | 'assistant' | 'system'
  children: ReactNode
  time?: string
  status?: 'streaming' | 'sent' | 'error'
  statusLabel?: string
  avatarSrc?: string
  avatarAlt?: string
  label?: string
  className?: string
}

export function ChatBubble({
  role = 'assistant',
  children,
  time,
  status,
  statusLabel,
  avatarSrc,
  avatarAlt = '',
  label,
  className,
}: ChatBubbleProps) {
  const classes = ['cu-chat-bubble', 'cu-chat-bubble--' + role, status ? 'cu-chat-bubble--' + status : undefined, className]
    .filter(Boolean)
    .join(' ')
  return (
    <article className={classes} aria-label={label ?? role} data-ai-role="chat-bubble" data-ai-intent="notify-status" data-ai-state={status ?? role}>
      {avatarSrc ? <img className="cu-chat-bubble__avatar" src={avatarSrc} alt={avatarAlt} /> : null}
      <div className="cu-chat-bubble__content">
        <div className="cu-chat-bubble__meta">
          <span className="cu-chat-bubble__role">{role}</span>
          {time ? <time className="cu-chat-bubble__time">{time}</time> : null}
          {statusLabel ? <span className="cu-chat-bubble__status">{statusLabel}</span> : null}
        </div>
        <div className="cu-chat-bubble__body" aria-live={status === 'streaming' ? 'polite' : undefined}>
          {children}
        </div>
      </div>
    </article>
  )
}
