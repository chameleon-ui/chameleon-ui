import { FieldPrimitive } from '@chameleon-ui/primitives'
import './styles.css'

export interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  label: string
  min?: number
  max?: number
  className?: string
}

export function NumberInput({ value, onChange, label, min, max, className }: NumberInputProps) {
  const classes = ['cu-number-input', className].filter(Boolean).join(' ')
  return (
    <FieldPrimitive.Root className={classes} data-ai-role="number-input" data-ai-state="default" data-ai-intent="enter-quantity">
      <FieldPrimitive.Label className="cu-number-input__label">{label}</FieldPrimitive.Label>
      <FieldPrimitive.Input
        className="cu-number-input__input"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        type="number"
        value={value}
      />
    </FieldPrimitive.Root>
  )
}
