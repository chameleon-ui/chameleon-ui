import { Tooltip } from '@ark-ui/vue/tooltip'

/**
 * Thin Tooltip primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/vue/tooltip`.
 */
export const TooltipPrimitive = {
  Root: Tooltip.Root,
  Trigger: Tooltip.Trigger,
  Positioner: Tooltip.Positioner,
  Content: Tooltip.Content,
  Arrow: Tooltip.Arrow,
}

export type TooltipPrimitiveRootProps = InstanceType<typeof Tooltip.Root>['$props']
