import type { ReactNode } from 'react'
import './styles.css'

export interface GridProps {
  children: ReactNode
  columns?: number
  gap?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

export function Grid({ children, columns = 1, gap = 'md', className }: GridProps) {
  const classes = ['cu-grid', 'cu-grid--gap-' + gap, className].filter(Boolean).join(' ')
  return (
    <div
      className={classes}
      data-ai-role="grid" data-ai-state="default" data-ai-intent="layout-columns"
      style={{ gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' }}
    >
      {children}
    </div>
  )
}
