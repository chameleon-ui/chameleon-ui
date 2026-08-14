# Agent consume guide

**SSOT:** [`chameleon-ui/AGENTS.md`](../../chameleon-ui/AGENTS.md). Follow that file. This page is how to **attach MCP** and prompt an agent in an external app (the stock-analyzer dogfood case).

Do not invent CSS specifiers. Do not copy `workspace:*` into a consumer `package.json`. `bench.generation_quality` is honestly `null` without a generator — do not fabricate a score.

## Prompt to paste into the consumer repo

```
You are building a React app that consumes @chameleon-ui/*.
Read chameleon-ui/AGENTS.md and obey it.

1. Call MCP get_import_specifiers before any import.
2. CSS: import "@chameleon-ui/themes/cupertino/css" (not .../cupertino/variables.css).
3. Components: import { Button, Card, Table } from "@chameleon-ui/components".
4. Before emitting a component, call get_contract with that slug (v0.2 + dataAi triple).
5. Before choosing density/radius/RTL, call get_design_rules for the theme id.
6. This app is NOT a pnpm workspace. NEVER write workspace:*. Link all five runtime packages (see AGENTS.md).
7. Disk writes only via chameleon add / MCP install_* (install-core).
8. SchemaRenderer default map is 10 slugs. For Table/Chart/KpiDashboard import the component package.
9. adapter-ag-ui is POC. Do not treat it as supported.
```

## MCP attach (Cursor)

In the **consumer** app (e.g. stock-analyzer), after building the server:

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server build
```

`.cursor/mcp.json` or Claude Code `.mcp.json`:

```json
{
  "mcpServers": {
    "chameleon-ui": {
      "command": "node",
      "args": ["D:/ChameleonUI/chameleon-ui/packages/mcp-server/dist/index.js"],
      "env": {
        "CU_TARGET_DIR": "D:/path/to/stock-analyzer"
      }
    }
  }
}
```

Replace both paths. `npx @chameleon-ui/mcp-server` is not available until npm publish (`v0.1.0`, not done).

## Tools the agent must use

| When | Tool |
| :--- | :--- |
| About to write `import` | `get_import_specifiers` |
| Need a component for an intent ("submit", "tabular data") | `search_components` with `intent` |
| About to emit JSX for a slug | `get_contract` |
| About to pick theme density / RTL | `get_design_rules` |
| List skins | `list_themes` |
| Scaffold files into `CU_TARGET_DIR` | `install_with_theme` (four-piece) |

## External app install (unpublished)

```bash
cd chameleon-ui
node ./scripts/link-external.mjs --apply
# consumer:
npm link @chameleon-ui/tokens @chameleon-ui/i18n @chameleon-ui/primitives @chameleon-ui/themes @chameleon-ui/components
```

Copy-pasteable `App.tsx` that compiles outside this workspace:

```tsx
import "@chameleon-ui/themes/cupertino/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
import { Alert, Button, Card } from "@chameleon-ui/components";

export function App() {
  return (
    <Card>
      <Alert status="info" title="Linked" description="Chameleon UI is on the graph." />
      <Button variant="solid">OK</Button>
    </Card>
  );
}
```

## SchemaRenderer

One-pager: [`schema-renderer.md`](./schema-renderer.md). Do not expand AG-UI POC to “supported”.
