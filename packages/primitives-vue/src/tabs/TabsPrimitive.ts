import { Tabs } from '@ark-ui/vue/tabs'

/**
 * Thin Tabs primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/vue/tabs`.
 */
export const TabsPrimitive = {
  Root: Tabs.Root,
  List: Tabs.List,
  Trigger: Tabs.Trigger,
  Content: Tabs.Content,
  Indicator: Tabs.Indicator,
}

export type TabsPrimitiveRootProps = InstanceType<typeof Tabs.Root>['$props']
