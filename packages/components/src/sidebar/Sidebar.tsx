import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import './styles.css'

export interface SidebarItem {
  value: string
  label: ReactNode
}

export interface SidebarProps {
  /** Accessible name of the navigation landmark. */
  label: string
  items: SidebarItem[]
  header?: ReactNode
  activeValue?: string
  onSelect?: (value: string) => void
  /** Show the collapse toggle (tablet pattern). */
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Toggle accessible name when collapsed. */
  expandLabel?: string
  /** Toggle accessible name when expanded. */
  collapseLabel?: string
  className?: string
}

export function Sidebar({
  label,
  items,
  header,
  activeValue,
  onSelect,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  expandLabel = 'Expand sidebar',
  collapseLabel = 'Collapse sidebar',
  className,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const isCollapsed = collapsed ?? internalCollapsed
  const navId = useId()

  function requestCollapsedChange(next: boolean) {
    if (collapsed === undefined) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  const classes = [
    'cu-sidebar',
    isCollapsed && 'cu-sidebar--collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside
      className={classes}
      aria-label={label}
      data-ai-role="sidebar"
      data-ai-intent="navigate-sections"
      data-ai-state={isCollapsed ? 'collapsed' : 'expanded'}
    >
      {header ? <div className="cu-sidebar__header">{header}</div> : null}
      <nav id={navId} className="cu-sidebar__nav" aria-label={label}>
        <ul className="cu-sidebar__list">
          {items.map((item) => (
            <li key={item.value} className="cu-sidebar__entry">
              <button
                type="button"
                className="cu-sidebar__item"
                aria-current={activeValue === item.value ? 'page' : undefined}
                aria-label={typeof item.label === 'string' ? item.label : undefined}
                onClick={() => onSelect?.(item.value)}
              >
                <span className="cu-sidebar__label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {collapsible ? (
        <button
          type="button"
          className="cu-sidebar__toggle"
          aria-expanded={!isCollapsed}
          aria-controls={navId}
          aria-label={isCollapsed ? expandLabel : collapseLabel}
          onClick={() => requestCollapsedChange(!isCollapsed)}
        >
          <span aria-hidden="true" className="cu-sidebar__toggle-icon" data-direction={isCollapsed ? 'expand' : 'collapse'}>
            <svg viewBox="0 0 24 24" className="cu-sidebar__toggle-svg">
              <path
                d={isCollapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </span>
          <span className="cu-sidebar__label">{isCollapsed ? expandLabel : collapseLabel}</span>
        </button>
      ) : null}
    </aside>
  )
}
