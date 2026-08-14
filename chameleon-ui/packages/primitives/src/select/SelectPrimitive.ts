import { createListCollection } from '@ark-ui/react/collection'
import { Select } from '@ark-ui/react/select'

/**
 * Thin Select primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/react/select`.
 */
export const SelectPrimitive = {
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

export type SelectPrimitiveRootProps = Parameters<typeof Select.Root>[0]
