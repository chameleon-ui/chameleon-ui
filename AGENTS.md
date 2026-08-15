# AGENTS.md — consume `@chameleon-ui/*`

You are generating or editing an **external app** that consumes Chameleon UI.

**This file is the SSOT.** Do not invent import paths. Do not copy `workspace:*` into a consumer `package.json`.

Deeper notes (same checkout): [`docs/ai/consumer-agent-bootstrap.md`](./docs/ai/consumer-agent-bootstrap.md) · [`docs/ai/agent-consume.md`](./docs/ai/agent-consume.md) · [`docs/ai/schema-renderer.md`](./docs/ai/schema-renderer.md).

---

## Start here in 60 seconds

**Pick exactly one umbrella** — React **or** Vue. Never both. Never default to React if the user (or existing `package.json`) already chose Vue — and the reverse.

### React

```tsx
// main.tsx
import "@chameleon-ui/react/css";
import { ThemeProvider, ToastProvider, Button } from "@chameleon-ui/react";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme="line" locale="zh-CN">
    <ToastProvider>
      <Button>OK</Button>
    </ToastProvider>
  </ThemeProvider>,
);
```

```css
html, body, #root { block-size: 100%; }
```

### Vue

```ts
// main.ts
import { createApp } from "vue";
import "@chameleon-ui/vue/css"; // real dist/css.css after build
import App from "./App.vue";

createApp(App).mount("#app");
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ThemeProvider, ToastProvider, Button } from "@chameleon-ui/vue";
</script>

<template>
  <ThemeProvider theme="line" locale="zh-CN">
    <ToastProvider>
      <Button>OK</Button>
    </ToastProvider>
  </ThemeProvider>
</template>
```

```css
html, body, #app { block-size: 100%; }
```

Unstyled / “not Chameleon” almost always means **missing CSS** or **missing `ThemeProvider`**.

| Track | Umbrella | Catalog |
| :--- | :--- | :--- |
| React | `@chameleon-ui/react` | full React catalog + `ThemeProvider` |
| Vue | `@chameleon-ui/vue` | **103/103** + `ThemeProvider` |

Packages are **`0.2.0` and not on npm yet.** Node **≥ 20.19**.

---

## Install into an external app

Until npm publish, use **umbrella tarball**, **`npm link`**, or an **official Vite template** (`file:`). Prefer **one** umbrella.

```bash
# After the matching umbrella is built in this checkout:
node ./scripts/pack-external.mjs          # → dist-tarballs/chameleon-ui-react-0.2.0.tgz
node ./scripts/pack-external.mjs --vue    # → dist-tarballs/chameleon-ui-vue-0.2.0.tgz

# in the consumer app:
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-react-0.2.0.tgz
# or:
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-vue-0.2.0.tgz
```

```bash
node ./scripts/link-external.mjs --apply          # then: npm link @chameleon-ui/react
node ./scripts/link-external.mjs --vue --apply    # then: npm link @chameleon-ui/vue
```

Official templates: `templates/external-vite-react` · `templates/external-vite-vue` — build the matching umbrella, then `npm install` && `npm run dev`.

Legacy five-pack (compatibility only): `--legacy-five` on pack/link. Prefer **one umbrella**.

**Never** write `"@chameleon-ui/components": "workspace:*"` (or any `workspace:*`) in a non-workspace consumer `package.json`.

### Peers (install in the consumer app)

Required **peer versions for the consumer app** (not monorepo internals):

| Stack | Peers |
| :--- | :--- |
| React | `react@^19` · `react-dom@^19` · `@ark-ui/react@5.38.0` · `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14` |
| Vue | `vue@^3.5` · `@ark-ui/vue@5.38.1` · `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14` |

React **18 is out of range.** Vite tips (in official templates): `resolve.preserveSymlinks: true`, dedupe framework + Ark + FormatJS. **Do not** add `resolve.alias` for `@chameleon-ui/*` CSS — package `exports` must resolve.

---

## CSS (copy exactly — never invent)

Preferred (one import):

```ts
import "@chameleon-ui/react/css";
import "@chameleon-ui/vue/css";
```

- React umbrella CSS = tokens + density + flagship `line`.
- Vue umbrella CSS = tokens + density + flagship `line` + **components-vue** (real file: `exports` → `dist/css.css`).

Also valid (same layers, split):

```ts
import "@chameleon-ui/themes/line/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
import "@chameleon-ui/components-vue/css"; // Vue only; already inside @chameleon-ui/vue/css
```

Also valid: `@chameleon-ui/themes/dist/line/variables.css`, `@chameleon-ui/tokens/dist/css/variables.css`.

Default product chrome is **`line`**. Official theme ids: `line` · `silver-arrow` · `stuttgart` · `corsa` · `cupertino` · `siren` · `wechat` · `ant-blue`.

```ts
import "@chameleon-ui/themes/cupertino/css";
import "@chameleon-ui/vue/themes/cupertino/css"; // same file via Vue umbrella
```

Then `<ThemeProvider theme="cupertino" …>`. Single theme via umbrella CSS is enough for `line`. Multi-theme: pass `overlays` (raw CSS) so only `[data-theme]` paints.

**Never:** `import "@chameleon-ui/themes/cupertino/variables.css"` — **not exported**.

**`line` is the visual flagship.** Other seven are tribute overlays. `recognition_rate` stays `null` — do not invent rates. Do **not** replace Chameleon theme CSS with Tailwind / Ant / handmade tokens.

---

## JS imports

```ts
import { Button, Card, Table, ThemeProvider } from "@chameleon-ui/react";
import { AppShell, Button, Navigation, NavigationBar, ThemeProvider } from "@chameleon-ui/vue";
```

Also valid:

```ts
import { Button } from "@chameleon-ui/components";
import { Button } from "@chameleon-ui/components-vue";
```

Named exports are **PascalCase**. Slugs are **kebab-case** (`data-grid` → `DataGrid`). Optional: `from "@chameleon-ui/components/button"` or `from "@chameleon-ui/components-vue/button"`.

---

## App chrome

Native model: **tab controller + per-tab stack**. Not a marketing navbar.

| Role | Component | AppShell slot |
| :--- | :--- | :--- |
| Root destinations | `Navigation` | `navigation` / Vue `#navigation` |
| Stack (title, back) | `NavigationBar` | `header` / Vue `#header` |
| Site links | `Navbar` | **not** AppShell |

```tsx
import { AppShell, Navigation, NavigationBar } from "@chameleon-ui/react";

<AppShell
  header={<NavigationBar title={title} backLabel={back} onBack={canPop ? pop : undefined} />}
  navigation={<Navigation label="Main" items={tabs} activeValue={tab} onSelect={selectTab} />}
>
  {screen}
</AppShell>
```

Vue: same names from `@chameleon-ui/vue`; slots `#header` / `#navigation`. One `items` list — CSS morphs TabBar ↔ rail ↔ sidebar. Do **not** compose `Sidebar` + `TabBar`. Tab switch does not push; back pops (`useTabStacks`). Compact overflow: four pins + More. AppShell fills its parent — do **not** set `min-block-size: 100dvh` on the shell.

---

## MCP (optional)

If MCP is attached: **`get_started`** once → **`get_import_specifiers`** before imports → **`get_contract`** before emit → **`get_design_rules`** before density/RTL. Prefer **`search_components`** (`intent`); browse with **`list_components`**. If MCP is **not** attached: copy paths from this file; do not invent alternatives.

| When | Tool |
| :--- | :--- |
| First call | `get_started` |
| About to write `import` | `get_import_specifiers` |
| Browse by family | `list_components` |
| Need a component | `search_components` |
| About to emit JSX/SFC | `get_contract` |
| Density / radius / RTL | `get_design_rules` |
| List skins | `list_themes` |
| Scaffold into `CU_TARGET_DIR` | `install_with_theme` (+ other `install_*`) |

Also: `get_component` · `install_component` · `install_block` · `install_theme` · `install_bundle` · `telemetry_opt_out` · `record_intent`.

Attach: [`packages/mcp-server/README.md`](./packages/mcp-server/README.md). Consumer `.cursor/mcp.json` uses **relative paths only**. Building the MCP binary is **optional** (only when attaching MCP) — see Appendix. `npx @chameleon-ui/mcp-server` unavailable until publish. Disk writes **only** via `chameleon add` / MCP `install_*` → `install-core`.

---

## CLI / contracts / locales / SchemaRenderer

```
chameleon add button
chameleon install-with-theme button cupertino
```

`chameleon add` is the only CLI write for a single component.

- Contracts: `@chameleon-ui/components/contracts/<slug>` · MCP `get_contract` · disk `packages/components/src/<slug>/contract.json` (v0.2). Every contract has `dataAi.role` + `dataAi.states` + `dataAi.intents`. Schema `$id`: `https://chameleon-ui.dev/schemas/component-contract/v0.2.json`.
- Design rules: `@chameleon-ui/themes/cupertino/design-rules` · MCP `get_design_rules` · disk `packages/themes/src/<theme>/design-rules.json`.

Locales (21): `zh-CN` `zh-HK` `ja` `ko` `ru` `hi` `en` `de` `ar` `ug` `sw` `ha` `am` `es` `fr` `pt` `bn` `id` `ur` `fa` `vi`  
RTL: `ar` `ug` `ur` `fa`. Use `directionForLocale` from `@chameleon-ui/i18n`. **Do not guess `dir`.** Pass `locale` into `ThemeProvider`.

SchemaRenderer emit:

```json
{
  "version": "1.0",
  "root": { "component": "<slug>", "props": {}, "children": [] }
}
```

Default map **10 slugs only**: `alert` `badge` `button` `card` `divider` `empty-state` `heading` `input` `stack` `typography`. React: `@chameleon-ui/schema-renderer`. Vue: `@chameleon-ui/schema-renderer/vue`. For `table` / `chart` / `kpi-dashboard`, use the umbrella — do not pretend SchemaRenderer covers the full catalog. Details: [`docs/ai/schema-renderer.md`](./docs/ai/schema-renderer.md).

---

## NEVER

- `import "@chameleon-ui/themes/cupertino/variables.css"` — **not exported**.
- `"@chameleon-ui/components": "workspace:*"` (or any `workspace:*`) in a non-pnpm-workspace app.
- A second installer. Disk writes only via `chameleon add` / MCP `install_*` → `install-core`.
- Both `@chameleon-ui/react` **and** `@chameleon-ui/vue` in one app.
- Treat AG-UI as supported. `@chameleon-ui/adapter-ag-ui` is **POC**.
- Invent `bench.generation_quality` scores. Honest value is `null` without a configured generator.
- Claim theme recognition rates (「一眼认出 ≥80%」 or any %). Blind test is **PROTOCOL-READY / not_run**; `rate` is `null` until real human trials.
- Claim accessibility certification (VPAT certified, WCAG AA certified, Section 508, third-party CAB). Docs VPAT is **status=draft**, **published-internal**, **commercialClaimsAllowed=false**.
- Substitute Tailwind / other UI kits for Chameleon theme CSS.
- Compose `Sidebar` + `TabBar` instead of `Navigation`.
- Add Vite `resolve.alias` hacks for `@chameleon-ui/*/css` when exports should resolve.

---

## Appendix: library maintainers

For people building **this** checkout — not the default path for consumer AIs.

This directory is the **library unit** (intended to stand alone when split). Size/lint gates live in sibling **`../toolings/`** and **`../benchmarks/`** when this tree is still inside the full monorepo; those neighbors are optional and may be absent from a `chameleon-ui/`-only publish. They are maintainer transparency, not consumer dependencies.

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/react... build
corepack pnpm@9.15.0 --filter @chameleon-ui/vue... build
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server build
node ./scripts/verify-vue-css-consume.mjs
pnpm verify:external
pnpm ai:check
```
