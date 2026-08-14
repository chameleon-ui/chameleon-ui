import type { ReactNode } from 'react'
import './styles.css'

export type ContainerSize = 'sm' | 'md' | 'lg'

export interface ContainerProps {
  children: ReactNode
  size?: ContainerSize
  className?: string
}

export function Container({ children, size = 'md', className }: ContainerProps) {
  const classes = ['cu-container', 'cu-container--' + size, className].filter(Boolean).join(' ')
  return (
    <div
      className={classes}
      data-ai-role="container"
      data-ai-intent="group-content"
      data-ai-state={size}
    >
      <div className="cu-container__body">{children}</div>
    </div>
  )
}
