import type { ReactNode } from 'react'
import './styles.css'

export type ToastStatus = 'info' | 'success' | 'warning' | 'error'

export interface ToastProps {
  open: boolean
  title: string
  description: ReactNode
  status?: ToastStatus
  closeLabel: string
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Toast({
  open,
  title,
  description,
  status = 'info',
  closeLabel,
  onOpenChange,
  className,
}: ToastProps) {
  if (!open) return null

  const classes = ['cu-toast', `cu-toast--${status}`, className].filter(Boolean).join(' ')

  return (
    <div
      aria-label={title}
      className={classes}
      data-ai-role="toast" data-ai-intent="notify-transient"
      data-ai-state={status}
      role="status"
      aria-live={status === 'error' ? 'assertive' : 'polite'}
    >
      <div className="cu-toast__title">{title}</div>
      <div className="cu-toast__description">{description}</div>
      <button
        className="cu-toast__close"
        onClick={() => onOpenChange?.(false)}
        type="button"
      >
        {closeLabel}
      </button>
    </div>
  )
}
