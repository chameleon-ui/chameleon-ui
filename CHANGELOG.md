# Changelog

All notable product cuts for `@chameleon-ui/*`. Manual versioning (no Changesets).

## 0.4.0 — 2026-08-17

Workspace packages are `0.4.0`. No git tag exists yet; `v0.4.0` gets tagged when this cut is committed. Full release notes: [`docs/project/reports/2026-08-17-release-0.4.0.md`](./docs/project/reports/2026-08-17-release-0.4.0.md).

**npm registry:** not published (same auth blocker as 0.2.0). Use `link-external` / `pack-external` / the official Vite templates.

Catalog at this cut: **116 components · 12 blocks · 8 themes · 21 locales**. Includes everything from the superseded 0.3.0 cut (package rename, readable theme ids, `linear` flagship, MaskPaintCanvas zoom, locale backfill) plus:

### New

- **`apple` flagship rebuilt to the Human Interface Guidelines and the iOS system color ramp** (proprietary fonts and icons deliberately excluded; font stack falls back to the platform system font). Light-first with a manual dark scheme. Light ramp — `#FFFFFF` base over the `#F2F2F7` grouped canvas, systemBlue `#007AFF`, label pure black, separator `rgba(60,60,67,0.29)`, the four-step systemFill ramp for selection and hover, systemRed `#FF3B30`. Dark ramp — systemBlue `#0A84FF`, pure-black base with `#1C1C1E` / `#2C2C2E` surfaces, separator `rgba(84,84,88,0.6)`, systemRed `#FF453A`. All chrome uses bar materials (`saturate(180%) blur(20px)`, thick `blur(40px)` on overlays, with a `prefers-reduced-transparency` fallback); pill CTAs with `brightness(1.08)` hover and dim-on-press; radius steps 8/10/14/20px; 17px body, 34px Large Title at 22/17 line-height; 300ms UIKit ease-in-out, no bounce; accent focus halo; flat cards without shadows. Locked by assertions in `test-themes.mjs` alongside `linear`.
- **`tokens.dark.json` build support**: light-first themes can now ship a dark scheme that `$extends` the base tokens and compiles to a `:root[data-color-scheme="dark"]` block — the symmetric counterpart of `tokens.light.json`. `apple` is the first consumer (`defaultColorScheme: "light"`).

### Changed

- **Theme docs**: AGENTS.md, all four READMEs, and the themes package README now describe the dual flagships (`linear` dark-first, `apple` light-first) and the six remaining tribute overlays.

### 中文摘要

- apple 旗舰按 HIG 与 iOS 系统色板重做（不含字体和图标）：浅色优先、可手动切深色。浅色基底 #FFFFFF、分组画布 #F2F2F7、systemBlue #007AFF（深色 #0A84FF）、separator rgba(60,60,67,0.29)、systemFill 四档梯度负责选中和 hover、systemRed #FF3B30（深色 #FF453A）；所有外壳走 bar 材质（saturate(180%) blur(20px)），药丸按钮 hover 提亮 8%、按压变暗，圆角 8/10/14/20，正文 17px、Large Title 34px（行高 22/17），动效 300ms UIKit ease-in-out，accent 焦点光晕，卡片无阴影。与 linear 一样写进了测试断言。
- 主题构建新增 `tokens.dark.json` 分支：浅色优先的主题可以用它提供深色方案（继承基础 token 后翻转色板、文字、阴影），与 `tokens.light.json` 对称。apple 是第一个使用者。
- 0.3.0 的内容（包改名、主题 id 改名、linear 旗舰、MaskPaintCanvas 缩放、21 语言补齐）全部包含在本切割内；0.3.0 未打 tag，由 0.4.0 取代。
- npm 仍未发布。接入走 tarball、`npm link` 或官方 Vite 模板。

## 0.3.0 — 2026-08-16

Internal version bump only. Superseded by **0.4.0** before any commit or git tag; kept here as the record of what landed during that development phase. Full release notes: [`docs/project/reports/2026-08-16-release-0.3.0.md`](./docs/project/reports/2026-08-16-release-0.3.0.md).

### Breaking

- **Package rename**: `@chameleon-ui/components` → `@chameleon-ui/components-react`, symmetric with `components-vue`. Imports through the umbrellas (`@chameleon-ui/react` / `@chameleon-ui/vue`) do not change.
- **Theme ids renamed to readable names**: `line` → `linear`, `silver-arrow` → `mercedes`, `stuttgart` → `porsche`, `corsa` → `ferrari`, `cupertino` → `apple`, `siren` → `tiktok`, `ant-blue` → `alipay`. `wechat` is unchanged. Update `theme="…"` props, `@chameleon-ui/themes/<id>/css` subpath imports, and any `data-theme` selectors.

### New

- **Manual dark / light switching**: `ThemeProvider` takes `colorScheme="dark" | "light"` on React and Vue, and writes `documentElement.dataset.colorScheme`. A dark-first theme ships its light scheme as `tokens.light.json`; a light-first theme ships `tokens.dark.json`. Both `$extends` the base tokens and flip surfaces, text, and shadow, compiling to a `:root[data-color-scheme="…"]` block. Without the prop each theme keeps its default — `linear` defaults to dark, `apple` to light.
- **`linear` flagship rebuilt from Linear's own CSS** (linear.app `Button.css` + the app loading screen; fonts and icons deliberately excluded): canvas `#121213` under darker `#09090a` chrome, elevated surfaces `#1c1c1d`; pill CTAs with `brightness(1.15)` hover, `scale(.97)` press, `opacity .5` disabled; focus ring `#7180ff` at 3px offset; ease-out-quad / ease-in-out-quad curves at 100/160ms. `packages/themes/scripts/test-themes.mjs` locks these values with assertions.
- **`apple` flagship rebuilt to the Human Interface Guidelines and the iOS system color ramp** (proprietary fonts and icons deliberately excluded): light-first with a manual dark scheme. Light ramp — `#FFFFFF` base over the `#F2F2F7` grouped canvas, systemBlue `#007AFF`, label pure black, separator `rgba(60,60,67,0.29)`, the systemFill ramp (`rgba(120,120,128,0.2…0.08)`) for selection and hover, systemRed `#FF3B30`. Dark ramp — systemBlue `#0A84FF`, pure-black base with `#1C1C1E` / `#2C2C2E` surfaces, separator `rgba(84,84,88,0.6)`, systemRed `#FF453A`. All chrome uses bar materials (`saturate(180%) blur(20px)`); pill CTAs with `brightness(1.08)` hover and dim-on-press; radius steps 8/10/14/20px; 17px body, 34px Large Title at 22/17 line-height; 300ms UIKit ease-in-out; accent focus halo; flat cards without shadows. Locked by assertions in `test-themes.mjs` alongside `linear`.
- **MaskPaintCanvas zoom** (React + Vue): `zoom` / `minZoom` / `maxZoom` / `wheelZoom` props, `zoomIn` / `zoomOut` / `resetZoom` / `setZoom` / `getZoom` handles, zoom-change events, pan with middle mouse or Space + drag.
- **Locale backfill**: 2,493 placeholder values (Phase 6 scaffolding mirrored English into 17 locales; newer components also missed `zh-CN` / `de` / `ar`) replaced with authored translations across all 21 locales. `pnpm --filter @chameleon-ui/i18n audit:locales` now guards this — 116 components × 21 locales, no missing keys, no English mirrors.

### Changed

- **NavigationTitle rename**: `NavigationBar` → `NavigationTitle` (slug `navigation-title`) so stack chrome is not confused with `Navigation` (destinations). `NavigationBar` / `navigation-bar` remain deprecated aliases (export + contract path); CSS keeps dual classes during the transition.
- **App chrome**: `TitleBar` (brand header) lives in Navigation `header` / `#header`; `NavAccountCard` (account + logout) in Navigation `footer` / `#footer`, suppressing the collapse toggle; both are sidebar-only and hide on compact TabBar. First-class `Footer` for AppShell attribution with `footerPlacement` `auto`|`shell`|`main`. Sidebar scroll contract: only Navigation `__list` scrolls.
- **Layout**: WorkspaceSplit morphs through an inner `__frame` with container queries; optional `tools` pane; `scrollMode` `shell`|`panes`|`none` (default `shell`, with AppShell `__main` as the single scroll owner). AppShell is full-bleed; phones never keep a side rail; three panes need an 80rem main.
- **Checkerboard**: `CheckerboardSurface` / `ImageCompare` / `MaskPaintCanvas` share the `--cu-checkerboard-a/b` tokens. Component defaults raised to 40%/5% (`strong` 56%/4%); `linear` sets its own dark-canvas mixes (30%/6%, `strong` 46%/5%). MaskPaintCanvas letterbox uses a distinct stage fill so the contain-fit silhouette stays readable.
- **Stack + ButtonGroup**: Stack `align="start"` applies real CSS (was stuck on stretch), plus class modifiers and `grow`. `ButtonGroup` (`attached`/`spaced`) for segmented tool toggles.
- **Docs**: architecture decision records under `docs/decisions/` (package manager, dual-framework split, Ark UI foundation). AI and theming docs rewritten in 简体中文 with factual corrections (8 official themes, catalog 116, intent vocabulary 78).

### 中文摘要

- 包改名：`@chameleon-ui/components` 改为 `@chameleon-ui/components-react`，和 `components-vue` 对称。走伞包（`@chameleon-ui/react` / `@chameleon-ui/vue`）的引用不受影响。
- 8 个主题 id 改成可读名字：linear、mercedes、porsche、ferrari、apple、tiktok、wechat、alipay。旧 id 不再存在，`theme` 属性和 CSS 子路径都要跟着改。
- 深浅色支持手动切换：ThemeProvider 新增 `colorScheme`，双端一致。深色优先的主题用 `tokens.light.json` 提供浅色方案，浅色优先的主题用 `tokens.dark.json` 提供深色方案，都继承基础 token 后只翻色板、文字和阴影。不传该属性就用主题默认：linear 默认深色，apple 默认浅色。
- linear 旗舰按 Linear 官方 CSS 重做（营销站 Button.css 和 app 加载页，不含字体和图标）：主画布 #121213、侧栏 #09090a、药丸按钮、hover 提亮 15%、按压缩到 0.97、焦点环 #7180ff。这些值已写进测试断言，回归会拦。
- apple 旗舰按 HIG 与 iOS 系统色板重做（不含字体和图标）：浅色优先、可手动切深色。浅色基底 #FFFFFF、分组画布 #F2F2F7、systemBlue #007AFF（深色 #0A84FF）、label 纯黑、separator rgba(60,60,67,0.29)、systemFill 梯度负责选中和 hover、systemRed #FF3B30（深色 #FF453A）；所有外壳走 bar 材质（saturate(180%) blur(20px)），药丸按钮 hover 提亮 8%、按压变暗，圆角 8/10/14/20，正文 17px、Large Title 34px（行高 22/17），动效 300ms UIKit ease-in-out，accent 焦点光晕，卡片无阴影。与 linear 一样写进了测试断言。
- MaskPaintCanvas 支持缩放与平移，React 和 Vue 的 API 一致。
- 21 语言补齐：Phase 6 脚手架曾把 17 个 locale 直接镜像英文，新组件连 zh-CN/de/ar 也是英文。这轮人工翻译回填了 2,493 条，`pnpm --filter @chameleon-ui/i18n audit:locales` 可持续检查（116 组件 × 21 语言，无缺键、无英文镜像）。
- 其余是本轮早些时候的外壳与布局工作：NavigationBar 改名 NavigationTitle、侧栏品牌头与账号卡、AppShell Footer、三端一体形态切换、棋盘格 token 化。
- npm 仍未发布。接入走 tarball、`npm link` 或官方 Vite 模板。

## 0.2.0 — 2026-08-15

First **product** version intended for external consume. Workspace packages are `0.2.0`. No git tag was created for this cut (newest tag in the repo remains `v0.1.9`); the git history around 2026-08-15 is the record.

This cut predates the 0.3.0 renames: `line` below is today's `linear`, and `components` is today's `components-react`.

**npm registry:** not published. Publish is blocked on npm auth policy (2FA / granular token with bypass). Verified login alone is not enough (`E403`). Until `npm view @chameleon-ui/tokens version` returns a version, use `link-external` / `pack-external` / official Vite templates.

### 中文摘要

- **line 旗舰视觉**：加深 line 主题（暖色画布、纸质轨、细线 chrome）；核心 token 增加 space 4–6、`fg.muted`、motion、字重/字距；street ProductStudio 默认演示 + AppShell 单滚动条修复。
- **Vue 103/103**：`@chameleon-ui/components-vue` 目录全量对齐 React；消费路径修复（per-slug 导出、Toast、SchemaRenderer/vue、模板双挂载等）；官方 `templates/external-vite-vue`。
- **主题工程量化**：七套致敬主题补齐可度量表面；报告内 `recognition_rate=null`（≠ 认出率）。
- **盲测操作包**：capture / validate / ingest / `demo:blind`；A9.5 为 **PROTOCOL-READY**，禁止编造 ≥80%。
- **A11y CAB 提交包**：证据与 blocker 文档齐全；**无**第三方认证 / 假证书；`commercialClaimsAllowed=false`。
- **外部接入一等公民**：`verify:external`（含 build）、`pack-external` / `link-external`；React + Vue 官方模板钉在 0.2.0。
- **源码**：npm 包中 `components` / `components-vue` / `blocks` 带 `src`；其余多为 `dist`。整仓源码 zip：`pnpm pack:source`。

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
# → dist-release/chameleon-ui-<version>-source.zip
```

Per-package tarballs (built `dist`, not full monorepo): `node ./scripts/pack-external.mjs` (`--vue` for the Vue graph).

---

## 0.1.0 — 2026-08-15 (unpublished cut)

Internal version bump only. Superseded by **0.2.0** before any registry publish. Landed line flagship depth, street demo / scroll fix, ThemeProvider, and React consume DX (`templates/external-vite-react`, link/pack scripts). See git commit `f5391cb`.
