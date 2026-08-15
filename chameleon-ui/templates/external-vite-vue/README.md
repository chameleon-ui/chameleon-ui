# External Vite + Vue consumer

Official template for an app **outside** the Chameleon pnpm workspace (Vite 6 + Vue 3, Windows included).

React is the primary implementation. This template is the Vue consume path: ThemeProvider + AppShell + Navigation + Button, `line` theme.

Packages are `0.1.0` and **not on npm**. Do not write `workspace:*` here.

Vue does **not** ship all 100+ React slugs. Product chrome and the common consume path are here. Catalog gaps stay React-only until ported — see `packages/components-vue/README.md`.

## Before `npm install`

From `chameleon-ui/`:

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens --filter @chameleon-ui/i18n --filter @chameleon-ui/primitives-vue --filter @chameleon-ui/themes --filter @chameleon-ui/components-vue build
```

Then in this folder:

```bash
npm install
npm run dev
```

`file:` points at `packages/*`. After a library change, rebuild those packages — this app consumes `dist`.

## Three consume paths (pick one)

1. **This template** (`file:` siblings) — best while iterating next to the monorepo.
2. **npm link** — from `chameleon-ui/` run `node ./scripts/link-external.mjs --vue --apply`, then link **all five** Vue-graph packages in the app.
3. **Tarballs** — `node ./scripts/pack-external.mjs --vue`, then `npm install` each `.tgz`. Still not a registry publish.

## Windows + Vite (already in `vite.config.ts`)

- `resolve.preserveSymlinks: true`
- `resolve.dedupe` for `vue`, `@ark-ui/vue`, `intl-messageformat`
- `optimizeDeps.include` for Vue + Ark + FormatJS
- `server.fs.allow` includes the Chameleon checkout (`CU_MONOREPO` override)
- **Do not** alias `@ark-ui/vue` to a folder; subpaths break

CSS specifiers (do not guess):

```ts
import "@chameleon-ui/themes/line/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
```

Component CSS is emitted by `@chameleon-ui/components-vue` (JS side-effect import plus `./css`). Preferred JS:

```ts
import { AppShell, Button, Navigation, NavigationBar, ThemeProvider } from "@chameleon-ui/components-vue";
```

Print a last-resort Vite snippet:

```bash
node ../../scripts/link-external.mjs --print-vite-vue
```

## Height chain

`html, body, #app { block-size: 100% }` is required. AppShell fills its parent. Do not lock the page to a desktop CSS Grid that fights the three-end `Navigation` morph.

## Version matrix

| Package | Pin |
| :--- | :--- |
| Node | ≥ 20.19 |
| `vue` | `^3.5` |
| `@ark-ui/vue` | `5.38.1` (dependency of primitives-vue; install at the app root) |
| `intl-messageformat` | `11.2.13` |
| `@formatjs/icu-messageformat-parser` | `3.5.14` |

npm publish (`v0.1.0`) is not done.
