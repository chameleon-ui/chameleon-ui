import type { ReactNode } from 'react'
import './styles.css'

export type MasonryGap = 'sm' | 'md' | 'lg'

export interface MasonryProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  gap?: MasonryGap
  className?: string
}

export function Masonry({ children, columns = 3, gap = 'md', className }: MasonryProps) {
  const classes = [
    'cu-masonry',
    'cu-masonry--columns-' + columns,
    'cu-masonry--gap-' + gap,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      data-ai-role="masonry"
      data-ai-intent="layout-columns"
      data-ai-state="default"
      data-columns={columns}
    >
      <div className="cu-masonry__track">{children}</div>
    </div>
  )
}
