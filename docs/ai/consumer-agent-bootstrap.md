# Consumer agent bootstrap

Paste the block below into a **consumer** app (Cursor Rule, `AGENTS.md`, or opening prompt).

Full SSOT: [`../AGENTS.md`](../AGENTS.md). Composition notes: [`agent-consume.md`](./agent-consume.md).

## Cursor Rule / opening prompt (copy)

```
This app consumes Chameleon UI only.

1. Pick one umbrella: @chameleon-ui/react OR @chameleon-ui/vue. Never both.
2. Import umbrella CSS in the app entry:
   - React: import "@chameleon-ui/react/css"
   - Vue: import "@chameleon-ui/vue/css"  (real file: dist/css.css — tokens + density + line + components)
3. Wrap the root in <ThemeProvider theme="line" locale="zh-CN"> (or the locale the user asked for).
4. If MCP chameleon-ui is attached: call get_started first, then get_import_specifiers before any import.
5. Prefer search_components with intent; browse with list_components; get_contract before emitting JSX/SFC.
6. Never invent CSS paths. Never write workspace:*. Never import .../variables.css (not exported).
7. Do not substitute Tailwind or other UI kits for Chameleon theme CSS.
```

## Correct entry (React)

```tsx
import "@chameleon-ui/react/css";
import { ThemeProvider, Button } from "@chameleon-ui/react";

export function Root() {
  return (
    <ThemeProvider theme="line" locale="zh-CN">
      <Button>OK</Button>
    </ThemeProvider>
  );
}
```

## Correct entry (Vue)

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
  <ThemeProvider theme="line" locale="zh-CN">
    <Button>OK</Button>
  </ThemeProvider>
</template>
```

Official templates (already wired): `templates/external-vite-react` · `templates/external-vite-vue`.

## MCP attach (optional)

Only needed when the consumer attaches the Chameleon MCP server. Build once from this library checkout, then point the consumer at `packages/mcp-server/dist/index.js` with a **relative** path. Snippet and tool list: [`agent-consume.md`](./agent-consume.md) · [`../../packages/mcp-server/README.md`](../../packages/mcp-server/README.md).

Packages are `0.2.0` and **not on npm** — `npx @chameleon-ui/mcp-server` is unavailable until publish.
