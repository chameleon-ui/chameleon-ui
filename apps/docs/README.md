# @chameleon-ui/docs

Phase 2 **public docs site** (Docusaurus 3 + MDX). It is not `apps/internal-demo`.

Dogfoods official packages only:

- `@chameleon-ui/components` + `catalog.json` + per-slug `contract.json`
- `@chameleon-ui/themes` / `tokens` / `i18n` / `contract`
- no `poc/` imports

The catalog is live from `catalog.json` (**101** components, **8** themes, **21** product locales). The **docs site UI** has exactly **three** first-class languages: `zh-CN` (default), `zh-HK`, `en`. Product ICU files under `packages/components/**/locales` remain 21; do not treat the docs locale dropdown as the product locale list.

Official homage themes were **cleared by the project owner on 2026-08-13** (owner confirmation, not a third-party legal opinion) and ship as **free** official themes. Do not claim unmeasured recognition rates.

API tables are **not** hand-written. `scripts/generate-component-mdx.mjs` emits one MDX page per catalog slug and a typed contract map; `ComponentPage` reads `packages/components/src/<slug>/contract.json`. Gold 8 (Button / Input / Select / Dialog / Table / Tabs / Form / Card) plus a live MDX set (Accordion / Combobox / Drawer / Pagination / Slider / DatePicker / DataGrid / ChatBubble / Sparkline / ActionSheet) add editable `jsx live` playgrounds in the default (`zh-CN`) docs.

## Commands

From `chameleon-ui/`:

```
corepack pnpm@9.15.0 docs
# http://127.0.0.1:5176
# Simplified Chinese (default):  http://127.0.0.1:5176/
# Traditional Chinese:           http://127.0.0.1:5176/zh-HK/
# English:                       http://127.0.0.1:5176/en/

corepack pnpm@9.15.0 --filter @chameleon-ui/docs build
corepack pnpm@9.15.0 --filter @chameleon-ui/docs preview
# http://127.0.0.1:4176
```

`docusaurus start` serves the **default** locale (`zh-CN`). Other locales are in the production build (or `docusaurus start --locale en` / `--locale zh-HK`). `pnpm run docs` is `turbo run dev --filter=@chameleon-ui/docs` (same start command).

## Routes

| Path | What |
| :--- | :--- |
| `/` | Landing MDX in **zh-CN** (default; no prefix) |
| `/zh-HK/` | Same pages in Traditional Chinese |
| `/en/` | Same pages in English |
| `/components/<slug>` | Generated MDX + contract-driven 9-section page (locale prefixes as above) |
| `/themes` | All 8 official homage theme ids (owner-cleared 2026-08-13; free SKUs) |
| `/schema` | Schema policy |
| `/schemas/component-contract/v0.1.json` | Static GET, no login |
| `/bench` | Metric ids + reproduce command |
| `/install` | CLI CTA (`chameleon add …` → install-core) |
| `/telemetry` | `telemetry-notice.v1` |

Install CTA copies a CLI command. This app does **not** write files.

Navbar locale dropdown labels: **中文** / **繁體** / **English**. Owners 待指定.
