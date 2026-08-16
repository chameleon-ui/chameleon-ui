# 消费者 Agent 引导

把下面的规则块原样粘贴进消费者应用（Cursor Rule、`AGENTS.md` 或开场 prompt）。

完整规则以 [`../AGENTS.md`](../AGENTS.md) 为准，组合说明见 [`agent-consume.md`](./agent-consume.md)。

规则块保持英文：它面向消费者侧的 AI agent，与 AGENTS.md 同语言，避免规则在翻译中失真。

## Cursor Rule / 开场 prompt（复制）

```
This app consumes Chameleon UI only.

1. Pick one umbrella: @chameleon-ui/react OR @chameleon-ui/vue. Never both.
2. Import umbrella CSS in the app entry:
   - React: import "@chameleon-ui/react/css"  (real file: dist/css.css — tokens + density + linear + components)
   - Vue: import "@chameleon-ui/vue/css"  (real file: dist/css.css — tokens + density + linear + components)
3. Wrap the root in <ThemeProvider theme="linear" locale="zh-CN"> (or the locale the user asked for).
4. If MCP chameleon-ui is attached: call get_started first, then get_import_specifiers before any import.
5. Prefer search_components with intent; browse with list_components; get_contract before emitting JSX/SFC.
6. Never invent CSS paths. Never write workspace:*. Never import .../variables.css (not exported).
7. Do not substitute Tailwind or other UI kits for Chameleon theme CSS.
```

## 正确入口（React）

```tsx
import "@chameleon-ui/react/css";
import { ThemeProvider, Button } from "@chameleon-ui/react";

export function Root() {
  return (
    <ThemeProvider theme="linear" locale="zh-CN">
      <Button>OK</Button>
    </ThemeProvider>
  );
}
```

## 正确入口（Vue）

```ts
import { createApp } from "vue";
import "@chameleon-ui/vue/css";
import App from "./App.vue";

createApp(App).mount("#app");
```

```vue
<script setup lang="ts">
import { ThemeProvider, Button } from "@chameleon-ui/vue";
</script>

<template>
  <ThemeProvider theme="linear" locale="zh-CN">
    <Button>OK</Button>
  </ThemeProvider>
</template>
```

官方模板（已接好线）：`templates/external-vite-react` · `templates/external-vite-vue`。

## MCP 挂载（可选）

仅当消费者挂载 Chameleon MCP server 时需要。在本库检出中构建一次，然后用相对路径指向 `packages/mcp-server/dist/index.js`。配置片段与工具清单见 [`agent-consume.md`](./agent-consume.md) 和 [`packages/mcp-server/README.md`](../../packages/mcp-server/README.md)。

包版本 `0.4.0`，未上 npm，发布前 `npx @chameleon-ui/mcp-server` 不可用。
