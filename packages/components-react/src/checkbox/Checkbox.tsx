import { CheckboxPrimitive } from '@chameleon-ui/primitives'
import './styles.css'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
  className?: string
}

export function Checkbox({ checked, onChange, label, disabled = false, className }: CheckboxProps) {
  const classes = ['cu-checkbox', className].filter(Boolean).join(' ')

  return (
    <CheckboxPrimitive.Root
      checked={checked}
      className={classes}
      data-ai-role="checkbox" data-ai-intent="toggle-option"
      data-ai-state={checked ? 'checked' : disabled ? 'disabled' : 'default'}
      disabled={disabled}
      onCheckedChange={(details) => onChange(!!details.checked)}
    >
      <CheckboxPrimitive.Control className="cu-checkbox__control">
        <CheckboxPrimitive.Indicator className="cu-checkbox__indicator">✓</CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
      <CheckboxPrimitive.Label className="cu-checkbox__label">{label}</CheckboxPrimitive.Label>
      <CheckboxPrimitive.HiddenInput />
    </CheckboxPrimitive.Root>
  )
}
