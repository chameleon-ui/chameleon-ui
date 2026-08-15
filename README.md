# Chameleon UI · library monorepo

> pnpm + Turborepo root. Run installs and scripts **here**, not at the workspace parent.
> LICENSE: MIT. Telemetry off by default (`telemetry-notice.v1`).

## What this is

Publishable `@chameleon-ui/*` packages: tokens, themes, i18n, primitives, components (React + Vue), umbrellas (`react` / `vue`), registry, CLI, MCP, install-core, schema-renderer, adapters.

This tree is **library-only**. Community demo / docs / market apps are owned outside this checkout. Library health ≠ app health.

Packages are **0.2.0**, **unpublished**. Do not assume `npm install @chameleon-ui/react` works until a registry publish.

Catalog: [`packages/components/catalog.json`](./packages/components/catalog.json). Map: [`STRUCTURE.md`](./STRUCTURE.md). Agents: [`AGENTS.md`](./AGENTS.md).

## Workspace members

```
chameleon-ui/
├── packages/            # @chameleon-ui/*
├── templates/           # external-vite-react · external-vite-vue
├── scripts/             # pack/link/publish:check/ai:check
└── LICENSE
```

Maintainer configs: repo-root `toolings/` · `benchmarks/`.

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
