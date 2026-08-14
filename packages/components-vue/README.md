# @chameleon-ui/components-vue

Vue component subset for Chameleon UI Phase 6.

- **Scope**: Vue wrappers around `@chameleon-ui/primitives-vue` using the same tokens and CSS variable names as the React package.
- **Rule**: components import **only** `@chameleon-ui/primitives-vue` and `@chameleon-ui/tokens`; they never import `@ark-ui/*` directly.
- **Current components** (22): `Alert`, `Avatar`, `Badge`, `Button`, `Card`, `Checkbox`, `Dialog`, `Form`, `Grid`, `Input`, `Popover`, `Progress`, `Radio`, `Select`, `Spinner`, `Stack`, `Switch`, `Table`, `Tabs`, `Textarea`, `Toast`, `Tooltip`.
- **data-ai-***: every component root (or overlay content for Dialog / Popover / Tooltip) sets `data-ai-role` and `data-ai-state` to match the React catalog; interactive components also set `data-ai-intent`.

## Usage

```vue
<script setup lang="ts">
import { Button, Checkbox, Input } from '@chameleon-ui/components-vue'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
</script>

<template>
  <form @submit.prevent>
    <Input label="Project name" id="name" v-model="name" />
    <Checkbox label="Subscribe" v-model="subscribe" />
    <Button type="submit" intent="submit">Create</Button>
  </form>
</template>
```
