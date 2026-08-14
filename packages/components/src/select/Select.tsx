import { SelectPrimitive } from '@chameleon-ui/primitives'
import { useMemo } from 'react'
import './styles.css'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  disabled = false,
  className,
}: SelectProps) {
  const collection = useMemo(() => SelectPrimitive.createListCollection({ items: options }), [options])
  const classes = ['cu-select', className].filter(Boolean).join(' ')

  return (
    <SelectPrimitive.Root
      className={classes}
      collection={collection}
      data-ai-role="select" data-ai-intent="choose-option"
      data-ai-state={disabled ? 'disabled' : 'default'}
      disabled={disabled}
      value={[value]}
      onValueChange={(details) => onChange(details.value[0] ?? '')}
    >
      <SelectPrimitive.Label className="cu-select__label">{label}</SelectPrimitive.Label>
      <SelectPrimitive.Control>
        <SelectPrimitive.Trigger className="cu-select__trigger">
          <SelectPrimitive.ValueText placeholder={placeholder} />
          <SelectPrimitive.Indicator className="cu-select__indicator">▼</SelectPrimitive.Indicator>
        </SelectPrimitive.Trigger>
      </SelectPrimitive.Control>
      <SelectPrimitive.Positioner className="cu-select__positioner">
        <SelectPrimitive.Content className="cu-select__content">
          <SelectPrimitive.List className="cu-select__list">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                className="cu-select__item"
                item={option}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="cu-select__item-indicator">✓</SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.List>
        </SelectPrimitive.Content>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Root>
  )
}
