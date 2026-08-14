# @chameleon-ui/internal-demo

Phase 2 **inner** demo (T1.10, inventory expanded). It is not `apps/docs` and not a public docs site.

Renders the official stack only:

- `@chameleon-ui/components` (frozen 50; gallery still dogfoods the Phase 1 set plus AppShell)
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

## URLs

| Path | What |
| :--- | :--- |
| `/` | Full-window live gallery shell. Resize the browser: phone TabBar / tablet sidebar+TabBar / desktop sidebar. No device clicker. |
| `/?locale=ar&theme=line` | Arabic + RTL (`dir` comes from language) |
| `/?view=suite&locale=ar&theme=line` | AppShell + catalog `common10` (official visual-regression target) |
| `/?view=lab&lab=narrow\|wide\|native` | Phase 5 container-driven lab (A5.3 pairing + P5 morph matrix) |
| `/?view=three-end` | One live filling three-end shell. Drag ~390 → 768 → 1280. Optional `<details>` 演示冻结 (closed) keeps 390/768/1280 iframes for VR. |
| `/?view=blind` | Human theme-recognition blind test (8 homage themes × 2). No theme name in chrome; URL has no `theme=`. Export JSON locally. Does **not** by itself satisfy 「一眼认出 ≥80%」. |

## Visual regression

Official Playwright snapshots hit **this app** on port **4175**. POC Ark snapshots stay on **4173** and are comparison-only. See `toolings/visual-regression/README.md`.
