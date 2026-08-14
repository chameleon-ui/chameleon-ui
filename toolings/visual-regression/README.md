# @chameleon-ui/visual-regression

Phase 1 Playwright **baseline + artifact** harness (O4: local/CI only; cloud hosting deferred to 2026-08-28 review).

## Official vs POC

| Target | Port | What it proves | M1 status |
| :--- | :--- | :--- | :--- |
| **Official** `@chameleon-ui/internal-demo` | `http://127.0.0.1:4175` | AppShell + catalog `common10` at 390 / 768 / 1280 with `ar` + `rtl` | **A1.2 / A1.4 evidence** |
| POC Ark preview | `http://127.0.0.1:4173` | Phase 0 Ark playground still renders ar/rtl preview frames | Comparison only. **Not** official 20-component evidence |

Do not treat POC snapshots as proof that `@chameleon-ui/components` is visually green.

## Commands

Build both preview targets first (`ci:phase1` already does `turbo run build`):

```bash
pnpm --filter @chameleon-ui/internal-demo build
pnpm --filter @chameleon-ui/poc-ark-ui build
pnpm --filter @chameleon-ui/visual-regression test:playwright
pnpm --filter @chameleon-ui/visual-regression test:update
```

Snapshots live beside tests under `tests/*-snapshots/`. HTML report + traces on failure → `artifacts/html/`.

## Phase 5 (container-driven + morph)

Official target is still `apps/internal-demo` on `:4175`. New specs reuse this package (no second screenshot farm):

| Spec | URL | What it proves |
| :--- | :--- | :--- |
| `tests/container-driven.spec.ts` | `/?view=lab&lab=narrow` at 1280 viewport and `/?view=lab&lab=wide` at 390 | Container wins over viewport (computed style). Paired PNG names: `narrow-container-wide-viewport` / `wide-container-narrow-viewport`. |
| `tests/p5-whitelist-morph.spec.ts` | `/?view=lab&lab=native` × {390,768,1280} × {en/ltr, ar/rtl} | P5 whitelist morph vs `contract.responsive`: app-shell, dialog, table, action-sheet, sidebar, tab-bar |

Computed-style assertions always run. PNG goldens must come from Playwright `test:update` — never hand-drawn or hash placeholders.

If Chromium cannot capture screenshots in this environment, set `CU_VR_SKIP_SCREENSHOTS=1`. Specs still assert layout; they do not write fake goldens.

## CI

Runs inside `ci:phase1` (`phase1:gates` → `test:playwright`). Not part of `turbo run test`, so it does not collide with `poc-e2e` on port 4173. Failed CI runs upload `toolings/visual-regression/artifacts/` for review.

## Not in scope (Phase 1 remaining)

- Percy/Chromatic cloud compare (review by 2026-08-28)
- Full 20-component screenshot matrix (gallery is demo-only; VR samples AppShell + common-10)
- R1–R3 Lighthouse on the demo (still a sampling stub)
