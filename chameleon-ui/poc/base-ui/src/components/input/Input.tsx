import { Input as BaseInput } from '@base-ui/react/input'
import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import './styles.css'

export interface InputProps
  extends Omit<
    ComponentPropsWithoutRef<typeof BaseInput>,
    'className' | 'onChange' | 'onValueChange' | 'value'
  > {
  value: string
  onChange: (value: string) => void
  label: string
  invalid?: boolean
  errorMessage?: string
  className?: string
}

// @phase-1 migrate → packages/components/src/input/Input.tsx
export function Input({
  value,
  onChange,
  label,
  invalid = false,
  errorMessage = 'Please review this value.',
  className,
  id: providedId,
  disabled,
  ...props
}: InputProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const errorId = `${id}-error`
  const classes = ['cu-input', invalid && 'cu-input--invalid', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="cu-field">
      <label className="cu-field__label" htmlFor={id}>
        {label}
      </label>
      <BaseInput
        {...props}
        id={id}
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        onValueChange={onChange}
        className={classes}
      />
      {invalid ? (
        <p className="cu-field__error" id={errorId}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
