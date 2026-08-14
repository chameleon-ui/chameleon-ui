import { useId, useState } from 'react'
import './styles.css'

export interface CommandItem {
  value: string
  label: string
  shortcut?: string
  group?: string
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  commands: CommandItem[]
  query?: string
  onQueryChange?: (query: string) => void
  onSelect: (value: string) => void
  label: string
  placeholder?: string
  emptyLabel?: string
  closeLabel?: string
  className?: string
}

/**
 * Filters then stably sorts commands for the palette list.
 *
 * @complexity time O(n log n) | space O(n) | n = command count
 * @guarantees default order is localeCompare('en') on label then value — reproducible
 */
export function filterCommands(commands: CommandItem[], query: string): CommandItem[] {
  const needle = query.trim().toLowerCase()
  const matched =
    needle.length === 0
      ? commands
      : commands.filter(
          (command) =>
            command.label.toLowerCase().includes(needle) ||
            command.value.toLowerCase().includes(needle),
        )
  return [...matched].sort((left, right) => {
    const byLabel = left.label.localeCompare(right.label, 'en')
    if (byLabel !== 0) return byLabel
    return left.value.localeCompare(right.value, 'en')
  })
}

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  query,
  onQueryChange,
  onSelect,
  label,
  placeholder = 'Type a command',
  emptyLabel = 'No commands',
  closeLabel = 'Close',
  className,
}: CommandPaletteProps) {
  const listId = useId()
  const [internalQuery, setInternalQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const currentQuery = query ?? internalQuery
  const visible = filterCommands(commands, currentQuery)
  const classes = ['cu-command-palette', className].filter(Boolean).join(' ')
  const aiState = open ? (currentQuery.trim().length > 0 ? 'filtered' : 'open') : 'closed'

  function setQuery(next: string) {
    if (query === undefined) setInternalQuery(next)
    onQueryChange?.(next)
    setActiveIndex(0)
  }

  function selectValue(value: string) {
    onSelect(value)
    onOpenChange?.(false)
  }

  if (!open) {
    return (
      <div
        className={classes}
        data-ai-role="command-palette"
        data-ai-intent="choose-action"
        data-ai-state="closed"
        hidden
      />
    )
  }

  const active = visible[activeIndex]
  const activeId = active ? `${listId}-${active.value}` : undefined

  return (
    <div
      className={classes}
      data-ai-role="command-palette"
      data-ai-intent="choose-action"
      data-ai-state={aiState}
    >
      <div className="cu-command-palette__backdrop" />
      <div className="cu-command-palette__positioner">
        <div
          className="cu-command-palette__content"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <div className="cu-command-palette__toolbar">
            <label className="cu-command-palette__field">
              <span className="cu-command-palette__field-text">{label}</span>
              <input
                className="cu-command-palette__input"
                type="search"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                value={currentQuery}
                placeholder={placeholder}
                onChange={(event) => setQuery(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setActiveIndex((index) => (visible.length === 0 ? 0 : (index + 1) % visible.length))
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    setActiveIndex((index) =>
                      visible.length === 0 ? 0 : (index - 1 + visible.length) % visible.length,
                    )
                  } else if (event.key === 'Enter') {
                    event.preventDefault()
                    if (active) selectValue(active.value)
                  } else if (event.key === 'Escape') {
                    event.preventDefault()
                    onOpenChange?.(false)
                  }
                }}
              />
            </label>
            <button
              type="button"
              className="cu-command-palette__close"
              aria-label={closeLabel}
              onClick={() => onOpenChange?.(false)}
            >
              ×
            </button>
          </div>
          {visible.length === 0 ? (
            <p className="cu-command-palette__empty">{emptyLabel}</p>
          ) : (
            <ul className="cu-command-palette__list" role="listbox" id={listId}>
              {visible.map((command, index) => (
                <li
                  key={command.value}
                  id={`${listId}-${command.value}`}
                  className={
                    'cu-command-palette__option' +
                    (index === activeIndex ? ' cu-command-palette__option--active' : '')
                  }
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => selectValue(command.value)}
                >
                  <span className="cu-command-palette__option-label">{command.label}</span>
                  {command.shortcut ? (
                    <kbd className="cu-command-palette__shortcut">{command.shortcut}</kbd>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
