import { Tabs } from '@ark-ui/react/tabs'
import type { ComponentProps } from 'react'

/**
 * Thin Tabs primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/react/tabs`.
 */
export const TabsPrimitive = {
  Root: Tabs.Root,
  List: Tabs.List,
  Trigger: Tabs.Trigger,
  Content: Tabs.Content,
  Indicator: Tabs.Indicator,
}

export type TabsPrimitiveRootProps = ComponentProps<typeof Tabs.Root>
