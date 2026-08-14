import type { ReactNode } from 'react'
import './styles.css'

export interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  const classes = ['cu-empty-state', className].filter(Boolean).join(' ')
  return (
    <div className={classes} data-ai-role="empty-state" data-ai-state="default" data-ai-intent="prompt-first-action" role="status">
      <div className="cu-empty-state__title">{title}</div>
      {description ? <div className="cu-empty-state__description">{description}</div> : null}
      {action ? <div className="cu-empty-state__action">{action}</div> : null}
    </div>
  )
}
