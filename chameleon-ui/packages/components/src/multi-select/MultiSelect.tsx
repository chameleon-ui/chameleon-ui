import { useId, useState } from 'react'
import './styles.css'

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  values: string[]
  onChange: (values: string[]) => void
  label: string
  selectedLabel?: string
  clearLabel?: string
  className?: string
}

export function MultiSelect({
  options,
  values,
  onChange,
  label,
  selectedLabel = 'selected',
  clearLabel = 'Clear all',
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const listboxId = useId()
  const classes = ['cu-multi-select', className].filter(Boolean).join(' ')

  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value])
  }

  const labelFor = (value: string) => options.find((option) => option.value === value)?.label ?? value

  return (
    <div className={classes} data-ai-role="multi-select" data-ai-intent="toggle-option" data-ai-state={open ? 'open' : values.length === 0 ? 'empty' : 'default'}>
      <span className="cu-multi-select__label" id={`${listboxId}-label`}>
        {label}
      </span>
      {values.length > 0 ? (
        <ul className="cu-multi-select__chips" aria-label={`${values.length} ${selectedLabel}`}>
          {values.map((value) => (
            <li key={value} className="cu-multi-select__chip">
              <span>{labelFor(value)}</span>
              <button
                type="button"
                className="cu-multi-select__chip-remove"
                aria-label={`${clearLabel}: ${labelFor(value)}`}
                onClick={() => toggle(value)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        className="cu-multi-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${listboxId}-label`}
        onClick={() => setOpen((current) => !current)}
      >
        {values.length > 0 ? `${values.length} ${selectedLabel}` : label}
        <span aria-hidden="true"> ▾</span>
      </button>
      {open ? (
        <ul
          className="cu-multi-select__listbox"
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={`${listboxId}-label`}
          id={listboxId}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false)
          }}
        >
          {options.map((option) => {
            const selected = values.includes(option.value)
            return (
              <li
                key={option.value}
                className="cu-multi-select__option"
                role="option"
                aria-selected={selected}
                tabIndex={0}
                onClick={() => toggle(option.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    toggle(option.value)
                  }
                }}
              >
                <span className="cu-multi-select__check" aria-hidden="true">
                  {selected ? '✓' : ''}
                </span>
                {option.label}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
