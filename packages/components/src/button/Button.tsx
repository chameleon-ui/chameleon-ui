import { ButtonPrimitive } from '@chameleon-ui/primitives'
import type { ButtonPrimitiveProps } from '@chameleon-ui/primitives'
import type { ReactNode } from 'react'
import './styles.css'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md'
export type ButtonTone = 'brand' | 'danger'

export interface ButtonProps extends Omit<ButtonPrimitiveProps, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Semantic color. Does not change the button role. */
  tone?: ButtonTone
  /** Shows a spinner, sets aria-busy, and blocks activation. */
  loading?: boolean
  /** Leading visual. Provide a visible text child or aria-label. */
  icon?: ReactNode
  className?: string
}

function aiState(disabled?: boolean, loading?: boolean): 'loading' | 'disabled' | 'default' {
  if (loading) return 'loading'
  if (disabled) return 'disabled'
  return 'default'
}

export function Button({
  variant = 'solid',
  size = 'md',
  tone = 'brand',
  loading = false,
  icon,
  className,
  type = 'button',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading)
  const classes = [
    'cu-button',
    `cu-button--${variant}`,
    `cu-button--${size}`,
    `cu-button--tone-${tone}`,
    loading ? 'cu-button--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ButtonPrimitive
      className={classes}
      data-ai-role="button"
      data-ai-intent="submit"
      data-ai-state={aiState(disabled, loading)}
      data-size={size}
      data-variant={variant}
      data-tone={tone}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      type={type}
      {...props}
    >
      {loading ? <span aria-hidden="true" className="cu-button__spinner" /> : null}
      {!loading && icon ? (
        <span aria-hidden="true" className="cu-button__icon">
          {icon}
        </span>
      ) : null}
      {children}
    </ButtonPrimitive>
  )
}
