import type { ReactNode } from 'react'
import './styles.css'

export interface CardProps {
  children: ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Card({ children, variant = 'default', padding = 'md', className }: CardProps) {
  const classes = ['cu-card', 'cu-card--' + variant, 'cu-card--padding-' + padding, className].filter(Boolean).join(' ')
  return <div className={classes} data-ai-role="card" data-ai-intent="group-content" data-ai-state={variant}>{children}</div>
}
