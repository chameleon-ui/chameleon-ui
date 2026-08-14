import type { ReactNode } from 'react'
import './styles.css'

export type StackDirection = 'row' | 'column'
export type StackGap = '0' | '1' | '2' | '3'
export type StackAlignment = 'start' | 'center' | 'end' | 'stretch'
export type StackJustify = 'start' | 'center' | 'end' | 'between'

export interface StackProps {
  direction?: StackDirection
  gap?: StackGap
  align?: StackAlignment
  justify?: StackJustify
  children: ReactNode
  className?: string
}

export function Stack({
  direction = 'column',
  gap = '2',
  align = 'stretch',
  justify = 'start',
  children,
  className,
}: StackProps) {
  const classes = ['cu-stack', `cu-stack--${direction}`, `cu-stack--gap-${gap}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      data-ai-role="stack" data-ai-intent="layout-flow"
      data-ai-state="default"
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
    >
      {children}
    </div>
  )
}
