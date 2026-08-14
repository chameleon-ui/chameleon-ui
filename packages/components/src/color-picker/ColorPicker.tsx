import { useState } from 'react'
import './styles.css'

export interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  swatches?: string[]
  label: string
  hexLabel?: string
  className?: string
}

/** Default selectable palette (data, not theme styling). */
const DEFAULT_SWATCHES = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0f766e', '#111827']

const HEX_PATTERN = /^#?[0-9a-fA-F]{6}$/

export function normalizeHex(input: string): string | null {
  const trimmed = input.trim()
  if (!HEX_PATTERN.test(trimmed)) return null
  return (trimmed.startsWith('#') ? trimmed : `#${trimmed}`).toLowerCase()
}

export function ColorPicker({ value, onChange, swatches = DEFAULT_SWATCHES, label, hexLabel = 'Hex value', className }: ColorPickerProps) {
  const [draft, setDraft] = useState(value)
  const [invalidHex, setInvalidHex] = useState(false)
  const classes = ['cu-color-picker', className].filter(Boolean).join(' ')

  const commitHex = () => {
    const normalized = normalizeHex(draft)
    if (normalized) {
      setInvalidHex(false)
      onChange(normalized)
    } else {
      setInvalidHex(true)
    }
  }

  return (
    <div className={classes} data-ai-role="color-picker" data-ai-intent="choose-option" data-ai-state="default">
      <div className="cu-color-picker__swatches" role="listbox" aria-label={label}>
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={
              'cu-color-picker__swatch' + (normalizeHex(value) === swatch ? ' cu-color-picker__swatch--selected' : '')
            }
            role="option"
            aria-selected={normalizeHex(value) === swatch}
            aria-label={swatch}
            style={{ background: swatch }}
            onClick={() => {
              setDraft(swatch)
              onChange(swatch)
            }}
          />
        ))}
      </div>
      <label className="cu-color-picker__hex">
        <span className="cu-color-picker__hex-label">{hexLabel}</span>
        <input
          className="cu-color-picker__input"
          type="text"
          value={draft}
          aria-invalid={invalidHex}
          onChange={(event) => {
            setDraft(event.currentTarget.value)
            setInvalidHex(false)
          }}
          onBlur={commitHex}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitHex()
          }}
        />
      </label>
    </div>
  )
}
