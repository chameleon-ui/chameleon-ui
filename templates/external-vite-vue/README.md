# External Vite + Vue consumer

Official template for an app **outside** the Chameleon pnpm workspace (Vite 6 + Vue 3, Windows included).

React is the primary implementation. This template is the Vue consume path: ThemeProvider + AppShell + Navigation + Button, **`line`** theme via `@chameleon-ui/vue`.

Packages are **0.2.0** (see `packages/*/package.json`) and **not on npm**. Do not write `workspace:*` here.

This template depends on **one** package: `@chameleon-ui/vue` (`file:../../packages/vue`). Catalog Vue is **103/103** (plus ThemeProvider). SchemaRenderer default map is still **10 slugs**; Vue import is `@chameleon-ui/schema-renderer/vue`.

## Before `npm install`

From `chameleon-ui/`:

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/vue... build
```

Then in this folder:

```bash
npm install
npm run typecheck
npm run dev
```

`file:` points at the umbrella package. After a library change, rebuild; this app consumes `dist`.

Monorepo gate (from `chameleon-ui/`):

```bash
pnpm verify:external          # typecheck both templates
pnpm verify:external:build    # typecheck + vite build
```

## Three consume paths (pick one)

1. **This template** (`file:` umbrella) -- best while iterating next to the monorepo.
2. **npm link** -- from `chameleon-ui/` run `node ./scripts/link-external.mjs --vue --apply`, then `npm link @chameleon-ui/vue` in the app.
3. **Umbrella tarball (first-class pre-registry)** -- `node ./scripts/pack-external.mjs --vue`, then `npm install ../chameleon-ui/dist-tarballs/chameleon-ui-vue-0.2.0.tgz`. Still not a registry publish. Legacy five-pack: `--legacy-five`.

## Windows + Vite (already in `vite.config.ts`)

- `resolve.preserveSymlinks: true`
- `resolve.dedupe` for `vue`, `@ark-ui/vue`, `intl-messageformat`
- `optimizeDeps.include` for Ark + FormatJS
- `server.fs.allow` includes the Chameleon checkout (`CU_MONOREPO` override)

CSS:

```ts
import "@chameleon-ui/vue/css";
```

Never `@chameleon-ui/themes/*/variables.css` (unexported).

## Peers at the app root

`vue@^3.5` · `@ark-ui/vue@5.38.1` · `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14`. Node ≥ 20.19.

See `chameleon-ui/AGENTS.md` and docs **外部接入**.
