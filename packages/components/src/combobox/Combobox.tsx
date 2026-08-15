import { SelectPrimitive } from '@chameleon-ui/primitives'
import { useMemo } from 'react'
import './styles.css'

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  options: string[]
  /** Accessible name for the combobox control. */
  label: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Combobox({
  options,
  label,
  value = '',
  onChange,
  placeholder = 'Search or select',
  className,
}: ComboboxProps) {
  const items = useMemo(
    () => options.map((option) => ({ value: option, label: option })),
    [options],
  )
  const collection = useMemo(
    () => SelectPrimitive.createListCollection({ items }),
    [items],
  )
  const classes = ['cu-combobox', className].filter(Boolean).join(' ')

  return (
    <SelectPrimitive.Root
      className={classes}
      collection={collection}
      data-ai-role="combobox"
      data-ai-intent="search-select"
      data-ai-state={value ? 'closed' : 'open'}
      value={options.includes(value) ? [value] : []}
      onValueChange={(details) => onChange(details.value[0] ?? '')}
    >
      <SelectPrimitive.Label className="cu-combobox__label">{label}</SelectPrimitive.Label>
      <SelectPrimitive.Control className="cu-combobox__control">
        <SelectPrimitive.Trigger className="cu-combobox__trigger">
          <SelectPrimitive.ValueText placeholder={placeholder} />
        </SelectPrimitive.Trigger>
      </SelectPrimitive.Control>
      <SelectPrimitive.Positioner>
        <SelectPrimitive.Content className="cu-combobox__content">
          <SelectPrimitive.List>
            {items.map((option) => (
              <SelectPrimitive.Item className="cu-combobox__item" item={option} key={option.value}>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>✓</SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.List>
        </SelectPrimitive.Content>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Root>
  )
}
