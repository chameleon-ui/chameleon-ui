import type { ReactNode } from 'react'
import './styles.css'

export interface InlineAlertProps {
  children: ReactNode
  status?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

export function InlineAlert({ children, status = 'info', className }: InlineAlertProps) {
  const classes = ['cu-inline-alert', 'cu-inline-alert--' + status, className].filter(Boolean).join(' ')
  return <div className={classes} data-ai-role="inline-alert" data-ai-intent="flag-field-error" data-ai-state={status} role="status">{children}</div>
}
