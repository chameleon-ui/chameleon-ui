import { ButtonPrimitive } from '@chameleon-ui/primitives'
import type { ButtonPrimitiveProps } from '@chameleon-ui/primitives'
import './styles.css'

export interface ButtonProps extends Omit<ButtonPrimitiveProps, 'className'> {
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Button({
  variant = 'solid',
  size = 'md',
  className,
  type = 'button',
  disabled,
  ...props
}: ButtonProps) {
  const classes = ['cu-button', `cu-button--${variant}`, `cu-button--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <ButtonPrimitive
      className={classes}
      data-ai-role="button" data-ai-intent="submit"
      data-ai-state={disabled ? 'disabled' : 'default'}
      data-size={size}
      data-variant={variant}
      disabled={disabled}
      type={type}
      {...props}
    />
  )
}
