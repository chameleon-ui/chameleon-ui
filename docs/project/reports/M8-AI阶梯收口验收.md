# M8 · AI 阶梯收口验收（living）

> 报告日期：2026-08-15  
> 适用分支：`feat/phase2-p5-p9`  
> 验收依据：[`../phases/Phase-8-AI阶梯收口.md`](../phases/Phase-8-AI阶梯收口.md)、[`../phases/AI能力体系-A1-A6-收口轨道.md`](../phases/AI能力体系-A1-A6-收口轨道.md)  
> 看板：`chameleon-ui/PHASE8.md`  
> 结论：**工程本地 A1–A5 + A6 harness/基线可关；LLM 实测与 M8 全量签字仍顺延。** 禁止手写 `generation_quality`。

## 1. 摘要

| 层 | 本机状态 | 说明 |
| :--- | :--- | :--- |
| A1 | **通过** | contract schema v0.2 + catalog 全量门禁 + 红proof（`phase8:gates`） |
| A2 | **通过** | 意图搜索固定集、`install_with_theme`、旁路写盘扫描、MCP 工具进门禁 |
| A3 | **通过** | `validate-rules` 硬门禁 + 红proof；社区包链路在仓 |
| A4 | **通过（AG-UI=POC）** | schema-renderer 快照；a2ui/mcp-apps = supported；ag-ui POC + 测试（非协议认证） |
| A5 | **通过** | 当前 catalog 全量 `data-ai` 三件套门禁 + 红proof |
| A6 | **部分通过** | 任务集 + harness + 季度机制成文；默认 `bench:genui` 仍 **诚实 null**；`template-baseline` 实测入仓；**无 LLM 预算，不伪造模型分** |
| `$extends` | **通过** | 8 主题字节回归脚本在仓并由 `phase8:gates` 复跑 |

## 2. A6 证据（禁止伪造）

### 2.1 默认报告（诚实 null）

- 命令：`corepack pnpm@9.15.0 bench:genui`
- 文档站同步：`apps/docs/static/bench/latest.{json,md}` + `report.html`
- `bench.generation_quality` = `null`（unit=`reserved`）
- 报告含：`generatedAt`、`generation.measuredAt`、`taskSetVersion`、复现命令与 `CU_BENCH_GENERATOR` 提示

### 2.2 确定性基线（非 LLM，仓内实测）

- 命令：`CU_BENCH_GENERATOR=template-baseline corepack pnpm@9.15.0 bench:genui`
- 存证：`chameleon-ui/benchmarks/genui-bench/reports/generation-quality-template-baseline.json`
- Generator：`template-baseline-v0 (deterministic intent-search assembly, non-LLM)`
- Task set：`v1.0.0`（`tasks/generation-tasks.json`，frozenAt `2026-08-13`）
- 结果：**8/8 = 1.0000**（compile + expectSlugs + install-core）
- 口径：仅证明 harness 全链路可测；**不代表任何外部模型生成质量**

### 2.3 仍 blocked

| 项 | 原因 |
| :--- | :--- |
| 默认产物非 null 的 LLM 实测 | 无模型预算 / 端点（Phase 8 §13） |
| GenUI-Bench 企业版（V4） | 运营期，本阶段明确不做 |
| M8 全量签字 | LLM 实测顺延；owner 待指定 |

## 3. 季度机制

- 成文：[`../../ai/genui-bench-quarterly.md`](../../ai/genui-bench-quarterly.md)
- 首期检查单：见该文 §3；基线实测与报告元数据已入库

## 4. 复现

```bash
cd chameleon-ui
corepack pnpm@9.15.0 install
corepack pnpm@9.15.0 bench:genui
CU_BENCH_GENERATOR=template-baseline corepack pnpm@9.15.0 bench:genui
corepack pnpm@9.15.0 phase8:gates
```

## 5. 门禁

- `phase8:gates`：A1–A6 诚实性（含 template-baseline 存证）+ `$extends` + AI consumer SSOT
- `ci:phase8` = `ci:phase4` + `phase8:gates`（无 `ci:phase7`）
