import { Popover } from '@ark-ui/react/popover'
import type { ComponentProps } from 'react'

/**
 * Thin Popover primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/react/popover`.
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

export type PopoverPrimitiveRootProps = ComponentProps<typeof Popover.Root>
