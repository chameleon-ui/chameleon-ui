import type { Component } from 'vue'
import { createListCollection, Select } from '@ark-ui/vue/select'

/**
 * Thin Select primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/vue/select`.
 */
export const SelectPrimitive: {
  Root: Component
  Trigger: Component
  ValueText: Component
  ClearTrigger: Component
  Indicator: Component
  Control: Component
  Positioner: Component
  Content: Component
  List: Component
  Item: Component
  ItemText: Component
  ItemIndicator: Component
  ItemGroup: Component
  ItemGroupLabel: Component
  Label: Component
  HiddenSelect: Component
  createListCollection: typeof createListCollection
} = {
  Root: Select.Root,
  Trigger: Select.Trigger,
  ValueText: Select.ValueText,
  ClearTrigger: Select.ClearTrigger,
  Indicator: Select.Indicator,
  Control: Select.Control,
  Positioner: Select.Positioner,
  Content: Select.Content,
  List: Select.List,
  Item: Select.Item,
  ItemText: Select.ItemText,
  ItemIndicator: Select.ItemIndicator,
  ItemGroup: Select.ItemGroup,
  ItemGroupLabel: Select.ItemGroupLabel,
  Label: Select.Label,
  HiddenSelect: Select.HiddenSelect,
  createListCollection,
}
