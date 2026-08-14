import { Checkbox } from '@ark-ui/react/checkbox'
import type { ComponentProps } from 'react'

/**
 * Thin Checkbox primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/react/checkbox`.
 */
export const CheckboxPrimitive = {
  Root: Checkbox.Root,
  Label: Checkbox.Label,
  Control: Checkbox.Control,
  Indicator: Checkbox.Indicator,
  HiddenInput: Checkbox.HiddenInput,
  Group: Checkbox.Group,
}

export type CheckboxPrimitiveRootProps = ComponentProps<typeof Checkbox.Root>
