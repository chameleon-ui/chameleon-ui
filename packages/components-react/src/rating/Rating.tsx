import './styles.css'

export interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  label: string
  starLabel?: string
  className?: string
}

export function Rating({ value, onChange, max = 5, label, starLabel = 'Star', className }: RatingProps) {
  const classes = ['cu-rating', className].filter(Boolean).join(' ')
  const readOnly = !onChange
  const stars = Array.from({ length: max }, (_, index) => index + 1)

  return (
    <div
      className={classes}
      role="radiogroup"
      aria-label={label}
      data-ai-role="rating" data-ai-intent="rate-item"
      data-ai-state={readOnly ? 'readonly' : 'default'}
    >
      {stars.map((star) => {
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            className={'cu-rating__star' + (filled ? ' cu-rating__star--filled' : '')}
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} ${starLabel}`}
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onKeyDown={(event) => {
              if (!onChange) return
              if (event.key === 'ArrowRight' || event.key === 'ArrowUp') onChange(Math.min(max, value + 1))
              if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') onChange(Math.max(0, value - 1))
            }}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                d="M8 1.5 10 6l4.9.4-3.7 3.2 1.1 4.8L8 12l-4.3 2.4 1.1-4.8L1.1 6.4 6 6Z"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
