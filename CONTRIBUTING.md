# Contributing to Chameleon UI

This is a local R&D monorepo. The installable code lives in `chameleon-ui/`.
Do not run `pnpm install` at the workspace root.

## Commands

From `chameleon-ui/`, with Corepack pnpm 9.15.0 on `PATH`:

```
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 ci:phase1
corepack pnpm@9.15.0 ci:phase2
corepack pnpm@9.15.0 ci:phase3
corepack pnpm@9.15.0 demo
corepack pnpm@9.15.0 docs
corepack pnpm@9.15.0 studio
corepack pnpm@9.15.0 bench:genui
```

`install-core` is the only disk writer for CLI, MCP, adapters, and any docs-site install CTA.
Do not add a second copy/install path.

## Version and publish

- First public tag: `v0.1.9` (packages are `0.1.9`; this repo still does not npm publish).
- Manual git tag, not Changesets. `pnpm publish -r` is for non-private packages only.
- Do **not** run `npm publish` / `pnpm publish` from this machine until maintainers
  freeze the version. Use `pnpm publish:check` for the local plan.
- `workspace:*` dependencies are rewritten to concrete versions by pnpm at publish time.
  Until a registry publish, an external npm app must `npm link` **all** runtime packages
  (`tokens`, `i18n`, `primitives`, `themes`, `components`). Linking only
  `@chameleon-ui/components` fails because npm cannot resolve `workspace:*`.
  From `chameleon-ui/`: `node ./scripts/link-external.mjs`.
- Official homage theme ids (`line`, `silver-arrow`, `stuttgart`, `corsa`,
  `cupertino`, `siren`, `wechat`, `ant-blue`) were **cleared by the project owner
  on 2026-08-13** (owner confirmation, not a third-party legal opinion). They ship
  as **free** official themes. Community marketplace packs may be free or paid.
  Do not write “looks like Apple/Microsoft” as an official brand kit, and do not
  claim unmeasured “一眼认出 ≥80%”.

## Scope

Do not expand the frozen `catalog.json` lists without a dated change note.
