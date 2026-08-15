# External Vite + React consumer

Official template for an app **outside** the Chameleon pnpm workspace (EraseLab shape: Vite 6 + React 19 + Windows).

Packages are **0.2.0** (see `packages/*/package.json`) and **not on npm**. Do not write `workspace:*` here.

This template depends on **one** package: `@chameleon-ui/react` (`file:../../packages/react`). Default product chrome: **`line`** via `import "@chameleon-ui/react/css"` + `ThemeProvider theme="line"`. SchemaRenderer default map is still **10 slugs**; import the rest from `@chameleon-ui/react`.

## Before `npm install`

From `chameleon-ui/`:

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/react... build
```

Then in this folder:

```bash
npm install
npm run typecheck
npm run dev
```

`file:` points at the umbrella package (which pulls the five runtime packages via `workspace:*` inside the monorepo). After a library change, rebuild; this app consumes `dist`.

Monorepo gate (from `chameleon-ui/`):

```bash
pnpm verify:external          # typecheck both templates
pnpm verify:external:build    # typecheck + vite build
```

## Three consume paths (pick one)

1. **This template** (`file:` umbrella) -- best while iterating next to the monorepo.
2. **npm link** -- from `chameleon-ui/` run `node ./scripts/link-external.mjs --apply`, then `npm link @chameleon-ui/react` in the app.
3. **Umbrella tarball (first-class pre-registry)** -- `node ./scripts/pack-external.mjs`, then `npm install ../chameleon-ui/dist-tarballs/chameleon-ui-react-0.2.0.tgz`. Still not a registry publish. Legacy five-pack: `--legacy-five`.

## Windows + Vite (already in `vite.config.ts`)

- `resolve.preserveSymlinks: true` -- do not walk into the library's pnpm store.
- `resolve.dedupe` for `react`, `react-dom`, `@ark-ui/react`, `intl-messageformat`.
- `optimizeDeps.include` for Ark + FormatJS.
- `server.fs.allow` includes the Chameleon checkout (`CU_MONOREPO` override).
- **Do not** alias `@ark-ui/react` to a folder; subpaths (`/checkbox`, `/dialog`) break.

CSS specifiers (do not guess):

```ts
import "@chameleon-ui/react/css";
// or theme-specific:
import "@chameleon-ui/themes/line/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
```

Never `@chameleon-ui/themes/*/variables.css` (unexported).

## Peers at the app root

`react@^19` · `react-dom@^19` · `@ark-ui/react@5.38.0` · `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14`. Node ≥ 20.19. React 18 is out of range.

See `chameleon-ui/AGENTS.md` and docs **外部接入**.
