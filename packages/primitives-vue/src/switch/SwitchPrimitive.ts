import { Switch } from '@ark-ui/vue/switch'

/**
 * Thin Switch primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/vue/switch`.
 */
export const SwitchPrimitive = {
  Root: Switch.Root,
  Label: Switch.Label,
  Control: Switch.Control,
  Thumb: Switch.Thumb,
  HiddenInput: Switch.HiddenInput,
}

export type SwitchPrimitiveRootProps = InstanceType<typeof Switch.Root>['$props']
