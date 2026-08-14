import type { ReactNode } from 'react'
import './styles.css'

export interface SafeAreaProps {
  children?: ReactNode
  /** Apply the top safe-area inset (status bar / notch). */
  top?: boolean
  /** Apply the bottom safe-area inset (home indicator / gesture bar). */
  bottom?: boolean
  /** Apply the inline-start safe-area inset. */
  start?: boolean
  /** Apply the inline-end safe-area inset. */
  end?: boolean
  className?: string
}

export function SafeArea({ children, top = false, bottom = true, start = false, end = false, className }: SafeAreaProps) {
  const classes = [
    'cu-safe-area',
    top && 'cu-safe-area--top',
    bottom && 'cu-safe-area--bottom',
    start && 'cu-safe-area--start',
    end && 'cu-safe-area--end',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} data-ai-role="safe-area" data-ai-intent="fit-safe-area" data-ai-state="default">
      {children}
    </div>
  )
}
