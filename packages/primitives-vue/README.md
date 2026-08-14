# @chameleon-ui/primitives-vue

Vue headless primitives for Chameleon UI.

- **Scope**: thin wrappers around Ark UI / Zag factories for Vue (`@ark-ui/vue`).
- **Rule**: downstream packages (`@chameleon-ui/components-vue`) import **only** this package; they never import `@ark-ui/*` directly.
- **Current primitives**: `ButtonPrimitive`, `InputPrimitive`, `CheckboxPrimitive`, `SwitchPrimitive`, `RadioGroupPrimitive`, `FieldPrimitive`, `SelectPrimitive`, `DialogPrimitive`, `PopoverPrimitive`, `TooltipPrimitive`, `TabsPrimitive`.

## Usage

```vue
<script setup lang="ts">
import { ButtonPrimitive } from '@chameleon-ui/primitives-vue'
</script>

<template>
  <ButtonPrimitive>Action</ButtonPrimitive>
</template>
```
