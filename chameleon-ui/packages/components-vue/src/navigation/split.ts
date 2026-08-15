export interface NavigationItem {
  value: string
  label: string
}

export interface NavigationProps {
  label: string
  items: NavigationItem[]
  activeValue?: string
  defaultValue?: string
  maxCompactItems?: number
  moreLabel?: string
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  expandLabel?: string
  collapseLabel?: string
  class?: string
}

const MAX_COMPACT_PINS = 4

export function splitNavigationItems(items: NavigationItem[], maxCompactItems = MAX_COMPACT_PINS) {
  const cap = Math.min(Math.max(maxCompactItems, 1), MAX_COMPACT_PINS)
  if (items.length <= cap) return { compact: items, overflow: [] as NavigationItem[] }
  return { compact: items.slice(0, cap), overflow: items.slice(cap) }
}
