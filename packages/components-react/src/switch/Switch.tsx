import { SwitchPrimitive } from '@chameleon-ui/primitives'
import './styles.css'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
  className?: string
}

export function Switch({ checked, onChange, label, disabled = false, className }: SwitchProps) {
  const classes = ['cu-switch', className].filter(Boolean).join(' ')

  return (
    <SwitchPrimitive.Root
      checked={checked}
      className={classes}
      data-ai-role="switch" data-ai-intent="toggle-setting"
      data-ai-state={checked ? 'checked' : disabled ? 'disabled' : 'default'}
      disabled={disabled}
      onCheckedChange={(details) => onChange(!!details.checked)}
    >
      <SwitchPrimitive.Label className="cu-switch__label">{label}</SwitchPrimitive.Label>
      <SwitchPrimitive.Control className="cu-switch__control">
        <SwitchPrimitive.Thumb className="cu-switch__thumb" />
      </SwitchPrimitive.Control>
      <SwitchPrimitive.HiddenInput />
    </SwitchPrimitive.Root>
  )
}
