import { TabsPrimitive } from '@chameleon-ui/primitives'
import type { ReactNode } from 'react'
import './styles.css'

export interface TabBarItem {
  value: string
  label: ReactNode
}

export interface TabBarProps {
  /** Accessible name of the navigation landmark. */
  label: string
  items: TabBarItem[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function TabBar({ label, items, defaultValue, value, onChange, className }: TabBarProps) {
  const classes = ['cu-tab-bar', className].filter(Boolean).join(' ')
  const active = value ?? defaultValue ?? items[0]?.value ?? 'default'

  return (
    <TabsPrimitive.Root
      className={classes}
      data-ai-role="tab-bar"
      data-ai-intent="navigate-sections"
      data-ai-state={active}
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={(details) => onChange?.(details.value)}
    >
      <TabsPrimitive.List className="cu-tab-bar__list" aria-label={label}>
        {items.map((item) => (
          <TabsPrimitive.Trigger key={item.value} className="cu-tab-bar__item" value={item.value}>
            <span className="cu-tab-bar__label">{item.label}</span>
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}
