import { useRef } from 'react'
import '../input/styles.css'
import './styles.css'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  label: string
  placeholder?: string
  clearLabel?: string
  submitLabel?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  label,
  placeholder = 'Search',
  clearLabel = 'Clear',
  submitLabel = 'Submit search',
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const classes = ['cu-search-bar', className].filter(Boolean).join(' ')

  return (
    <form
      className={classes}
      role="search"
      aria-label={label}
      data-ai-role="search-bar" data-ai-intent="search-select"
      data-ai-state={value.length > 0 ? 'filled' : 'default'}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(value)
      }}
    >
      <label className="cu-search-bar__label">
        <span className="cu-search-bar__label-text">{label}</span>
        <input
          ref={inputRef}
          className="cu-input"
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && value.length > 0) {
              event.preventDefault()
              onChange('')
            }
          }}
        />
      </label>
      {value.length > 0 ? (
        <button
          type="button"
          className="cu-search-bar__clear"
          aria-label={clearLabel}
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
        >
          ×
        </button>
      ) : null}
      <button type="submit" className="cu-search-bar__submit" aria-label={submitLabel}>
        <span aria-hidden="true">⌕</span>
      </button>
    </form>
  )
}
