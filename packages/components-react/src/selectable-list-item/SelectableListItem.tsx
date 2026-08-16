import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import './styles.css'

export interface SelectableListItemProps {
  selected?: boolean
  disabled?: boolean
  onSelect?: () => void
  leading?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

export function SelectableListItem({
  selected = false,
  disabled = false,
  onSelect,
  leading,
  meta,
  actions,
  children,
  className,
}: SelectableListItemProps) {
  const classes = ['cu-selectable-list-item', className].filter(Boolean).join(' ')

  const activate = () => {
    if (disabled) return
    onSelect?.()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate()
    }
  }

  const onActionsClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div
      className={classes}
      role="option"
      tabIndex={disabled ? -1 : 0}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-selected={selected ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-ai-role="selectable-list-item"
      data-ai-intent="select-single"
      data-ai-state={disabled ? 'disabled' : selected ? 'selected' : 'default'}
      onClick={activate}
      onKeyDown={onKeyDown}
    >
      <div className="cu-selectable-list-item__row">
        {leading ? <div className="cu-selectable-list-item__leading">{leading}</div> : null}
        <div className="cu-selectable-list-item__body">
          {children}
          {meta ? <div className="cu-selectable-list-item__meta">{meta}</div> : null}
        </div>
      </div>
      {actions ? (
        <div className="cu-selectable-list-item__actions" onClick={onActionsClick}>
          {actions}
        </div>
      ) : null}
    </div>
  )
}
