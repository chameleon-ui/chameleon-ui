import type { ReactNode } from 'react'
import './styles.css'

export interface FooterProps {
  /** Credits, legal links, or other attribution content. */
  children?: ReactNode
  className?: string
}

/**
 * First-class AppShell attribution chrome. Mount in AppShell `footer` / `#footer`
 * (not Navigation `#footer` — that is the sidebar account foot).
 */
export function Footer({ children, className }: FooterProps) {
  const classes = ['cu-footer', className].filter(Boolean).join(' ')
  return (
    <div
      className={classes}
      data-ai-role="footer"
      data-ai-intent="show-attribution"
      data-ai-state="default"
    >
      {children}
    </div>
  )
}
