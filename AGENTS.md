# AGENTS.md — consume `@chameleon-ui/*`

You are generating or editing an app that **consumes** Chameleon UI. Follow this file. Do not invent import paths. Do not copy `workspace:*` into the consumer `package.json`.

SSOT for agents: this file. Attach notes: [`docs/ai/agent-consume.md`](../docs/ai/agent-consume.md). SchemaRenderer: [`docs/ai/schema-renderer.md`](../docs/ai/schema-renderer.md).

## NEVER

- `import "@chameleon-ui/themes/cupertino/variables.css"` — **not exported**.
- `"@chameleon-ui/components": "workspace:*"` (or any `workspace:*`) in a non-pnpm-workspace app.
- A second installer. Disk writes only via `chameleon add` / MCP `install_*` → `install-core`.
- Treat AG-UI as supported. `@chameleon-ui/adapter-ag-ui` is **POC**.
- Invent `bench.generation_quality` numbers. Honest value is `null` without a configured generator.
- Claim theme recognition rates (「一眼认出 ≥80%」 or any %). Blind test is **PROTOCOL-READY / not_run**; `rate` is `null` until real human trials aggregate.
- Claim accessibility certification (VPAT certified, WCAG AA certified, Section 508, third-party CAB). Docs VPAT is **status=draft**, **published-internal**, **commercialClaimsAllowed=false**.

## CSS (copy exactly)

Preferred (umbrella — tokens + density + flagship `line`):

```ts
import "@chameleon-ui/react/css";
// Vue:
import "@chameleon-ui/vue/css";
```

Also valid (same files, theme-specific):

```ts
import "@chameleon-ui/themes/line/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
```

Homage example (same pattern): `@chameleon-ui/themes/cupertino/css`.

Also valid (same files): `@chameleon-ui/themes/dist/line/variables.css`, `@chameleon-ui/tokens/dist/css/variables.css`.

Replace `line` with one of: `line` · `silver-arrow` · `stuttgart` · `corsa` · `cupertino` · `siren` · `wechat` · `ant-blue`.

**`line` is the visual flagship.** The other seven are quantified tribute overlays (design-rules + tokens/effects/meta + S3 gzip). `recognition_rate` stays `null` until a blind test — do not invent rates or claim Linear parity. Do not treat a theme id swap as a finished product look. Prefer `line` for product chrome unless the consumer named another homage.

## MCP session bootstrap

When the Chameleon MCP server is attached: call **`get_started` first** (catalog summary, CSS + `ThemeProvider theme="line"` recipe, tool order). Then call **`get_import_specifiers`** before writing any import. Browse with `list_components`; prefer `search_components` with `intent` for needs.

Before writing imports, call MCP `get_import_specifiers`.

## JS

React (preferred — one package):

```ts
import { Button, Card, Table, ThemeProvider } from "@chameleon-ui/react";
```

Also valid (underlying package): `from "@chameleon-ui/components"`.

Vue catalog (preferred — one package; 103/103 + ThemeProvider):

```ts
import { AppShell, Button, Navigation, NavigationBar, ThemeProvider } from "@chameleon-ui/vue";
```

Also valid: `from "@chameleon-ui/components-vue"`.

Named exports are PascalCase. Slugs are kebab-case (`data-grid` → `DataGrid`).

Optional per-slug: `import { Button } from "@chameleon-ui/components/button"` or `import { Button } from "@chameleon-ui/components-vue/button"`. Vue also ships `@chameleon-ui/components-vue/css` (already included in `@chameleon-ui/vue/css`).

## App chrome

Tab controller + per-tab stack. Not a marketing navbar. Same slots in Vue (`#header` / `#navigation`).

```tsx
import { AppShell, Navigation, NavigationBar } from "@chameleon-ui/react";

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

Packages are `0.2.0` and **not on npm**. Node ≥ 20.19. Until registry publish, distribution is **file: / npm link / pack-external tarballs** (umbrella tarball is first-class).

```bash
cd chameleon-ui
node ./scripts/pack-external.mjs
# in the consumer app:
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-react-0.2.0.tgz
```

Or link the umbrella:

```bash
node ./scripts/link-external.mjs --apply
# in the consumer app:
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

Legacy five-pack (compatibility): `node ./scripts/pack-external.mjs --legacy-five` / `link-external.mjs --legacy-five`. Do **not** copy `workspace:*` into the consumer.

Official Vite + Windows templates: `templates/external-vite-react` · `templates/external-vite-vue` (one umbrella `file:` dep). Print the Vite snippet: `node ./scripts/link-external.mjs --print-vite` (add `-vue`). Verify: `node ./scripts/verify-external-templates.mjs` (`--build` for vite build). Dual-track notes: [`docs/ai/agent-consume.md`](../docs/ai/agent-consume.md).

Pin at the consumer root. React: `react@^19` · `@ark-ui/react@5.38.0`. Vue: `vue@^3.5` · `@ark-ui/vue@5.38.1`. Both: `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14`. React 18 is out of range. Node ≥ 20.19.

```tsx
import { ThemeProvider, ToastProvider } from "@chameleon-ui/react";

<ThemeProvider theme="line" locale="zh-CN">
  <ToastProvider>{app}</ToastProvider>
</ThemeProvider>
```

Vue: same names from `@chameleon-ui/vue`. Product chrome prefers `theme="line"`.

Single theme via umbrella CSS is enough for `line`. Other themes: also import `@chameleon-ui/themes/<id>/css`. Multi-theme: pass `overlays` (raw CSS) so only `[data-theme]` paints.

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

`get_started` · `list_components` · `search_components` (pass `intent` or `query`) · `get_component` · `get_contract` · `get_design_rules` · `get_import_specifiers` · `list_themes` · `install_component` · `install_block` · `install_theme` · `install_bundle` · `install_with_theme` · `telemetry_opt_out` · `record_intent`

Attach snippet: `packages/mcp-server/README.md`. Consumer paste rule: [`docs/ai/consumer-agent-bootstrap.md`](../docs/ai/consumer-agent-bootstrap.md).

## SchemaRenderer

Emit `{ "version": "1.0", "root": { "component": "<slug>", "props": {}, "children": [] } }`. Default map is **10 slugs only** (`alert` `badge` `button` `card` `divider` `empty-state` `heading` `input` `stack` `typography`). React: `@chameleon-ui/schema-renderer`. Vue: `@chameleon-ui/schema-renderer/vue`. For `table` / `chart` / `kpi-dashboard`, import from `@chameleon-ui/react` or `@chameleon-ui/vue` — do not pretend SchemaRenderer covers the full catalog.
