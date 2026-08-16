import './styles.css'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  /** Accessible label describing the loading state. */
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  const classes = ['cu-spinner', `cu-spinner--${size}`, className].filter(Boolean).join(' ')

  return (
    <span
      className={classes}
      data-ai-role="spinner" data-ai-intent="indicate-busy"
      data-ai-state="loading"
      data-size={size}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg aria-hidden="true" className="cu-spinner__svg" viewBox="0 0 24 24">
        <circle className="cu-spinner__track" cx="12" cy="12" r="10" />
        <circle className="cu-spinner__lead" cx="12" cy="12" r="10" />
      </svg>
    </span>
  )
}
