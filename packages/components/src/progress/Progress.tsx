import './styles.css'

export interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

export function Progress({ value, max = 100, size = 'md', className }: ProgressProps) {
  const classes = ['cu-progress', 'cu-progress--' + size, className].filter(Boolean).join(' ')
  return (
    <progress
      className={classes}
      data-ai-role="progress" data-ai-state="default" data-ai-intent="show-progress"
      max={max}
      value={value}
    >
      {value}%
    </progress>
  )
}
