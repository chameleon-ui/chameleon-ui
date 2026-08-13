import { Button as BaseButton } from '@base-ui/react/button'
import type { ComponentPropsWithoutRef } from 'react'
import './styles.css'

export type ButtonVariant = 'solid' | 'outline'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseButton>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

// @phase-1 migrate → packages/components/src/button/Button.tsx
export function Button({
  variant = 'solid',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    'cu-button',
    `cu-button--${variant}`,
    `cu-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <BaseButton {...props} type={type} className={classes} />
}
