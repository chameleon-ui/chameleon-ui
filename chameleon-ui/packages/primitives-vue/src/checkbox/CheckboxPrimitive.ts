import { Checkbox } from '@ark-ui/vue/checkbox'

/**
 * Thin Checkbox primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/vue/checkbox`.
 */
export const CheckboxPrimitive = {
  Root: Checkbox.Root,
  Label: Checkbox.Label,
  Control: Checkbox.Control,
  Indicator: Checkbox.Indicator,
  HiddenInput: Checkbox.HiddenInput,
  Group: Checkbox.Group,
}

export type CheckboxPrimitiveRootProps = InstanceType<typeof Checkbox.Root>['$props']
