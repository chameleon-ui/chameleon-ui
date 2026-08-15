# Structure — library map

Paths relative to `chameleon-ui/`.

**Ownership:** this checkout ships `@chameleon-ui/*` packages. Inner apps (docs site, demo, studio, market) are **not** in this repo.

## Root

| File | Note |
| :--- | :--- |
| `README.md` | Library intro + consume entry |
| `AGENTS.md` | AI consumer SSOT |
| `STRUCTURE.md` | This map |
| `package.json` | `check` / `publish:check` / `ai:check` / pack+link+verify |
| `pnpm-workspace.yaml` | `packages/*` · `../toolings/*` (toolings live at repo root) |
| `turbo.json` | build / lint / typecheck / test |
| `LICENSE` · `CONTRIBUTING.md` · `SECURITY.md` | MIT + contrib + telemetry |

## `packages/`

| Path | npm | Note |
| :--- | :--- | :--- |
| `tokens` | `@chameleon-ui/tokens` | DTCG + CSS |
| `themes` | `@chameleon-ui/themes` | overlays + design-rules |
| `contract` | `@chameleon-ui/contract` | schemas + validate |
| `i18n` | `@chameleon-ui/i18n` | ICU · 21 locales |
| `primitives` / `primitives-vue` | `@chameleon-ui/primitives(-vue)` | Ark/Zag thin wrap |
| `components` / `components-vue` | `@chameleon-ui/components(-vue)` | catalog + contracts |
| `react` / `vue` | `@chameleon-ui/react` / `@chameleon-ui/vue` | consumer umbrellas |
| `install-core` | `@chameleon-ui/install-core` | sole disk writer |
| `registry` / `registry-private` | `@chameleon-ui/registry(-private)` | catalog / private HTTP |
| `blocks` | `@chameleon-ui/blocks` | scenario blocks |
| `schema-renderer` | `@chameleon-ui/schema-renderer` | JSON → tree (10-slug default) |
| `adapter-*` | `@chameleon-ui/adapter-*` | A2UI / AG-UI POC / MCP Apps POC |
| `cli` / `mcp-server` | `@chameleon-ui/cli` / `@chameleon-ui/mcp-server` | thin shells → install-core |
| `market-service` | `@chameleon-ui/market-service` | market API (no UI app here) |

## `templates/`

`external-vite-react` · `external-vite-vue` — official external consume templates (one umbrella each).

## `brand/`

Library brand assets (e.g. `chameleon-logo.png`).

Maintainer eslint / stylelint / tsconfig and size budgets live at the **repo root** (`../toolings/`, `../benchmarks/`), not in this library tree.

## Authority

| Data | Authority |
| :--- | :--- |
| Catalog | `packages/components/catalog.json` |
| Contracts | `components/src/<slug>/contract.json` |
| Design rules | `themes/<id>/design-rules.json` |
| Disk writes | **only** `install-core` |
| Size budgets (maintainer) | `../benchmarks/budgets.json` |
| Lint configs (maintainer) | `../toolings/*` |
