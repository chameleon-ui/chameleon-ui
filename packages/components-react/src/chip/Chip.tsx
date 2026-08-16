import type { ReactNode } from 'react'
import './styles.css'

export interface ChipProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  onRemove?: () => void
  className?: string
}

export function Chip({ children, variant = 'default', onRemove, className }: ChipProps) {
  const classes = ['cu-chip', 'cu-chip--' + variant, className].filter(Boolean).join(' ')
  return (
    <span className={classes} data-ai-role="chip" data-ai-intent="filter-selection" data-ai-state={onRemove ? 'removable' : 'default'}>
      {children}
      {onRemove ? (
        <button className="cu-chip__remove" onClick={onRemove} type="button" aria-label="Remove">×</button>
      ) : null}
    </span>
  )
}
