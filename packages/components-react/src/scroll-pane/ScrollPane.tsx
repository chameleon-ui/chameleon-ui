import type { CSSProperties, ReactNode } from 'react'
import './styles.css'

export type ScrollPaneOrientation = 'vertical' | 'horizontal' | 'both'

export interface ScrollPaneProps {
  children: ReactNode
  orientation?: ScrollPaneOrientation
  overscrollBehavior?: CSSProperties['overscrollBehavior']
  className?: string
}

export function ScrollPane({
  children,
  orientation = 'vertical',
  overscrollBehavior = 'contain',
  className,
}: ScrollPaneProps) {
  const classes = ['cu-scroll-pane', `cu-scroll-pane--${orientation}`, className]
    .filter(Boolean)
    .join(' ')
  return (
    <div
      className={classes}
      data-ai-role="scroll-pane"
      data-ai-intent="scroll-region"
      data-ai-state="default"
      style={{ overscrollBehavior }}
    >
      {children}
    </div>
  )
}
