import type { ReactNode } from 'react'
import './styles.css'

export interface LabelProps {
  children: ReactNode
  htmlFor?: string
  className?: string
}

export function Label({ children, htmlFor, className }: LabelProps) {
  const classes = ['cu-label', className].filter(Boolean).join(' ')
  return <label className={classes} data-ai-role="label" data-ai-state="default" data-ai-intent="name-field" htmlFor={htmlFor}>{children}</label>
}
