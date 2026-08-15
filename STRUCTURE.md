# Structure — library map

Paths relative to `chameleon-ui/`.

**Ownership:** this directory is the **library unit** intended to stand alone when split. It ships `@chameleon-ui/*` packages plus consume docs (`AGENTS.md`, `docs/ai/`), `templates/`, and `brand/`. Inner apps (docs site, demo, studio, market) are **not** in this tree.

## Root

| File | Note |
| :--- | :--- |
| `README.md` | Library intro + consume entry |
| `AGENTS.md` | AI consumer SSOT |
| `docs/ai/` | Agent attach notes (consume, SchemaRenderer, vocabulary, …) |
| `STRUCTURE.md` | This map |
| `package.json` | `check` / `publish:check` / `ai:check` / pack+link+verify |
| `pnpm-workspace.yaml` | `packages/*`; may also list `../toolings/*` when this tree sits in the full monorepo |
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

## Optional monorepo neighbors

When this tree still lives inside the full ChameleonUI monorepo, sibling **`../toolings/`** (eslint / stylelint / tsconfig) and **`../benchmarks/`** (size budgets) sit beside it. They are **maintainer transparency** — present in the full checkout, **may be absent** when only `chameleon-ui/` is published or cloned. Consumers do **not** need them; do not add them to an app `package.json`.

| Data | Authority (when neighbors exist) |
| :--- | :--- |
| Size budgets (maintainer) | `../benchmarks/budgets.json` |
| Lint configs (maintainer) | `../toolings/*` |

## Authority

| Data | Authority |
| :--- | :--- |
| Catalog | `packages/components/catalog.json` |
| Contracts | `components/src/<slug>/contract.json` |
| Design rules | `themes/<id>/design-rules.json` |
| Disk writes | **only** `install-core` |
