# @chameleon-ui/components-vue

**L2 · Vue 组件实现（catalog 103/103 + ThemeProvider）。**

Vue 侧的完整组件实现，与 React 主包（@chameleon-ui/components）**catalog 对齐 103/103**。React 包仍是契约 SSOT；本包按同契约移植。

## 覆盖

- Catalog Vue 覆盖 **103/103**；`ThemeProvider` 是额外出口（非 catalog slug）。
- Per-slug 引入：`import { Button } from '@chameleon-ui/components-vue/button'`
- SchemaRenderer 默认 map 为 10 slugs：`@chameleon-ui/schema-renderer/vue`

## 规则

- **只 import** `@chameleon-ui/primitives-vue`、`@chameleon-ui/tokens`、`@chameleon-ui/i18n`；**永不** `@ark-ui/*`。
- **CSS**：消费者主题用 `@chameleon-ui/themes/<id>/css`（默认 `line`）。包 CSS 是 barrel 与 `@chameleon-ui/components-vue/css` 的副作用。
- **data-ai-***：根元素设 `data-ai-role` / `data-ai-state`；交互组件设 `data-ai-intent`。

## 用法

```vue
<script setup lang="ts">
import { AppShell, Button, Navigation, NavigationBar, ThemeProvider } from '@chameleon-ui/components-vue'
import '@chameleon-ui/themes/line/css'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
</script>
```

## 外部接入

官方模板：`templates/external-vite-vue`。本地链接（仓库根）：`node ../scripts/link-external.mjs --vue --apply`。**不要**在工作区外写 `workspace:*`。
