import './styles.css'

export interface StepItem {
  value: string
  label: string
  description?: string
}

export type StepsStatus = 'start' | 'in-progress' | 'complete'

function statusFor(currentIndex: number, lastIndex: number): StepsStatus {
  if (currentIndex <= 0) return 'start'
  if (currentIndex >= lastIndex) return 'complete'
  return 'in-progress'
}

export interface StepsProps {
  items: StepItem[]
  currentValue: string
  onSelect?: (value: string) => void
  label: string
  className?: string
}

export function Steps({ items, currentValue, onSelect, label, className }: StepsProps) {
  const classes = ['cu-steps', className].filter(Boolean).join(' ')
  const currentIndex = items.findIndex((item) => item.value === currentValue)
  const state = statusFor(currentIndex, Math.max(0, items.length - 1))

  return (
    <nav className={classes} aria-label={label} data-ai-role="steps" data-ai-intent="enumerate-items" data-ai-state={state}>
      <ol className="cu-steps__list">
        {items.map((item, index) => {
          const status = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
          const content = (
            <>
              <span className="cu-steps__index" aria-hidden="true">
                {index + 1}
              </span>
              <span className="cu-steps__copy">
                <span className="cu-steps__label">{item.label}</span>
                {item.description ? <span className="cu-steps__description">{item.description}</span> : null}
              </span>
            </>
          )
          return (
            <li key={item.value} className={'cu-steps__item cu-steps__item--' + status} data-status={status}>
              {onSelect ? (
                <button
                  type="button"
                  className="cu-steps__button"
                  aria-current={status === 'current' ? 'step' : undefined}
                  onClick={() => onSelect(item.value)}
                >
                  {content}
                </button>
              ) : (
                <div className="cu-steps__static" aria-current={status === 'current' ? 'step' : undefined}>
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
