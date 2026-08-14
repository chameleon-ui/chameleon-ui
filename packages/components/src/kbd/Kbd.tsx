import type { ReactNode } from 'react'
import './styles.css'

export interface KbdProps {
  children: ReactNode
  className?: string
}

export function Kbd({ children, className }: KbdProps) {
  const classes = ['cu-kbd', className].filter(Boolean).join(' ')
  return <kbd className={classes} data-ai-role="kbd" data-ai-state="default" data-ai-intent="show-shortcut">{children}</kbd>
}
