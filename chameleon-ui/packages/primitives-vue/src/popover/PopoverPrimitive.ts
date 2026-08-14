import { Popover } from '@ark-ui/vue/popover'

/**
 * Thin Popover primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/vue/popover`.
 */
export const PopoverPrimitive = {
  Root: Popover.Root,
  Trigger: Popover.Trigger,
  Anchor: Popover.Anchor,
  Positioner: Popover.Positioner,
  Content: Popover.Content,
  Title: Popover.Title,
  Description: Popover.Description,
  CloseTrigger: Popover.CloseTrigger,
  Arrow: Popover.Arrow,
}

export type PopoverPrimitiveRootProps = InstanceType<typeof Popover.Root>['$props']
