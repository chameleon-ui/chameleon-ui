import './styles.css'

export interface NotificationProps {
  title: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  onDismiss?: () => void
  dismissLabel?: string
  className?: string
}

export function Notification({
  title,
  message,
  variant = 'info',
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
}: NotificationProps) {
  const classes = ['cu-notification', 'cu-notification--' + variant, className].filter(Boolean).join(' ')
  return (
    <div className={classes} role="status" data-ai-role="notification" data-ai-intent="notify-status" data-ai-state={variant}>
      <div className="cu-notification__body">
        <p className="cu-notification__title">{title}</p>
        <p className="cu-notification__message">{message}</p>
      </div>
      {onDismiss ? (
        <button type="button" className="cu-notification__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
          ×
        </button>
      ) : null}
    </div>
  )
}
