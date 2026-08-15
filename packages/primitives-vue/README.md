# @chameleon-ui/primitives-vue

**L1 · Headless / a11y 基元封装（Vue）。基于 Ark UI / Zag。**

Vue 侧的 headless 内核层：薄封装 `@ark-ui/vue`（Ark UI / Zag 工厂）。`@chameleon-ui/components-vue` 只依赖本包，**禁止**直接 `import "@ark-ui/*"`。

## 当前基元

`ButtonPrimitive` · `InputPrimitive` · `CheckboxPrimitive` · `SwitchPrimitive` · `RadioGroupPrimitive` · `FieldPrimitive` · `SelectPrimitive` · `DialogPrimitive` · `PopoverPrimitive` · `TooltipPrimitive` · `TabsPrimitive`

## 职责边界

- **只封装** Ark UI / Zag 行为；焦点陷阱、Escape 关闭、触发还原都委托给 Zag。
- 不要在 `components-vue` 里重写这些逻辑或直接引用 `@ark-ui/*`。

## 用法

```vue
<script setup lang="ts">
import { ButtonPrimitive } from '@chameleon-ui/primitives-vue'
</script>

<template>
  <ButtonPrimitive>Action</ButtonPrimitive>
</template>
```

## 测试

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/primitives-vue test
```
