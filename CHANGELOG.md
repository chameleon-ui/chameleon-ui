# Changelog

All notable product cuts for `@chameleon-ui/*`. Manual versioning (no Changesets).

## 0.2.0 — 2026-08-15

First **product** version intended for external consume. Workspace packages are `0.2.0`. Tag: `v0.2.0`.

**npm registry:** not published. Publish is blocked on npm auth policy (2FA / granular token with bypass). Verified login alone is not enough (`E403`). Until `npm view @chameleon-ui/tokens version` returns `0.2.0`, use `link-external` / `pack-external` / official Vite templates. Details: [`docs/project/reports/2026-08-15-npm-publish-blocker.md`](../docs/project/reports/2026-08-15-npm-publish-blocker.md). Full notes: [`docs/project/reports/2026-08-15-release-0.2.0.md`](../docs/project/reports/2026-08-15-release-0.2.0.md).

### 中文摘要

- **line 旗舰视觉**：加深 line 主题（暖色画布、纸质轨、细线 chrome）；核心 token 增加 space 4–6、`fg.muted`、motion、字重/字距；street ProductStudio 默认演示 + AppShell 单滚动条修复。
- **Vue 103/103**：`@chameleon-ui/components-vue` 目录全量对齐 React；消费路径修复（per-slug 导出、Toast、SchemaRenderer/vue、模板双挂载等）；官方 `templates/external-vite-vue`。
- **主题工程量化**：七套致敬主题补齐可度量表面；报告内 `recognition_rate=null`（≠ 认出率）。
- **盲测操作包**：capture / validate / ingest / `demo:blind`；A9.5 为 **PROTOCOL-READY**，禁止编造 ≥80%。
- **A11y CAB 提交包**：证据与 blocker 文档齐全；**无**第三方认证 / 假证书；`commercialClaimsAllowed=false`。
- **外部接入一等公民**：`verify:external`（含 build）、`pack-external` / `link-external`；React + Vue 官方模板钉在 0.2.0。
- **源码**：npm 包中 `components` / `components-vue` / `blocks` 带 `src`；其余多为 `dist`。整仓源码 zip：`pnpm pack:source` → `dist-release/chameleon-ui-0.2.0-source.zip`；或 `git checkout v0.2.0`。

### English summary

- **line flagship depth** + core tokens (space 4–6, muted, motion, type); street ProductStudio demo and AppShell scroll fix (from the unpublished 0.1.0 cut, carried into 0.2.0).
- **Vue catalog 103/103** + consume-path fixes + official Vue Vite template.
- **Theme quantification** for seven tribute overlays; rates stay `null`.
- **Blind-test operator kit**; A9.5 **PROTOCOL-READY** — no invented recognition rates.
- **A11y CAB submission pack** — no fake certification.
- **verify:external** + pack/link as first-class pre-registry path.
- **Source:** package `files` include `src` for components graphs that ship it; monorepo zip via `pnpm pack:source`. **npm publish still auth-blocked.**

### Source artifact

```bash
cd chameleon-ui
node ./scripts/pack-source.mjs
# → dist-release/chameleon-ui-0.2.0-source.zip
```

Also: `git checkout v0.2.0` (or clone at that tag). Per-package tarballs (built `dist`, not full monorepo): `node ./scripts/pack-external.mjs` (`--vue` for Vue graph).

---

## 0.1.0 — 2026-08-15 (unpublished cut)

Internal version bump only. Superseded by **0.2.0** before any registry publish. Landed line flagship depth, street demo / scroll fix, ThemeProvider, and React consume DX (`templates/external-vite-react`, link/pack scripts). See git commit `f5391cb`.
