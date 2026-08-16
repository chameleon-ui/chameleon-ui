import { RadioGroupPrimitive } from '@chameleon-ui/primitives'
import './styles.css'

export interface RadioOption {
  value: string
  label: string
}

export interface RadioProps {
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  label: string
  name?: string
  disabled?: boolean
  className?: string
}

export function Radio({ value, onChange, options, label, name, disabled = false, className }: RadioProps) {
  const classes = ['cu-radio', className].filter(Boolean).join(' ')

  return (
    <RadioGroupPrimitive.Root
      className={classes}
      data-ai-role="radio" data-ai-intent="select-single"
      data-ai-state={disabled ? 'disabled' : 'default'}
      disabled={disabled}
      name={name}
      onValueChange={(details) => onChange(details.value ?? '')}
      value={value}
    >
      <RadioGroupPrimitive.Label className="cu-radio__label">{label}</RadioGroupPrimitive.Label>
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          className="cu-radio__item"
          value={option.value}
        >
          <RadioGroupPrimitive.ItemControl className="cu-radio__control">
            <RadioGroupPrimitive.Indicator className="cu-radio__indicator">●</RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.ItemControl>
          <RadioGroupPrimitive.ItemText className="cu-radio__text">{option.label}</RadioGroupPrimitive.ItemText>
          <RadioGroupPrimitive.ItemHiddenInput />
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}
