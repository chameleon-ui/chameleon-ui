import { Field } from '@ark-ui/react/field'

/**
 * Thin Field / Input / Textarea primitives from Ark UI.
 * Components assemble these; they must not import `@ark-ui/react/field`.
 */
export const FieldPrimitive = {
  Root: Field.Root,
  Label: Field.Label,
  Input: Field.Input,
  Textarea: Field.Textarea,
  ErrorText: Field.ErrorText,
}

export const InputPrimitive = Field.Input
