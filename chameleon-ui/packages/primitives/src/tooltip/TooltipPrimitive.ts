import { Tooltip } from '@ark-ui/react/tooltip'
import type { ComponentProps } from 'react'

/**
 * Thin Tooltip primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/react/tooltip`.
 */
export const TooltipPrimitive = {
  Root: Tooltip.Root,
  Trigger: Tooltip.Trigger,
  Positioner: Tooltip.Positioner,
  Content: Tooltip.Content,
  Arrow: Tooltip.Arrow,
}

export type TooltipPrimitiveRootProps = ComponentProps<typeof Tooltip.Root>
