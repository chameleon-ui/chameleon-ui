# Phase 0 · 地基看板（建设期）

> 完整目标卡见 [`../docs/project/phases/Phase-0-地基.md`](../docs/project/phases/Phase-0-地基.md)。  
> 收口报告：[`../docs/project/reports/M0-基元POC与地基验收.md`](../docs/project/reports/M0-基元POC与地基验收.md)。  
> 全阶段约定：[`../docs/engineering/工程约定与命名规范.md`](../docs/engineering/工程约定与命名规范.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 同步说明 2026-08-13

看板此前只有五日勾选与指向目标卡的链接，缺少命令 / 红线 / 明确未做 / 合入检查，相对 PHASE5+ 偏薄。本次按 P5+ 骨架补齐章节，勾选仍以 M0 关闭时为准（D1–D5 全 `[x]`）。**这是文档同步，不是重新验收或重关 M0。** Owner 一律 **待指定**。未补缺件，未 git commit。

## 看板

```
D1  [x] poc:ark 起页  [x] poc:base 起页  [x] 双线 Button 可点  [x] build 不挂
D2  [x] 双线 3 组件  [x] 对比表有数  [x] 演示证据
D3  [x] Token 一键编译  [x] 物理属性 lint 红/绿  [x] O2 裁定
D4  [x] ICU(en/en-XA plural/select)  [x] 伪本地化 ≥40% CI  [x] RTL + 三端
D5  [x] POC 报告  [x] O1  [x] schema v0.1  [x] 本地 A0 证据  [x] 真浏览器全矩阵  [x] 技术 M0 退出
```

## 命令

```
corepack pnpm@9.15.0 poc:ark          # http://127.0.0.1:4173
corepack pnpm@9.15.0 poc:base         # http://127.0.0.1:4174
corepack pnpm@9.15.0 ci:phase0        # lint + typecheck + test + build（含 poc-e2e）
corepack pnpm@9.15.0 perf:size        # P0 仅挂点，Phase 1 起控；禁止当 S1
corepack pnpm@9.15.0 perf:lhci        # P0 仅挂点，无分数
```

下列不是根 `package.json` 别名，但是 M0 复现命令且对应包 `scripts` 存在：

```
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens build
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-e2e test
```

## 红线

- 五日**不**做 Registry / CLI / MCP / 20 组件；双轨只在 `poc/`。
- 正式包不得双底座；O1 选定 Ark 后 Base 仅留对比证据。
- 禁止生产埋点；`install-core` 只允许 `TelemetryHook` 空位。
- POC 整站 gzip **不是** S1；本阶段不设体积 CI 红灯。
- 禁止在 `packages/components` 写正式组件冒充地基已完成。

## 明确未做（禁止伪造）

- Registry / CLI / MCP、填实 `install-core`（→ P1）
- 20 组件 / 3 主题 / 4 Locale；更不是 50 组件 / 8 主题 / 21 语（→ P1–P2）
- `apps/docs`、GenUI-Bench、公开 schema 托管（→ P2）
- 体积 CI 硬门禁（`budgets.json` → P1）；R1–R3 正式 LHCI（当时未跑，→ 后由 P9 承接实测）
- 云视觉回归（O4 已裁本地/CI Playwright；Percy/Chromatic 未启用）
- 生产遥测 / `data-ai-*` 真属性（POC 只允许注释预留）

## 合入检查

- [x] `ci:phase0` 本机绿（lint + typecheck + test + build；含 `@chameleon-ui/poc-e2e`）— M0 2026-08-13
- [x] 无 `fetch` 打点、无第三方分析 SDK
- [x] `install-core` 仅钩子空位
- [x] POC 未冒充已支持 data-ai / 回流
- [x] M0 报告含 S1–S5 / R1–R3 引用与「Phase 1 起控」句
- [ ] GitHub Actions 实跑记录 — 本地仓无 remote，不挡技术 M0

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
