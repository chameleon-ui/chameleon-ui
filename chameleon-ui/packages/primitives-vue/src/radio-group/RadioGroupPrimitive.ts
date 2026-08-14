import { RadioGroup } from '@ark-ui/vue/radio-group'

/**
 * Thin RadioGroup primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/vue/radio-group`.
 */
export const RadioGroupPrimitive = {
  Root: RadioGroup.Root,
  Label: RadioGroup.Label,
  Item: RadioGroup.Item,
  ItemControl: RadioGroup.ItemControl,
  ItemHiddenInput: RadioGroup.ItemHiddenInput,
  ItemText: RadioGroup.ItemText,
  Indicator: RadioGroup.Indicator,
}

export type RadioGroupPrimitiveRootProps = InstanceType<typeof RadioGroup.Root>['$props']
