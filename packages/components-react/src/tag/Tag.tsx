import './styles.css'

export interface TagProps {
  label: string
  variant?: 'default' | 'brand' | 'outline'
  onRemove?: () => void
  removeLabel?: string
  className?: string
}

export function Tag({ label, variant = 'default', onRemove, removeLabel = 'Remove tag', className }: TagProps) {
  const classes = ['cu-tag', 'cu-tag--' + variant, className].filter(Boolean).join(' ')
  return (
    <span className={classes} data-ai-role="tag" data-ai-intent="filter-selection" data-ai-state={onRemove ? 'closable' : 'default'}>
      <span className="cu-tag__label">{label}</span>
      {onRemove ? (
        <button type="button" className="cu-tag__remove" aria-label={removeLabel} onClick={onRemove}>
          ×
        </button>
      ) : null}
    </span>
  )
}
