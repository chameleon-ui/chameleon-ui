# Phase 1 · 开工检查一页纸

> 前提：先读 [`M0-基元POC与地基验收.md`](./M0-基元POC与地基验收.md) 和 [`../phases/Phase-1-MVP.md`](../phases/Phase-1-MVP.md)。本页只用于复现 M0 地基，不替代 Phase 1 主卡。  
> 本仓库是本地研发仓。预算批复、项目所有者签字、GitHub remote / Actions 不作为技术开工条件。

## 锁定项

| 项 | 结论 |
| :--- | :--- |
| Headless | **Ark UI**；Base UI 仅留 `poc/base-ui` 证据，正式包禁止混用 |
| Token | Style Dictionary 4.x + DTCG + 确定性薄层 |
| Monorepo | pnpm 9.15.0 + Turborepo |
| 视觉回归 | Phase 1 本地/CI Playwright baseline + artifact；2026-08-28 前复审云托管 |
| 正式路径 | `packages/primitives`、`packages/components/src/<kebab-name>/` |
| 契约单源 | 正文在组件目录；`packages/contract` 只放 schema 与校验/codegen |
| M0 技术状态 | **已通过**。A0.1–A0.6 本地全检齐；研发侧可以进入 Phase 1 编码 |

## 先复现 M0

在 `chameleon-ui/`：

```bash
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 ci:phase0
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens build
corepack pnpm@9.15.0 --filter @chameleon-ui/contract test
corepack pnpm@9.15.0 --filter @chameleon-ui/stylelint-config test
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-e2e test
```

任一命令失败，不进入 Phase 1 编码。

## Phase 1 开工前逐项确认

- [x] M0 技术复核完成；A0 豁免项为空。预算与业务签字不纳入研发开工门禁。
- [x] 本地仓库已提交 Phase 0 基线。A0.3 以本地 fixture + `ci:phase0` 为证据；workflow 已就位，有 remote 后可再跑 Actions，不阻断开工。
- [x] 已读 [`../../engineering/RTL与图标镜像工程规范.md`](../../engineering/RTL与图标镜像工程规范.md)，Icon contract 采用 `mirror | preserve | localized` 策略。
- [ ] `packages/primitives` 只引入 Ark/Zag；移除 `status: pending-M0` 时在同一提交写明正式 API。
- [ ] 按 Phase 1 主卡创建 `i18n`、`registry`、`cli`、`mcp-server`，先补 README/package.json 并更新 `STRUCTURE.md`。
- [ ] 冻结 20 组件与 S5“常用 10”名单；换项必须走变更单。
- [ ] 创建 `benchmarks/budgets.json`；接入 `perf:size`，对 S1/S3/S4 执行 CI 硬门禁。
- [ ] 接入 Playwright baseline/artifact 与 `perf:lhci`；S5/R1–R3 先抽检。
- [ ] 正式 Button/Input/Dialog 按 `实现 + styles + contract + locales + tests` 迁入，不复制 Base POC。
- [ ] `install-core` 才开始实现 C6 安装图、冲突检测、幂等写入和可关闭遥测；CLI/MCP 只调用内核。
- [ ] `ar` RTL、伪本地化、德语膨胀、U1–U9 与物理方向 CSS 全部进入主 CI。
- [ ] 2026-08-28 前复审视觉回归云托管并在报告中裁定。

## 禁止带入 Phase 1 的债

- 禁止 Ark/Base 双底座进入正式包。
- 禁止把 POC 的 ICU/40% 伪本地化骨架退回对象字典或 `replaceAll`；正式共享包在 Phase 1 迁入。
- 禁止把 POC 整站 gzip 当成 S1 组件预算。
- 禁止在 contract 包复制组件契约正文。
- 禁止 CLI/MCP 自行写盘，或在未告知/不可关闭时发遥测。
- 禁止因赶进度绕过逻辑属性、RTL、伪本地化、性能和 a11y 门禁。
