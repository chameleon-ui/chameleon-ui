# Chameleon UI · library unit

> pnpm + Turborepo root for `@chameleon-ui/*`. Run installs and scripts **here**.
> LICENSE: MIT. Telemetry off by default (`telemetry-notice.v1`).

## What this is

This directory is the **library unit** intended to **stand alone** when split/published as the public surface. It ships publishable `@chameleon-ui/*` packages: tokens, themes, i18n, primitives, components (React + Vue), umbrellas (`react` / `vue`), registry, CLI, MCP, install-core, schema-renderer, adapters — plus `AGENTS.md`, `docs/ai/`, official `templates/`, and `brand/`.

Community demo / docs / market apps are owned outside this tree. Library health ≠ app health.

Packages are **0.2.0**, **unpublished**. Do not assume `npm install @chameleon-ui/react` works until a registry publish.

Catalog: [`packages/components/catalog.json`](./packages/components/catalog.json). Map: [`STRUCTURE.md`](./STRUCTURE.md). Agents: [`AGENTS.md`](./AGENTS.md). Attach notes: [`docs/ai/`](./docs/ai/).

## Workspace members

```
chameleon-ui/
├── packages/            # @chameleon-ui/*
├── templates/           # external-vite-react · external-vite-vue
├── docs/ai/             # agent consume notes (SSOT with AGENTS.md)
├── brand/               # logo / brand assets
├── scripts/             # pack/link/publish:check/ai:check
└── LICENSE
```

**Optional monorepo neighbors** (present in the full ChameleonUI checkout; **may be absent** when only `chameleon-ui/` is published or cloned): sibling `../toolings/` (eslint / stylelint / tsconfig) and `../benchmarks/` (size budgets). Those explain maintainer quality gates — **not** consumer app dependencies. Do not require them to consume `@chameleon-ui/*`.

## Layer rules

| Layer | Packages | Rule |
| :--- | :--- | :--- |
| L1 | tokens · themes · i18n · contract | No react / vue |
| L1 | primitives / primitives-vue | Peer framework; only `@ark-ui/*` / Zag |
| L2 | components / components-vue | Depend on L1 only; never import `@ark-ui/*` directly |
| L3/L4 | adapters | Protocol mapping only; disk writes via install-core |
| Install | install-core | Sole disk writer |

## Commands

```
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 check
corepack pnpm@9.15.0 publish:check
corepack pnpm@9.15.0 ai:check
corepack pnpm@9.15.0 link:external
corepack pnpm@9.15.0 pack:external
corepack pnpm@9.15.0 verify:external
```

Node `>=20.19.0`, pnpm `9.15.0`.
