import { describe, expect, it } from 'vitest'
import {
  ButtonPrimitive,
  CheckboxPrimitive,
  DialogPrimitive,
  FieldPrimitive,
  InputPrimitive,
  PopoverPrimitive,
  RadioGroupPrimitive,
  SelectPrimitive,
  SwitchPrimitive,
  TabsPrimitive,
  TooltipPrimitive,
} from './index.js'

describe('primitives-vue', () => {
  it('exports Ark wrappers as defined components', () => {
    expect(ButtonPrimitive).toBeDefined()
    expect(InputPrimitive).toBeDefined()
    expect(CheckboxPrimitive.Root).toBeDefined()
    expect(SwitchPrimitive.Root).toBeDefined()
    expect(RadioGroupPrimitive.Root).toBeDefined()
    expect(FieldPrimitive.Textarea).toBeDefined()
    expect(SelectPrimitive.Root).toBeDefined()
    expect(SelectPrimitive.createListCollection).toBeTypeOf('function')
    expect(DialogPrimitive.Root).toBeDefined()
    expect(PopoverPrimitive.Root).toBeDefined()
    expect(TooltipPrimitive.Root).toBeDefined()
    expect(TabsPrimitive.Root).toBeDefined()
  })
})
