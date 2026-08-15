# Contributing to Chameleon UI

Library checkout. Installable code lives in `chameleon-ui/packages/*`.
Do not run `pnpm install` at the workspace root.

## Commands

From `chameleon-ui/`, with Corepack pnpm 9.15.0 on `PATH`:

```
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 check
corepack pnpm@9.15.0 publish:check
corepack pnpm@9.15.0 ai:check
corepack pnpm@9.15.0 verify:external
```

`install-core` is the only disk writer for CLI, MCP, and adapters.
Do not add a second install path. Protocol mapping belongs in `packages/adapter-*`, not L1/L2.

## Version and publish

- Packages are **0.2.0** (unpublished). This repo does not npm publish until maintainers freeze.
- Use `pnpm publish:check` for the local dry-run.
- Until registry publish, external apps use `link-external` / `pack-external` / official Vite templates.
- Prefer **one** umbrella: `@chameleon-ui/react` **or** `@chameleon-ui/vue`. Never both.
- Do not invent recognition rates or accessibility certification claims.

## Scope

Do not expand `catalog.json` (components / themes / locales) without a dated note.
Do not add inner `apps/*` to prove library health.
