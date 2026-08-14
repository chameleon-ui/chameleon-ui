# Chameleon UI 文档标准（Docs Standard） / Docs Standard

> 状态：v1.0 · 2026-08-13 · 强制（normative）。适用对象：`chameleon-ui/apps/docs` 公开文档站全部页面。
> Benchmark：antd / MUI / shadcn 组件文档。本标准是验收尺，不是建议。
> 数字与措辞纪律：不伪造数据；未测量项写 `—` 或标注“未测量”；owner 一律 `待指定`。

## 0. 目的 / Why

文档站是出海门面。当前问题（2026-08-13 审计事实）：

- 左侧导航扁平、组件页为一句话描述 + 暗色占位块（`文档开发中`），连 Button 都没有示例与 Props 表。
- 首页是单段 Getting Started 文本，不是落地页。
- 契约数据（`contract.json`）已经齐全（50/50），但文档没有消费它 → 文档与实现脱节。

本标准定义**每个组件页必须具备的结构**、**信息架构（IA）规范**、以及**数据单一来源（SSOT）机制**。

## 1. 每组件文档结构（必备节） / Per-component template

每个组件页按以下顺序渲染，缺节即不合格。标 ★ 的节由 `contract.json` 自动生成（见 §3），禁止手抄。

1. **标题 + 一句话用途** — 组件名 + `contract.purpose` ★（what/why，一句话，禁止营销词）。
2. **工作原理** ★ — `contract.mechanics`；缺省时由 purpose + `responsive.strategy` + composition/platforms 合成。说明 morph、状态与配对，不是 Demo 口吻。
3. **用法** ★ — 合法 `import { Name } from '@chameleon-ui/components'` + 由必填 props/事件合成的最小代码 + `contract.usage` 步骤（缺省则由 required props / events / scenarios 合成）+ `scenarios`（何时用）+ `antiPatterns`（何时不用）。
4. **交互示例** — live preview，渲染**真实组件**（`@chameleon-ui/components`）。禁止静态暗色占位框。无 playground 时仍须有合成代码，并标注 preview pending。
5. **代码示例** — 可复制代码块：import + 最小用法 + 常见组合。无手写 snippet 时用契约合成。
6. **API** ★ — Props（非 event）、**Events**（`type: event`，含 payload 签名）、**Exports**（component / hook / function / type）、Variants、States。全部来自 `contract.props` / `contract.exports` / `contract.variants` / `contract.states`。
7. **组合** ★ — `contract.composition`：allowedParents / allowedChildren / requiredContext。
8. **编码 Agent** ★ — MCP `get_contract` / `search_components` / `get_import_specifiers` 配方、生成约束、`contract.dataAi`（role / states / intents）。禁止 `workspace:*` 与源码相对导入。
9. **无障碍** ★ — `contract.a11y`：role、键盘交互、focus、labeling、WCAG 条款。
10. **三端行为** ★ — `contract.responsive`：compact / medium / large 三档差异。
11. **RTL 行为** ★ — `contract.rtl`：strategy、mirroredValues。
12. **平台** ★ — `contract.platforms`：web / React / Vue。
13. **设计 token 引用** — `--cu-color-*` / `--cu-space-*` 族，不逐条罗列不存在的 token。
14. **安装 CTA** — `chameleon add <slug>`（install-core）。

编码 Agent 的产品规范在 `docs/guides/for-agents.mdx`（三语文档站）与仓库 `chameleon-ui/AGENTS.md`。禁止把内测 Demo 操作说明当成 Agent 文档。

## 2. 信息架构（IA）规范 / Nav & IA

- **导航按 §7.2 八族分组**（来源：`Chameleon UI — 综合可行性研究报告 v3.0.md` §7.2），禁止扁平长列表：
  - **A · 基础与布局 / Foundations & Layout**：button, icon, typography, divider, stack, grid, app-shell, separator, heading, label, kbd, link…
  - **B · 导航 / Navigation**：drawer, breadcrumb, tabs, pagination, menu…
  - **C · 数据录入 / Data Entry**：input, textarea, number-input, select, combobox, checkbox, radio, radio-card, switch, slider, file-input, form…
  - **D · 数据展示 / Data Display**：table, list, card, badge, chip, avatar, description-list, empty-state, skeleton, progress…
  - **E · 反馈 / Feedback**：alert, inline-alert, toast, dialog, sheet, popover, tooltip, hover-card, spinner…
  - **F · 可视化 / Visualization**（0 组件，P6 交付）
  - **G · 画布与图形 / Canvas & Graph**（0 组件，P6 交付）
  - **H · 内容与协作 / Content & Collaboration**（0 组件，P6 交付）
  - 族→slug 映射的 SSOT 是 `apps/docs/src/families.ts`（sidebar 按八族分组）；族在组件数为 0 时显示“规划中 / planned”，不得隐藏（诚实呈现路线图）。
- **Chrome 可本地化**：导航标签（含族名）走 ICU 消息（`docs.family.*`）。**文档站一等语言为 `zh-CN`（默认，无 URL 前缀）/ `zh-HK`（`/zh-HK/`）/ `en`（`/en/`）**，三种均为撰稿译文。产品组件 ICU 仍为 21 Locale（`packages/components/**/locales`）；文档站 locale 下拉不是产品 Locale 列表。
- **搜索**：侧边栏提供过滤框，按组件名/slug 过滤。
- **面包屑**：组件页顶部 `Components / <Family> / <Name>`。
- **首页 = 真正的落地页**：价值主张、安装命令、快速开始、主题/语言展示、库存数字（实数，来自 `catalog.json`）。禁止单段文本。

## 3. 单一来源（SSOT）机制 / How API tables stay in sync

- **唯一事实源**：每个组件的 `packages/components/src/<slug>/contract.json`（schema v0.1，`@chameleon-ui/contract` 校验）。
- **加载方式**：`apps/docs/scripts/generate-component-mdx.mjs` 在 collect/build 时把全部 `contract.json` 打进 `src/generated/contracts.ts`，并为每个 catalog slug 生成 `docs/components/<slug>.mdx`。`ComponentPage` 只读这份 map（禁止手抄 props）。无运行时 fetch、无 loading 闪烁；组件契约一改，重新构建即更新，**不会漂移**。
- **禁止手抄**：props/events/exports/variants/states/a11y/responsive/rtl/antiPatterns/mechanics/usage 一律从 contract 读。页面代码里只允许写：示例代码（examples）、族映射（families）、chrome 文案（locales）。
- 旧路径 `/contracts/<slug>.json` 运行时 fetch 已废弃（保留 `collect-public.mjs` 的产物供外部消费者使用，但页面不再消费）。

## 4. 内容纪律 / Content rules

1. 无假内容：示例必须渲染真实组件、真实 props；代码块必须可复制且能编译。
2. 契约字段为英文时（schema v0.1 现状），英文 Locale 直接渲染；zh-CN / zh-HK 下正文骨架照常渲染，契约正文保持英文并显式标注“契约正文为英文（LEGACY-2026-017）”——不许假装已翻译。
3. 未实现（F/G/H 族）显示“规划中”，不隐藏、不虚构。
4. 首页数字全部来自 `catalog.json` 实测（当前 v2.0 为 101 / 8 / 21 产品 Locale），不是目标数。文档站界面语言为 3 个（zh-CN / zh-HK / en）。

## 5. 验收清单 / Acceptance checklist

- [x] 每个组件页必备节齐备（工作原理、用法、API/事件/导出、编码 Agent；金标 8 个组件全量 live MDX，其余 slug 走同一模板；playground 未就绪时仍有合成用法与契约 API）。
- [x] API 表 100% 来自 contract.json（grep 页面代码无手抄 props）。
- [x] 导航八族分组 + 族名中英翻译 + 搜索 + 面包屑。
- [x] 首页为落地页（value prop + install + quick start + 主题/locale 展示）。
- [x] `pnpm --filter @chameleon-ui/docs build` 绿；`vitest run` 绿。
- [x] 文档站 3 语（zh-CN / zh-HK / en）结构均渲染；产品 ICU 仍为 21 Locale。

## 6. 路线图 / Plan

| 批次 | 范围 | 状态 |
| :--- | :--- | :--- |
| 批次 1（本次） | 模板 + SSOT 加载 + Button/Input/Select/Dialog/Table/Tabs/Form/Card 金标 | ✅ 已交付 |
| 批次 1b | 手写 Vite SPA → Docusaurus 3 + MDX（101 slug 页 + live 金标） | ✅ 已交付 |
| 批次 2 | 其余组件的 playground 示例补齐（结构已由模板自动渲染） | 待排期 · owner 待指定 |
| 批次 3 | F/G/H 族 playground（组件已在 catalog；契约 API 已出页） | 待排期 · owner 待指定 |
| 批次 4 | 契约正文 21 语翻译（LEGACY-2026-017） | ETA 2026-09-30 · owner 待指定 |
