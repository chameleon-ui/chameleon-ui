import type { ReactNode } from 'react'
import './styles.css'

export type AlertStatus = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  status?: AlertStatus
  title: string
  description: ReactNode
  className?: string
}

export function Alert({ status = 'info', title, description, className }: AlertProps) {
  const classes = ['cu-alert', `cu-alert--${status}`, className].filter(Boolean).join(' ')

  return (
    <div
      aria-label={title}
      className={classes}
      data-ai-role="alert" data-ai-intent="notify-status"
      data-ai-state={status}
      role={status === 'error' ? 'alert' : 'status'}
      aria-live={status === 'error' ? 'assertive' : 'polite'}
    >
      <div className="cu-alert__title">{title}</div>
      <div className="cu-alert__description">{description}</div>
    </div>
  )
}
