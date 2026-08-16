import { FieldPrimitive } from '@chameleon-ui/primitives'
import type { ComponentPropsWithoutRef } from 'react'
import './styles.css'

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
  label: string
  disabled?: boolean
  invalid?: boolean
  errorMessage?: string
  className?: string
}

export function Input({
  value,
  onChange,
  label,
  disabled = false,
  invalid = false,
  errorMessage = 'Please review this value.',
  className,
  id,
  ...props
}: InputProps) {
  const classes = ['cu-input', className].filter(Boolean).join(' ')

  return (
    <FieldPrimitive.Root
      className="cu-field"
      data-ai-role="input" data-ai-intent="enter-text"
      data-ai-state={invalid ? 'invalid' : disabled ? 'disabled' : 'default'}
      disabled={disabled}
      id={id}
      invalid={invalid}
    >
      <FieldPrimitive.Label className="cu-field__label">{label}</FieldPrimitive.Label>
      <FieldPrimitive.Input
        {...props}
        className={classes}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      {invalid ? (
        <FieldPrimitive.ErrorText className="cu-field__error">{errorMessage}</FieldPrimitive.ErrorText>
      ) : null}
    </FieldPrimitive.Root>
  )
}
