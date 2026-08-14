# Phase 1 · MVP 看板（建设期）

> 完整目标卡见 [`../docs/project/phases/Phase-1-MVP.md`](../docs/project/phases/Phase-1-MVP.md)。  
> 收口报告：[`../docs/project/reports/M1-MVP验收.md`](../docs/project/reports/M1-MVP验收.md)。  
> 冻结清单：[`packages/components/catalog.json`](./packages/components/catalog.json)。  
> 全阶段约定：[`../docs/engineering/工程约定与命名规范.md`](../docs/engineering/工程约定与命名规范.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 同步说明 2026-08-13

看板此前只有两周勾选与一段「集成关闭备注」，缺少命令 / 红线 / 明确未做 / 合入检查，相对 PHASE5+ 偏薄。本次按 P5+ 骨架补齐章节，勾选仍以 M1 关闭时为准（W2/W3 全 `[x]`）；原关闭备注迁入红线 / 明确未做，**不改 DoD**。**这是文档同步，不是重新验收或重关 M1。** Owner 一律 **待指定**。未补缺件，未 git commit。

## 看板

```
W2  [x] 20 清单冻结  [x] i18n 包  [x] primitives 去 pending-M0  [x] Button/Input/Dialog 迁入
    [x] budgets.json + perf:size（S1/S3/S4 硬门禁 + S5 实测）  [x] 三主题  [x] 装组件（registry 20+3 / cli / mcp）
W3  [x] #13–20 填实  [x] 联装主题  [x] 回流（默认 off，CU_TELEMETRY=1 可见）
    [x] ar 回归（官方=内测 Demo AppShell+common-10；POC Ark 仅对照）
    [x] 内测 Demo  [x] 法务走查启动  [x] M1 报告
```

## 命令

```
corepack pnpm@9.15.0 demo             # http://127.0.0.1:5175 内测 Demo
corepack pnpm@9.15.0 ci:phase0        # 地基回归
corepack pnpm@9.15.0 phase1:gates     # 德语膨胀 / CSS / VR / perf:size / perf:lhci
corepack pnpm@9.15.0 ci:phase1        # = ci:phase0 + phase1:gates
corepack pnpm@9.15.0 perf:size        # S1/S3/S4 硬门禁 + S5 抽检
corepack pnpm@9.15.0 perf:lhci        # 当时只打印预算，无 Lighthouse 分数
```

## 红线

- 冻结范围：20 组件 / 3 主题 / 4 Locale；**不做** 45–50、八主题、21 语、Bench 公开发布、A2UI、工作台。
- 写盘只经 `install-core`；CLI/MCP 禁止第二套 fs。
- 禁止用 POC 整站 gzip 冒充 S1；peer（react / `@ark-ui/*` / `@zag-js/*`）外置。
- 遥测默认关；`CU_TELEMETRY=0` 时无外发。
- 其余 5 主题 **禁止**空壳冒充；只文档预留 id。
- 官方 VR = `apps/internal-demo`（`:4175`）AppShell+common-10；POC Ark（`:4173`）快照**不是**正式 20 组件证据。

## 明确未做（禁止伪造）

- 45–50 组件 / 8 主题 / 21 语 / `apps/docs` / GenUI-Bench 公开发布（→ P2）
- A2UI / 工作台 / 主题市场（→ P3–P4）
- R1–R3 Lighthouse 分数：`perf:lhci` 只打印预算，**无分数**（→ 后由 P9 T9.1 / LEGACY-2026-001…003）
- 云 VR（Percy/Chromatic）未启用；O4 仍是本地/CI Playwright
- 全量 20×三断点像素矩阵未做；A1.2 只要求抽检（官方 VR 未覆盖其余 10 个组件与 cupertino/silver-arrow）
- 公开 npm / chameleon-ui.dev 托管
- 把所有者主题确认写成律所意见书

## 合入检查

- [x] `ci:phase1` 本机绿（含 `phase1:gates`：德语膨胀、stylelint CSS、Playwright VR、`perf:size`）— M1 2026-08-13
- [x] 每次成功 install 在 `CU_TELEMETRY=1` 下可见事件；默认关
- [x] 无组件内私藏第二套打点 SDK
- [x] S1/S3/S4 硬门禁；S5 AppShell+common-10 抽检入库（4.389 KB / 100 KB）
- [x] 官方 ar RTL 三档快照为 Playwright 实拍，不是手绘
- [ ] R1–R3 真采样 — 不挡工程 M1，挡公开发版
- [ ] 云 VR 托管裁定 — 2026-08-28 前复审；不把云对比写成已做

## 其它阶段

| 阶段 | 文档 |
| :--- | :--- |
| Phase 0 | [`PHASE0.md`](./PHASE0.md) · [`Phase-0-地基.md`](../docs/project/phases/Phase-0-地基.md) |
| Phase 1 | [`PHASE1.md`](./PHASE1.md) · [`Phase-1-MVP.md`](../docs/project/phases/Phase-1-MVP.md) |
| Phase 2 | [`PHASE2.md`](./PHASE2.md) · [`Phase-2-开源发布.md`](../docs/project/phases/Phase-2-开源发布.md) |
| Phase 3 | [`PHASE3.md`](./PHASE3.md) · [`Phase-3-v1.0.md`](../docs/project/phases/Phase-3-v1.0.md) |
| Phase 4 | [`PHASE4.md`](./PHASE4.md) · [`Phase-4-v2.0.md`](../docs/project/phases/Phase-4-v2.0.md) |
| Phase 5 | [`PHASE5.md`](./PHASE5.md) · [`Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md) |
| Phase 6 | [`PHASE6.md`](./PHASE6.md) · [`Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md) |
| Phase 7 | [`PHASE7.md`](./PHASE7.md) · [`Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md) |
| Phase 8 | [`PHASE8.md`](./PHASE8.md) · [`Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md) |
| Phase 9 | [`PHASE9.md`](./PHASE9.md) · [`Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md) |
