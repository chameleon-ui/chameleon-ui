# Agent consume — attach & composition

**SSOT:** [`../AGENTS.md`](../AGENTS.md). Follow that file for full rules. This page is the attach/composition spec for an **external consumer** app.

Paste-ready short rule: [`consumer-agent-bootstrap.md`](./consumer-agent-bootstrap.md).

Do not invent CSS specifiers. Do not copy `workspace:*` into a consumer `package.json`. Do not invent `generation_quality` scores, theme recognition rates, or accessibility certification.

## Required emit order

| Step | Action |
| :--- | :--- |
| 0 | Pick **one** umbrella (`@chameleon-ui/react` **or** `@chameleon-ui/vue`) |
| 1 | Import umbrella CSS: `@chameleon-ui/react/css` or `@chameleon-ui/vue/css` (Vue → real `dist/css.css`) |
| 2 | Wrap root in `<ThemeProvider theme="line" locale="…">` |
| 3 | Import JS from that **one** umbrella |
| 4 | If MCP is attached: call **`get_started`** once, then **`get_import_specifiers`** before any `import` |
| 5 | Before emitting a component: **`get_contract`** with that slug |
| 6 | Before density / radius / RTL: **`get_design_rules`** with the theme id |
| 7 | Prefer **`search_components`** (`intent`); **`list_components`** to browse |
| 8 | Disk writes only via `chameleon add` / MCP `install_*` → `install-core` |
| 9 | SchemaRenderer default map = **10 slugs** — see [`schema-renderer.md`](./schema-renderer.md) |
| 10 | `@chameleon-ui/adapter-ag-ui` is **POC** — not supported |

Also valid CSS (same layers): `@chameleon-ui/themes/line/css` + `@chameleon-ui/tokens/css` + density. Vue theme overlay: `@chameleon-ui/vue/themes/<id>/css`. Homage example: `@chameleon-ui/themes/cupertino/css`.

**NEVER:** `import "@chameleon-ui/themes/cupertino/variables.css"` — **not exported**.

## CSS / JS (copy exact)

```ts
import "@chameleon-ui/react/css";
import { Button, Card, Table, ThemeProvider } from "@chameleon-ui/react";
```

```ts
import "@chameleon-ui/vue/css"; // real dist/css.css
import { AppShell, Button, Navigation, NavigationBar, ThemeProvider } from "@chameleon-ui/vue";
```

Underlying packages remain valid: `@chameleon-ui/components` / `@chameleon-ui/components-vue`. Named exports are PascalCase; slugs are kebab-case (`data-grid` → `DataGrid`).

Flagship theme: **`line`**. Packages: **`0.2.0`**, unpublished — use pack-external / link / `file:` (see below).

## App chrome

Native model: tab controller + per-tab stack. Not a marketing navbar.

| Role | Component | AppShell slot |
| :--- | :--- | :--- |
| Root destinations | `Navigation` | `navigation` / Vue `#navigation` |
| Stack (title, back) | `NavigationBar` | `header` / Vue `#header` |
| Site links | `Navbar` | **not** AppShell |

One `items` list; CSS morphs TabBar ↔ rail ↔ sidebar. Do **not** compose `Sidebar` + `TabBar`. Tab switch does not push; back pops (`useTabStacks`). Compact overflow: four pins + More.

```tsx
import "@chameleon-ui/react/css";
import { AppShell, Navigation, NavigationBar } from "@chameleon-ui/react";
```

Vue: `import "@chameleon-ui/vue/css"` and JS from `@chameleon-ui/vue`. Height chain: `html, body, #root` (React) or `#app` (Vue) `{ block-size: 100% }`. Templates: `templates/external-vite-react` · `templates/external-vite-vue`.

## External install (unpublished `0.2.0`)

From a built `chameleon-ui/` checkout (consumer-facing scripts — no monorepo filter required at the consumer):

```bash
node ./scripts/pack-external.mjs
# consumer:
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-react-0.2.0.tgz
```

```bash
node ./scripts/link-external.mjs --apply
npm link @chameleon-ui/react
```

Vue:

```bash
node ./scripts/pack-external.mjs --vue
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-vue-0.2.0.tgz
# or:
node ./scripts/link-external.mjs --vue --apply
npm link @chameleon-ui/vue
```

Install **one** umbrella. Legacy five-pack: `--legacy-five` (see AGENTS.md). Official templates: `templates/external-vite-react` · `templates/external-vite-vue`.

Peers (pin **in the consumer app**): React `react@^19` / `@ark-ui/react@5.38.0`; Vue `vue@^3.5` / `@ark-ui/vue@5.38.1`; both need FormatJS pins from AGENTS.md. React 18 is out of range. Node ≥ 20.19.

## MCP attach (optional)

Only when the consumer uses MCP. Build the server once in this library checkout (maintainer command):

```bash
# optional — only if attaching MCP
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server build
```

Consumer `.cursor/mcp.json` or Claude Code `.mcp.json` — **relative paths only**, never machine roots:

```json
{
  "mcpServers": {
    "chameleon-ui": {
      "command": "node",
      "args": ["../chameleon-ui/packages/mcp-server/dist/index.js"],
      "env": {
        "CU_TARGET_DIR": "."
      }
    }
  }
}
```

Adjust `args[0]` to reach `packages/mcp-server/dist/index.js`. `CU_TARGET_DIR: "."` installs into the consumer. Full attach notes: [`../../packages/mcp-server/README.md`](../../packages/mcp-server/README.md).

`npx @chameleon-ui/mcp-server` is not available until npm publish.

### Tools

| When | Tool |
| :--- | :--- |
| First call in the session | `get_started` |
| About to write `import` | `get_import_specifiers` |
| Browse catalog by family | `list_components` |
| Need a component for an intent | `search_components` with `intent` |
| About to emit JSX/SFC for a slug | `get_contract` |
| Theme density / RTL | `get_design_rules` |
| List skins | `list_themes` |
| Scaffold into `CU_TARGET_DIR` | `install_with_theme` (and other `install_*`) |

Also: `get_component` · `install_component` · `install_block` · `install_theme` · `install_bundle` · `telemetry_opt_out` · `record_intent`.

## SchemaRenderer

One-pager: [`schema-renderer.md`](./schema-renderer.md). Do not treat AG-UI POC as supported.
