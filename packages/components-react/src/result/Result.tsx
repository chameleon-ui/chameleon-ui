import type { ReactNode } from 'react'
import './styles.css'

export interface ResultProps {
  status?: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

const STATUS_GLYPH = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' } as const

export function Result({ status = 'info', title, description, children, className }: ResultProps) {
  const classes = ['cu-result', 'cu-result--' + status, className].filter(Boolean).join(' ')
  return (
    <div className={classes} role="status" data-ai-role="result" data-ai-intent="notify-status" data-ai-state={status}>
      <span className="cu-result__icon" aria-hidden="true">
        {STATUS_GLYPH[status]}
      </span>
      <p className="cu-result__title">{title}</p>
      {description ? <p className="cu-result__description">{description}</p> : null}
      {children ? <div className="cu-result__actions">{children}</div> : null}
    </div>
  )
}
