import type { ReactNode } from 'react'
import './styles.css'

export interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const classes = ['cu-badge', 'cu-badge--' + variant, 'cu-badge--' + size, className].filter(Boolean).join(' ')
  return <span className={classes} data-ai-role="badge" data-ai-intent="flag-status" data-ai-state={variant}>{children}</span>
}
