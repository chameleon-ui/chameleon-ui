import { Field } from '@ark-ui/react/field'
import type { ComponentPropsWithoutRef } from 'react'

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

// @phase-1 migrate → packages/components after O1 is signed off.
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
    <Field.Root className="cu-field" disabled={disabled} id={id} invalid={invalid}>
      <Field.Label className="cu-field__label">{label}</Field.Label>
      <Field.Input
        {...props}
        className={classes}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      {invalid ? <Field.ErrorText className="cu-field__error">{errorMessage}</Field.ErrorText> : null}
    </Field.Root>
  )
}
