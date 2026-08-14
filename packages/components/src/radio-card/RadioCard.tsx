import { RadioGroupPrimitive } from '@chameleon-ui/primitives'
import './styles.css'

export interface RadioCardProps {
  options: string[]
  value?: string
  onChange: (value: string) => void
  name: string
  className?: string
}

export function RadioCard({ options, value = '', onChange, name, className }: RadioCardProps) {
  const classes = ['cu-radio-card', className].filter(Boolean).join(' ')
  return (
    <RadioGroupPrimitive.Root
      className={classes}
      data-ai-role="radio-card" data-ai-intent="select-single"
      data-ai-state={value ? 'checked' : 'unchecked'}
      name={name}
      value={value}
      onValueChange={(details) => onChange(details.value ?? '')}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item className="cu-radio-card__item" key={option} value={option}>
          <RadioGroupPrimitive.ItemControl className="cu-radio-card__control" />
          <RadioGroupPrimitive.ItemText className="cu-radio-card__text">{option}</RadioGroupPrimitive.ItemText>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}
