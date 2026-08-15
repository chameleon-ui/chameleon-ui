# @chameleon-ui/internal-demo

Phase 2 **inner** demo (T1.10, inventory expanded). It is not `apps/docs` and not a public docs site.

Renders the official stack only:

- `@chameleon-ui/components` (full catalog gallery; street studio + blocks + three-end)
- `@chameleon-ui/primitives` (via those components; Ark is not imported here)
- `@chameleon-ui/themes` (all 8: `line` / `silver-arrow` / `stuttgart` / `corsa` / `cupertino` / `siren` / `wechat` / `ant-blue`)
- `@chameleon-ui/i18n` (`PHASE_2_LOCALES` × 21; chrome translated for `zh-CN` / `en` / `de` / `ar`, others fall back to English chrome; `dir` from language)

## Commands

From `chameleon-ui/`:

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/internal-demo dev
# http://127.0.0.1:5175

corepack pnpm@9.15.0 --filter @chameleon-ui/internal-demo build
corepack pnpm@9.15.0 --filter @chameleon-ui/internal-demo preview
# http://127.0.0.1:4175
```

Root alias: `corepack pnpm@9.15.0 demo`

Blind harness (8 themes × 2, local JSON export):

```bash
corepack pnpm@9.15.0 demo          # terminal A
corepack pnpm@9.15.0 demo:blind    # terminal B — opens /?view=blind
# or: corepack pnpm@9.15.0 demo:blind -- --with-demo

corepack pnpm@9.15.0 blind:validate -- --dry-run-format
corepack pnpm@9.15.0 blind:ingest -- path/to/盲测结果.<testerId>.json
```

Operator kit (repo root): `docs/project/reports/2026-08-15-blind-test-operator-kit.md`. Session scores are **not** published recognition rates.

## URLs

| Path | What |
| :--- | :--- |
| `/` | Product studio (street). Inspector **Map** jumps to catalog / blocks / three-end / suite / blind. |
| `/?locale=ar&theme=line` | Arabic + RTL (`dir` comes from language) |
| `/?view=gallery` | Full catalog by family |
| `/?view=blocks` | Phase 7 twelve scenario blocks |
| `/?view=three-end` | Full three-end playground (resize morph). Legacy `?view=live` redirects here. |
| `/?view=suite&locale=ar&theme=line` | AppShell + catalog `common10` (official visual-regression target; no inspector chrome) |
| `/?view=lab&lab=narrow\|wide\|native` | Phase 5 container-driven lab (VR; URL-only) |
| `/?view=blind` | Human theme-recognition blind test. Escape via **Back to studio**. |
| `/?view=three-end-stage&end=phone\|tablet\|desktop` | Iframe/VR stage only |

## Visual regression

Official Playwright snapshots hit **this app** on port **4175**. POC Ark snapshots stay on **4173** and are comparison-only. See `toolings/visual-regression/README.md`.
