import type { ReactNode } from 'react'
import './styles.css'

export interface LinkProps {
  children: ReactNode
  href: string
  external?: boolean
  className?: string
}

export function Link({ children, href, external = false, className }: LinkProps) {
  const classes = ['cu-link', className].filter(Boolean).join(' ')
  return (
    <a
      className={classes}
      data-ai-role="link" data-ai-state="default" data-ai-intent="navigate"
      href={href}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      {children}
    </a>
  )
}
