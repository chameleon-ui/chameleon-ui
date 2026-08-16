import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import './styles.css'

export interface MediaThumbItem {
  id: string
  src: string
  label: string
  alt?: string
}

export interface MediaThumbGridProps {
  items: MediaThumbItem[]
  selectedIds?: string[]
  defaultSelectedIds?: string[]
  onSelectedIdsChange?: (ids: string[]) => void
  minThumbSize?: string
  selectable?: boolean
  disabled?: boolean
  errorLabel?: string
  className?: string
  children?: ReactNode
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]
}

function ThumbMedia({
  src,
  alt,
  errorLabel,
}: {
  src: string
  alt: string
  errorLabel: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="cu-media-thumb-grid__fallback" role="img" aria-label={alt}>
        {errorLabel}
      </div>
    )
  }
  return (
    <img
      className="cu-media-thumb-grid__media"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

export function MediaThumbGrid({
  items,
  selectedIds,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  minThumbSize = '8.75rem',
  selectable = true,
  disabled = false,
  errorLabel = 'Image failed to load',
  className,
}: MediaThumbGridProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultSelectedIds)
  const selected = selectedIds ?? uncontrolled
  const classes = ['cu-media-thumb-grid', className].filter(Boolean).join(' ')
  const style = {
    ['--cu-media-thumb-min' as string]: minThumbSize,
  } satisfies CSSProperties

  const setSelected = (next: string[]) => {
    if (selectedIds === undefined) setUncontrolled(next)
    onSelectedIdsChange?.(next)
  }

  const activate = (id: string) => {
    if (!selectable || disabled) return
    setSelected(toggleId(selected, id))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate(id)
    }
  }

  return (
    <div
      className={classes}
      role="group"
      data-ai-role="media-thumb-grid"
      data-ai-intent="toggle-option"
      data-ai-state={disabled ? 'disabled' : 'default'}
      style={style}
    >
      {items.map((item) => {
        const isSelected = selected.includes(item.id)
        return (
          <button
            key={item.id}
            type="button"
            className="cu-media-thumb-grid__item"
            data-selected={isSelected ? 'true' : 'false'}
            data-disabled={disabled || !selectable ? 'true' : 'false'}
            aria-pressed={selectable ? isSelected : undefined}
            disabled={disabled || !selectable}
            onClick={() => activate(item.id)}
            onKeyDown={(event) => onKeyDown(event, item.id)}
          >
            <ThumbMedia src={item.src} alt={item.alt ?? item.label} errorLabel={errorLabel} />
            <span className="cu-media-thumb-grid__label">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
