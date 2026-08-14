import { FieldPrimitive } from '@chameleon-ui/primitives'
import { useState } from 'react'
import '../input/styles.css'
import './styles.css'

export interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  showLabel: string
  hideLabel: string
  disabled?: boolean
  invalid?: boolean
  className?: string
}

export function PasswordInput({
  value,
  onChange,
  label,
  showLabel,
  hideLabel,
  disabled = false,
  invalid = false,
  className,
}: PasswordInputProps) {
  const [revealed, setRevealed] = useState(false)
  const classes = ['cu-password-input', className].filter(Boolean).join(' ')

  return (
    <FieldPrimitive.Root
      className="cu-field"
      disabled={disabled}
      invalid={invalid}
    >
      <FieldPrimitive.Label className="cu-field__label">{label}</FieldPrimitive.Label>
      <div
        className={classes}
        data-ai-role="password-input" data-ai-intent="enter-text"
        data-ai-state={invalid ? 'invalid' : disabled ? 'disabled' : revealed ? 'revealed' : 'default'}
      >
        <FieldPrimitive.Input
          className="cu-input cu-password-input__field"
          type={revealed ? 'text' : 'password'}
          autoComplete="current-password"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
        <button
          type="button"
          className="cu-password-input__toggle"
          aria-label={revealed ? hideLabel : showLabel}
          aria-pressed={revealed}
          disabled={disabled}
          onClick={() => setRevealed((current) => !current)}
        >
          <span aria-hidden="true">{revealed ? '◡' : '◉'}</span>
        </button>
      </div>
    </FieldPrimitive.Root>
  )
}
