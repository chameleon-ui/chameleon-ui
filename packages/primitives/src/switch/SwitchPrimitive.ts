import { Switch } from '@ark-ui/react/switch'
import type { ComponentProps } from 'react'

/**
 * Thin Switch primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/react/switch`.
 */
export const SwitchPrimitive = {
  Root: Switch.Root,
  Label: Switch.Label,
  Control: Switch.Control,
  Thumb: Switch.Thumb,
  HiddenInput: Switch.HiddenInput,
}

export type SwitchPrimitiveRootProps = ComponentProps<typeof Switch.Root>
