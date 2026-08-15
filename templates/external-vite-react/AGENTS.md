# AGENTS.md — this Vite template

You are editing an **external** Chameleon UI consumer (not the library monorepo).

Full SSOT: [`../../AGENTS.md`](../../AGENTS.md) (Start here in 60 seconds). Attach notes: [`../../docs/ai/agent-consume.md`](../../docs/ai/agent-consume.md). Bootstrap paste: [`../../docs/ai/consumer-agent-bootstrap.md`](../../docs/ai/consumer-agent-bootstrap.md).

## Must

1. MCP: call **`get_started`** first in the session, then **`get_import_specifiers`** before any import.
2. CSS in the app entry: `import "@chameleon-ui/react/css"`.
3. Root wrap: `<ThemeProvider theme="line" locale="zh-CN">` (see `src/main.tsx`).
4. Components only from `@chameleon-ui/react` (this template). Do not add `@chameleon-ui/vue`.
5. Never invent CSS paths, never `workspace:*`, never `.../variables.css`.

## Chrome

`AppShell` + `Navigation` + `NavigationBar` + `useTabStacks`. Do not compose `Sidebar` + `TabBar`.
