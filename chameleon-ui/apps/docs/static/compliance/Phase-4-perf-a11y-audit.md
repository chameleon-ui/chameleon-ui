# Phase 4 · 全量性能与 a11y 审计（living）

> 日期：2026-08-13  
> 依据：工程约定 §11、Phase 4 §5.6 / §5.7、U1 WCAG 2.1 AA  
> **禁止**：编造 Lighthouse 分数、把 `perf:lhci` 桩当成 R1–R3 证据、宣称盲测 ≥80%。

## 1. 测量入口（已有，不另起炉灶）

| 门禁 / 报告 | 命令 | 覆盖 |
| :--- | :--- | :--- |
| 体积 S1/S3/S4 硬门禁 + S5 抽检 | `corepack pnpm@9.15.0 perf:size` | `chameleon-ui/benchmarks/scripts/check-size.mjs` ← `benchmarks/budgets.json` |
| R1–R3 运行时 | `corepack pnpm@9.15.0 perf:lhci` | Phase 9 起跑本地 Lighthouse；**分数只存在于生成物** `chameleon-ui/benchmarks/reports/lhci-latest.json` 与 [`Phase-9-Lighthouse-R1-R3.md`](./Phase-9-Lighthouse-R1-R3.md)。本文件不手写分数。 |
| 视觉回归 | `pnpm --filter @chameleon-ui/visual-regression test:playwright` | 官方目标：`apps/internal-demo` AppShell+common-10，ar/RTL，390/768/1280 |
| 工程 CI | `ci:phase3`（含 `ci:phase2` / `ci:phase1`） | lint/typecheck/test/build + 德语膨胀 + CSS 逻辑属性 + VR + size + docs/bench |
| a11y 自动 | 组件契约 `a11y` 字段 + primitives 键盘 | **不是** axe 全站报告 |

本报告对照预算表；未测项一律 `LEGACY-*`。

## 2. S1–S5（体积）

以 `perf:size` / `budgets.json` 为准。本切片不重跑宣传数字。历史工程记录（M1/M2）：S5 AppShell+common-10 gzip 抽检约 4.389 KB / 100 KB（peer 外置）。**以当次 `perf:size` 输出为权威**，禁止手写替代。

| ID | 预算 | 本切片 | 说明 |
| :--- | :--- | :--- | :--- |
| S1 | ≤ 8KB gzip / 基础组件 | 走 CI 硬门禁 | peer 外置 |
| S2 | ≤ 60KB DataGrid | 不适用 | 未引入该类组件 |
| S3 | ≤ 20KB / 主题 | 走 CI 硬门禁 | 8 套 |
| S4 | ≤ 6KB / Locale | 走 CI 硬门禁 | 21 语 |
| S5 | ≤ 100KB 套件 | 抽检（phase1 gates） | 不是 Lighthouse |

超标 → `LEGACY-*` + owner + ETA。本切片未发现新的 S* 超标签字单。

## 3. R1–R3（运行时）

Phase 4 切片当时 `perf:lhci` 为桩、无分数。Phase 9 起以生成物为准，**禁止把分数抄进本 living 审计**：

- JSON：`chameleon-ui/benchmarks/reports/lhci-latest.json`
- Markdown：[`Phase-9-Lighthouse-R1-R3.md`](./Phase-9-Lighthouse-R1-R3.md)

口径为本地 Chrome + Fast 4G 模拟 + 4× CPU，不是物理中端安卓，也不是云 LHCI。`status=unmeasured` 时 LEGACY-2026-001…003 仍开。owner 待指定。

不得把体积门禁或 VR 截图宣传成 LCP/INP/CLS。

## 4. a11y / U1

| 项 | 证据 | 结论 |
| :--- | :--- | :--- |
| 目标 WCAG 2.1 AA | 工程约定 U1 | 目标，不是实验室证书 |
| VPAT | `apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md` | **status=draft**；not certified |
| 键盘 / 焦点 | Ark/Zag + 契约 | 部分支持；无全库 AT 会话 |
| RTL | 逻辑属性 lint + 官方 VR | Demo 套件级 |
| 触控 44px | 契约 U4 | 未逐组件像素审计 |
| 盲测 80% | — | **未做**；禁止宣称 |

人工关键路径抽检本切片未做独立录像。

## 5. 主题市场列表页 R*

本切片 **不** 建设主题市场 UI（其他 worker）。市场列表 R* 抽检不适用；记入 M4 为未做。

## 6. 北极星看板自身

看板只读消费 `bench.*` / `telemetry.*`。空态合法。看板性能不计入组件 S1。
