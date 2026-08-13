import { ark } from '@ark-ui/react'
import type { ComponentPropsWithoutRef } from 'react'

export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'className'> {
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

// @phase-1 migrate → packages/components after O1 is signed off.
export function Button({
  variant = 'solid',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = ['cu-button', `cu-button--${variant}`, `cu-button--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return <ark.button className={classes} data-size={size} data-variant={variant} type={type} {...props} />
}
