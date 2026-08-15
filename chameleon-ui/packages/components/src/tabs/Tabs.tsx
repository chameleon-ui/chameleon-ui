import { TabsPrimitive } from '@chameleon-ui/primitives'
import type { ReactNode } from 'react'
import './styles.css'

export interface TabItem {
  value: string
  label: string
  content: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function Tabs({ items, defaultValue, value, onChange, className }: TabsProps) {
  const classes = ['cu-tabs', className].filter(Boolean).join(' ')

  return (
    <TabsPrimitive.Root
      className={classes}
      data-ai-role="tabs"
      data-ai-intent="switch-view"
      data-ai-state={value ?? defaultValue ?? items[0]?.value ?? 'default'}
      defaultValue={defaultValue}
      value={value}
      lazyMount={false}
      unmountOnExit={false}
      onValueChange={(details) => onChange?.(details.value)}
    >
      <TabsPrimitive.List className="cu-tabs__list">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            className="cu-tabs__trigger"
            value={item.value}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content key={item.value} className="cu-tabs__content" value={item.value}>
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
