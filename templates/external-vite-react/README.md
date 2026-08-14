# External Vite + React consumer

Official template for an app **outside** the Chameleon pnpm workspace (EraseLab shape: Vite 6 + React 19 + Windows).

Packages are `0.1.0` and **not on npm**. Do not write `workspace:*` here.

## Before `npm install`

From `chameleon-ui/`:

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens --filter @chameleon-ui/i18n --filter @chameleon-ui/primitives --filter @chameleon-ui/themes --filter @chameleon-ui/components build
```

Then in this folder:

```bash
npm install
npm run dev
```

`file:` points at `packages/*`. After a library change, rebuild those packages — this app consumes `dist`.

## Three consume paths (pick one)

1. **This template** (`file:` siblings) — best while iterating next to the monorepo.
2. **npm link** — from `chameleon-ui/` run `node ./scripts/link-external.mjs --apply`, then link **all five** packages in the app.
3. **Tarballs** — `node ./scripts/pack-external.mjs`, then `npm install` each `.tgz`. Still not a registry publish.

## Windows + Vite (already in `vite.config.ts`)

- `resolve.preserveSymlinks: true` — do not walk into the library's pnpm store.
- `resolve.dedupe` for `react`, `react-dom`, `@ark-ui/react`, `intl-messageformat`.
- `optimizeDeps.include` for Ark + FormatJS.
- `server.fs.allow` includes the Chameleon checkout (`CU_MONOREPO` override).
- **Do not** alias `@ark-ui/react` to a folder; subpaths (`/checkbox`, `/dialog`) break.

CSS specifiers (do not guess):

```ts
import "@chameleon-ui/themes/cupertino/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
```

If a `file:` install still misses CSS exports, print a last-resort alias block:

```bash
node ../../scripts/link-external.mjs --print-vite
```

## Dual track

| Track | When |
| :--- | :--- |
| Depend on `@chameleon-ui/components` (this template) | App consumes the React package |
| `chameleon add <slug>` | Copy one component's source via install-core |

Do not mix "I linked five packages" with "I also copied `workspace:*`".

## Height chain

`html, body, #root { block-size: 100% }` is required. AppShell fills its parent. Do not lock the page to a desktop CSS Grid that fights the three-end `Navigation` morph.

## Version matrix

| Package | Pin |
| :--- | :--- |
| Node | ≥ 20.19 |
| `react` / `react-dom` | `^19` |
| `@ark-ui/react` | `5.38.0` (peer of primitives; install at the app root) |
| `intl-messageformat` | `11.2.13` |
| `@formatjs/icu-messageformat-parser` | `3.5.14` |

React 18 is not in the peer range. npm publish (`v0.1.0`) is not done.
