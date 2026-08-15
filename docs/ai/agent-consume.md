# Agent consume specification

**Machine SSOT:** [`chameleon-ui/AGENTS.md`](../../chameleon-ui/AGENTS.md). Follow that file. This page is the attach and composition spec for an external consumer app.

Public docs (same rules, product tone): `chameleon-ui/apps/docs/docs/guides/for-agents.mdx`.

Do not invent CSS specifiers. Do not copy `workspace:*` into a consumer `package.json`. `bench.generation_quality` is honestly `null` without a generator — do not fabricate a score.

Do **not** invent theme recognition rates or imply 「一眼认出 ≥80%」. A9.5 is **PROTOCOL-READY** with `rate=null` (`docs/project/reports/A9.5-decision.json`). Do **not** claim VPAT / WCAG / 508 certification: artifact is `status=draft`, publication scope **published-internal**, **Not a third-party CAB**, commercial a11y claims **not allowed** (`docs/project/reports/Phase-9-VPAT-status.md`).

## Required order

1. Call MCP `get_import_specifiers` before any import.
2. CSS: `import "@chameleon-ui/themes/line/css"` for product chrome (visual flagship), or another homage id from `list_themes`. Never `.../cupertino/variables.css`.
3. Components: `import { Button, Card, Table } from "@chameleon-ui/components"`. Vue: `import { AppShell, Button, Navigation, ThemeProvider } from "@chameleon-ui/components-vue"` (catalog 103/103 + ThemeProvider).
4. Before emitting a component, call `get_contract` with that slug (v0.2 + `dataAi` triple).
5. Before choosing density / radius / RTL, call `get_design_rules` for the theme id.
6. The consumer app is **not** a pnpm workspace. **NEVER** write `workspace:*`. Link all five runtime packages of the chosen graph (React or Vue; see AGENTS.md).
7. Disk writes only via `chameleon add` / MCP `install_*` (install-core).
8. SchemaRenderer default map is 10 slugs. React: `@chameleon-ui/schema-renderer`. Vue: `@chameleon-ui/schema-renderer/vue`. For Table / Chart / KpiDashboard import `@chameleon-ui/components` or `@chameleon-ui/components-vue`.
9. `adapter-ag-ui` is POC. Do not treat it as supported.

## App chrome

Native model: tab controller + per-tab stack. Not website chrome.

| Role | Component | AppShell slot |
| :--- | :--- | :--- |
| Root destinations | `Navigation` | `navigation` |
| Stack (title, back) | `NavigationBar` | `header` |
| Site links | `Navbar` | not AppShell |

One `items` list; CSS morphs TabBar ↔ rail ↔ sidebar. Do not compose `Sidebar` + `TabBar`. Switching tabs does not push; back pops (`useTabStacks`). Compact overflow is four pins + More.

```tsx
import "@chameleon-ui/themes/line/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
import { AppShell, Navigation, NavigationBar } from "@chameleon-ui/components";
```

Vue: same CSS specifiers; JS from `@chameleon-ui/components-vue`. Slots `#header` / `#navigation`. Template: `templates/external-vite-vue`.

## MCP attach (Cursor)

In the **consumer** app, after building the server:

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
        "CU_TARGET_DIR": "D:/path/to/consumer-app"
      }
    }
  }
}
```

Replace both paths. `npx @chameleon-ui/mcp-server` is not available until npm publish (packages are `0.1.9`, still unpublished; use file: / link / pack-external tarballs).

## Tools the agent must use

| When | Tool |
| :--- | :--- |
| About to write `import` | `get_import_specifiers` |
| Need a component for an intent ("submit", "tabular data") | `search_components` with `intent` |
| About to emit JSX for a slug | `get_contract` |
| About to pick theme density / RTL | `get_design_rules` |
| List skins | `list_themes` |
| Scaffold files into `CU_TARGET_DIR` | `install_with_theme` (four-piece) |

Also on the server: `get_component` · `install_component` · `install_theme` · `install_bundle` · `telemetry_opt_out` · `record_intent`.

## External app install (unpublished)

```bash
cd chameleon-ui
node ./scripts/link-external.mjs --apply
# consumer:
npm link @chameleon-ui/tokens @chameleon-ui/i18n @chameleon-ui/primitives @chameleon-ui/themes @chameleon-ui/components
```

Official Vite + Windows templates: `chameleon-ui/templates/external-vite-react` and `chameleon-ui/templates/external-vite-vue`. Pin React `react@^19` / `@ark-ui/react@5.38.0`, or Vue `vue@^3.5` / `@ark-ui/vue@5.38.1`, plus FormatJS as in AGENTS.md. Height chain: `html, body, #root` (React) or `#app` (Vue) `{ block-size: 100% }`. Dual-track: package five vs `chameleon add` — docs `guides/consume.mdx`. Pre-registry: `node ./scripts/pack-external.mjs` (add `--vue`) is first-class; verify with `pnpm verify:external`.

Vue graph:

```bash
node ./scripts/link-external.mjs --vue --apply
npm link @chameleon-ui/tokens @chameleon-ui/i18n @chameleon-ui/primitives-vue @chameleon-ui/themes @chameleon-ui/components-vue
```

Copy-pasteable `App.tsx` that compiles outside this workspace:

```tsx
import "@chameleon-ui/themes/line/css";
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
