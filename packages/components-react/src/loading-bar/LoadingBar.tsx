import './styles.css'

export interface LoadingBarProps {
  value?: number
  label?: string
  className?: string
}

export function LoadingBar({ value, label = 'Loading', className }: LoadingBarProps) {
  const determinate = typeof value === 'number'
  const classes = ['cu-loading-bar', determinate ? '' : 'cu-loading-bar--indeterminate', className]
    .filter(Boolean)
    .join(' ')
  return (
    <div
      className={classes}
      role="progressbar"
      aria-label={label}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? 100 : undefined}
      aria-valuenow={determinate ? value : undefined}
      data-ai-role="loading-bar" data-ai-intent="show-progress"
      data-ai-state={determinate ? 'default' : 'indeterminate'}
    >
      <div
        className="cu-loading-bar__fill"
        style={determinate ? { inlineSize: `${Math.min(100, Math.max(0, value))}%` } : undefined}
      />
    </div>
  )
}
