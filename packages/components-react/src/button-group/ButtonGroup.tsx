import type { ReactNode } from 'react'
import './styles.css'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'
/** `attached` = segmented / shared border; `spaced` = token gap between buttons. */
export type ButtonGroupVariant = 'attached' | 'spaced'
export type ButtonGroupSize = 'sm' | 'md'

export interface ButtonGroupProps {
  /** Main axis of the group. Default `horizontal`. */
  orientation?: ButtonGroupOrientation
  /**
   * Visual grouping. `attached` shares borders (segmented tool toggles);
   * `spaced` keeps a token gap.
   */
  variant?: ButtonGroupVariant
  /** Size hint applied to nested `.cu-button` when children omit size. */
  size?: ButtonGroupSize
  /** Accessible name for the group (required when no visible legend). */
  label?: string
  disabled?: boolean
  children: ReactNode
  className?: string
}

export function ButtonGroup({
  orientation = 'horizontal',
  variant = 'attached',
  size = 'md',
  label,
  disabled = false,
  children,
  className,
}: ButtonGroupProps) {
  const classes = [
    'cu-button-group',
    `cu-button-group--${orientation}`,
    `cu-button-group--${variant}`,
    `cu-button-group--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      role="group"
      aria-label={label}
      aria-disabled={disabled || undefined}
      data-orientation={orientation}
      data-variant={variant}
      data-size={size}
      data-disabled={disabled ? 'true' : 'false'}
      data-ai-role="button-group"
      data-ai-intent="select-single"
      data-ai-state={disabled ? 'disabled' : 'default'}
    >
      {children}
    </div>
  )
}
