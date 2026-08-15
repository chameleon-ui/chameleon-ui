# AGENTS.md — consume `@chameleon-ui/*`

You are generating or editing an app that **consumes** Chameleon UI. Follow this file. Do not invent import paths. Do not copy `workspace:*` into the consumer `package.json`.

SSOT for agents: this file. Product spec: docs site **编码 Agent 集成** (`apps/docs/docs/guides/for-agents.mdx`). Attach notes: [`docs/ai/agent-consume.md`](../docs/ai/agent-consume.md). SchemaRenderer: [`docs/ai/schema-renderer.md`](../docs/ai/schema-renderer.md).

## NEVER

- `import "@chameleon-ui/themes/cupertino/variables.css"` — **not exported**.
- `"@chameleon-ui/components": "workspace:*"` (or any `workspace:*`) in a non-pnpm-workspace app.
- A second installer. Disk writes only via `chameleon add` / MCP `install_*` → `install-core`.
- Treat AG-UI as supported. `@chameleon-ui/adapter-ag-ui` is **POC**.
- Invent `bench.generation_quality` numbers. Honest value is `null` without a configured generator.

## CSS (copy exactly)

Preferred:

```ts
import "@chameleon-ui/themes/cupertino/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
```

Also valid (same files): `@chameleon-ui/themes/dist/cupertino/variables.css`, `@chameleon-ui/tokens/dist/css/variables.css`.

Replace `cupertino` with one of: `line` · `silver-arrow` · `stuttgart` · `corsa` · `cupertino` · `siren` · `wechat` · `ant-blue`.

**`line` is the visual flagship.** The other seven are quantified tribute overlays (design-rules + tokens/effects/meta + S3 gzip; report: `docs/project/reports/2026-08-15-theme-quantification.md`). `recognition_rate` stays `null` until a blind test — do not invent rates or claim Linear parity. Do not treat a theme id swap as a finished product look. Prefer `line` for product chrome unless the consumer named another homage.

Before writing imports, call MCP `get_import_specifiers`.

## JS

React (primary):

```ts
import { Button, Card, Table } from "@chameleon-ui/components";
```

Vue catalog (`@chameleon-ui/components-vue` — 103/103 catalog slugs + ThemeProvider):

```ts
import { AppShell, Button, Navigation, NavigationBar, ThemeProvider } from "@chameleon-ui/components-vue";
```

Named exports are PascalCase. Slugs are kebab-case (`data-grid` → `DataGrid`).

Optional per-slug: `import { Button } from "@chameleon-ui/components/button"` or `import { Button } from "@chameleon-ui/components-vue/button"`. Vue also ships `@chameleon-ui/components-vue/css`.

## App chrome

Tab controller + per-tab stack. Not a marketing navbar. Same slots in Vue (`#header` / `#navigation`).

```tsx
import { AppShell, Navigation, NavigationBar } from "@chameleon-ui/components";

<AppShell
  header={<NavigationBar title={title} backLabel={back} onBack={canPop ? pop : undefined} />}
  navigation={<Navigation label="Main" items={tabs} activeValue={tab} onSelect={selectTab} />}
>
  {screen}
</AppShell>
```

- One `items` list. CSS morphs TabBar ↔ rail ↔ sidebar. Do **not** compose `Sidebar` + `TabBar`.
- Switching tabs does not push. Back pops (`useTabStacks`).
- Compact overflow: four pins + More. `Navbar` is site links only — never AppShell header.
- Height chain: `html, body, #root { block-size: 100% }` (Vue template: `#app`). AppShell fills its parent. Do not set `min-block-size: 100dvh` on the shell. Do not freeze a desktop CSS Grid that fights Navigation morph.

## External app (not this pnpm workspace)

Packages are `0.1.0` and **not on npm**. Node ≥ 20.19.

```bash
cd chameleon-ui
node ./scripts/link-external.mjs --apply
# in the consumer app:
npm link @chameleon-ui/tokens @chameleon-ui/i18n @chameleon-ui/primitives @chameleon-ui/themes @chameleon-ui/components
```

Vue graph:

```bash
node ./scripts/link-external.mjs --vue --apply
npm link @chameleon-ui/tokens @chameleon-ui/i18n @chameleon-ui/primitives-vue @chameleon-ui/themes @chameleon-ui/components-vue
```

Link **all five** of the chosen graph. Linking only `components` / `components-vue` fails. After npm publish (not done): `npm install` those names instead.

Official Vite + Windows templates: `templates/external-vite-react` · `templates/external-vite-vue`. Print the Vite snippet: `node ./scripts/link-external.mjs --print-vite` (add `-vue`). Tarballs: `node ./scripts/pack-external.mjs` (`--vue` for the Vue graph). Dual-track notes: docs **外部接入** (`apps/docs/docs/guides/consume.mdx`).

Pin at the consumer root. React: `react@^19` · `@ark-ui/react@5.38.0`. Vue: `vue@^3.5` · `@ark-ui/vue@5.38.1`. Both: `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14`. React 18 is out of range. Node ≥ 20.19.

```tsx
import { ThemeProvider, ToastProvider } from "@chameleon-ui/components";

<ThemeProvider theme="cupertino" locale="zh-CN">
  <ToastProvider>{app}</ToastProvider>
</ThemeProvider>
```

Vue: same names from `@chameleon-ui/components-vue`. Product chrome prefers `theme="line"`.

Single theme: also import `@chameleon-ui/themes/<id>/css`. Multi-theme: pass `overlays` (raw CSS) so only `[data-theme]` paints.

## CLI / writes

```
chameleon add button
chameleon install-with-theme button cupertino
```

`chameleon add` is the only CLI write for a single component.

## Contract JSON

- On disk: `packages/components/src/<slug>/contract.json` (v0.2, 100% of catalog).
- Package export: `@chameleon-ui/components/contracts/<slug>`
- MCP: `get_contract` with `{ "slug": "button" }`
- Schema `$id`: `https://chameleon-ui.dev/schemas/component-contract/v0.2.json` (docs-site copy; public host pending).

Every contract has `dataAi.role` + `dataAi.states` + `dataAi.intents`.

## Design rules

- On disk: `packages/themes/src/<theme>/design-rules.json`
- Export: `@chameleon-ui/themes/cupertino/design-rules`
- MCP: `get_design_rules` with `{ "theme_id": "cupertino" }`

## Locales (21)

`zh-CN` `zh-HK` `ja` `ko` `ru` `hi` `en` `de` `ar` `ug` `sw` `ha` `am` `es` `fr` `pt` `bn` `id` `ur` `fa` `vi`

RTL: `ar` `ug` `ur` `fa`. Use `directionForLocale` from `@chameleon-ui/i18n`. Do not guess `dir`.

## MCP tools

`search_components` (pass `intent` or `query`) · `get_component` · `get_contract` · `get_design_rules` · `get_import_specifiers` · `list_themes` · `install_component` · `install_theme` · `install_bundle` · `install_with_theme` · `telemetry_opt_out` · `record_intent`

Attach snippet: `packages/mcp-server/README.md`.

## SchemaRenderer

Emit `{ "version": "1.0", "root": { "component": "<slug>", "props": {}, "children": [] } }`. Default map is **10 slugs only** (`alert` `badge` `button` `card` `divider` `empty-state` `heading` `input` `stack` `typography`). React: `@chameleon-ui/schema-renderer`. Vue: `@chameleon-ui/schema-renderer/vue`. For `table` / `chart` / `kpi-dashboard`, import from `@chameleon-ui/components` or `@chameleon-ui/components-vue` — do not pretend SchemaRenderer covers the full catalog.
