import type { ReactNode } from 'react'
import './styles.css'

export type StackDirection = 'row' | 'column'
export type StackGap = '0' | '1' | '2' | '3' | '4' | '5' | '6'
export type StackAlignment = 'start' | 'center' | 'end' | 'stretch'
export type StackJustify = 'start' | 'center' | 'end' | 'between'

export interface StackProps {
  direction?: StackDirection
  gap?: StackGap
  /** Cross-axis alignment. Default `stretch` fills the cross axis (full width in a column stack). */
  align?: StackAlignment
  /** Main-axis distribution. */
  justify?: StackJustify
  /**
   * Grow to fill a flex/grid parent (workspace panes, shell columns, toolbars).
   * Sets `flex: 1 1 auto` + self stretch; pair with `align="stretch"` for children.
   */
  grow?: boolean
  children: ReactNode
  className?: string
}

export function Stack({
  direction = 'column',
  gap = '2',
  align = 'stretch',
  justify = 'start',
  grow = false,
  children,
  className,
}: StackProps) {
  const classes = [
    'cu-stack',
    `cu-stack--${direction}`,
    `cu-stack--gap-${gap}`,
    `cu-stack--align-${align}`,
    `cu-stack--justify-${justify}`,
    grow ? 'cu-stack--grow' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      data-ai-role="stack"
      data-ai-intent="layout-flow"
      data-ai-state="default"
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-grow={grow ? 'true' : 'false'}
    >
      {children}
    </div>
  )
}
