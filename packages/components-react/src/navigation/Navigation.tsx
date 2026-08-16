import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import './styles.css'

export interface NavigationItem {
  value: string
  label: ReactNode
}

export interface NavigationProps {
  /** Accessible name of the navigation landmark. */
  label: string
  items: NavigationItem[]
  /** Sidebar brand chrome. Official child: TitleBar. Hidden on compact TabBar. */
  header?: ReactNode
  /**
   * Sidebar foot chrome. Official child: NavAccountCard (account + logout).
   * Hidden on compact TabBar. When set, the collapse toggle is not rendered.
   */
  footer?: ReactNode
  activeValue?: string
  defaultValue?: string
  onSelect?: (value: string) => void
  /**
   * How many destinations stay in the compact tab bar. Extra items go behind
   * More on compact and list in full in the sidebar form. Capped at 4 so the
   * bar never exceeds four pins + More.
   */
  maxCompactItems?: number
  moreLabel?: string
  /**
   * Render the tablet collapse toggle (hidden by CSS on compact and desktop).
   * Ignored when `footer` is set — account logout owns the foot chrome.
   */
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  expandLabel?: string
  collapseLabel?: string
  className?: string
}

const MAX_COMPACT_PINS = 4

export function splitNavigationItems(items: NavigationItem[], maxCompactItems = MAX_COMPACT_PINS) {
  const cap = Math.min(Math.max(maxCompactItems, 1), MAX_COMPACT_PINS)
  if (items.length <= cap) return { compact: items, overflow: [] as NavigationItem[] }
  return { compact: items.slice(0, cap), overflow: items.slice(cap) }
}

export function Navigation({
  label,
  items,
  header,
  footer,
  activeValue,
  defaultValue,
  onSelect,
  maxCompactItems = MAX_COMPACT_PINS,
  moreLabel = 'More',
  collapsible = true,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  expandLabel = 'Expand navigation',
  collapseLabel = 'Collapse navigation',
  className,
}: NavigationProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const [internalActive, setInternalActive] = useState(defaultValue ?? items[0]?.value)
  const [moreOpen, setMoreOpen] = useState(false)
  const isCollapsed = collapsed ?? internalCollapsed
  const current = activeValue ?? internalActive
  const { compact, overflow } = splitNavigationItems(items, maxCompactItems)
  const overflowActive = overflow.some((item) => item.value === current)
  const listId = useId()
  const overflowId = useId()
  const showToggle = collapsible && !footer

  function requestCollapsedChange(next: boolean) {
    if (collapsed === undefined) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  function select(value: string) {
    if (activeValue === undefined) setInternalActive(value)
    onSelect?.(value)
    setMoreOpen(false)
  }

  const classes = ['cu-navigation', isCollapsed && 'cu-navigation--collapsed', className]
    .filter(Boolean)
    .join(' ')

  function renderItem(item: NavigationItem) {
    return (
      <li key={item.value} className="cu-navigation__entry">
        <button
          type="button"
          className="cu-navigation__item"
          aria-current={current === item.value ? 'page' : undefined}
          aria-label={typeof item.label === 'string' ? item.label : undefined}
          onClick={() => select(item.value)}
        >
          <span className="cu-navigation__label">{item.label}</span>
        </button>
      </li>
    )
  }

  return (
    <nav
      className={classes}
      aria-label={label}
      data-ai-role="navigation"
      data-ai-intent="navigate-sections"
      data-ai-state={isCollapsed ? 'collapsed' : 'expanded'}
      data-more={moreOpen ? 'open' : 'closed'}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setMoreOpen(false)
      }}
    >
      <div className="cu-navigation__frame">
        {header ? <div className="cu-navigation__header">{header}</div> : null}
        <ul id={listId} className="cu-navigation__list">
          {compact.map(renderItem)}
          {overflow.length > 0 ? (
            <li className="cu-navigation__overflow">
              <ul id={overflowId} className="cu-navigation__overflow-list">
                {overflow.map(renderItem)}
              </ul>
            </li>
          ) : null}
          {overflow.length > 0 ? (
            <li className="cu-navigation__entry cu-navigation__entry--more">
              <button
                type="button"
                className="cu-navigation__item"
                aria-expanded={moreOpen}
                aria-controls={overflowId}
                aria-current={overflowActive ? 'page' : undefined}
                onClick={() => setMoreOpen((open) => !open)}
              >
                <span className="cu-navigation__label">{moreLabel}</span>
              </button>
            </li>
          ) : null}
        </ul>
        {footer ? <div className="cu-navigation__footer">{footer}</div> : null}
        {showToggle ? (
          <button
            type="button"
            className="cu-navigation__toggle"
            aria-expanded={!isCollapsed}
            aria-controls={listId}
            aria-label={isCollapsed ? expandLabel : collapseLabel}
            onClick={() => requestCollapsedChange(!isCollapsed)}
          >
            <span
              aria-hidden="true"
              className="cu-navigation__toggle-icon"
              data-direction={isCollapsed ? 'expand' : 'collapse'}
            >
              <svg viewBox="0 0 24 24" className="cu-navigation__toggle-svg">
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
            <span className="cu-navigation__label">{isCollapsed ? expandLabel : collapseLabel}</span>
          </button>
        ) : null}
      </div>
    </nav>
  )
}
