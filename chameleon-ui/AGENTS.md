# AGENTS.md — consume `@chameleon-ui/*`

You are generating or editing an app that **consumes** Chameleon UI. Follow this file. Do not invent import paths. Do not copy `workspace:*` into the consumer `package.json`.

SSOT for agents: this file. Longer attach notes: `docs/ai/agent-consume.md`. SchemaRenderer: `docs/ai/schema-renderer.md`.

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

Before writing imports, call MCP `get_import_specifiers`.

## JS

```ts
import { Button, Card, Table } from "@chameleon-ui/components";
```

Named exports are PascalCase. Slugs are kebab-case (`data-grid` → `DataGrid`).

## External app (not this pnpm workspace)

Packages are `0.0.0` and **not on npm**. Node ≥ 20.19.

```bash
cd chameleon-ui
node ./scripts/link-external.mjs --apply
# in the consumer app:
npm link @chameleon-ui/tokens @chameleon-ui/i18n @chameleon-ui/primitives @chameleon-ui/themes @chameleon-ui/components
```

Link **all five**. Linking only `components` fails. After v0.1.0 publish (not done): `npm install` those names instead.

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

Emit `{ "version": "1.0", "root": { "component": "<slug>", "props": {}, "children": [] } }`. Default map is **10 slugs only** (`alert` `badge` `button` `card` `divider` `empty-state` `heading` `input` `stack` `typography`). For `table` / `chart` / `kpi-dashboard`, import from `@chameleon-ui/components` — do not pretend SchemaRenderer covers the full catalog.
