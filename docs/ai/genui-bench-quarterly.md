# GenUI-Bench 季度发布机制（Phase 8 A6 成文）

> Owner：待指定 · 首期：见下方「首期状态」的诚实声明。

## 1. 指标字典

| 指标 id | 口径 | 门禁 |
| :--- | :--- | :--- |
| `bench.install_success_rate` | 全量 catalog 组件经内核单装成功率 | 必须 = 1 |
| `bench.bundle_install_success_rate` | 组件 + 主题同目录安装成功率 | 必须 = 1 |
| `bench.idempotent_reinstall_rate` | 二次安装全量 skip 比率 | 必须 = 1 |
| `bench.docs_cta_install_success_rate` | docs CTA 同内核路径安装成功率 | 必须 = 1 |
| `bench.conflict_reject_rate` | 冲突拒绝率（异内容必抛 InstallError） | 必须 = 1 |
| `bench.generation_quality` | 标准任务集上「一次生成通过 schema 编译 + 覆盖期望 slug + 安装成功」的比率 | 实测后置入门禁；无生成器时保持 **null（合法）** |

## 2. generation_quality 复现步骤

```bash
cd chameleon-ui
# 1) 诚实空值（无模型预算的默认形态）
corepack pnpm@9.15.0 bench:genui

# 2) 确定性基线（非 LLM，纯仓内，演示 harness 全链路）
CU_BENCH_GENERATOR=template-baseline corepack pnpm@9.15.0 bench:genui   # Windows: $env:CU_BENCH_GENERATOR='template-baseline'

# 3) 外部模型实测（需要预算与端点；owner 待指定签字）
CU_BENCH_GENERATOR=external-llm CU_BENCH_LLM_ENDPOINT=<url> CU_BENCH_LLM_MODEL=<name@version> corepack pnpm@9.15.0 bench:genui
```

- 任务集：`benchmarks/genui-bench/tasks/generation-tasks.json`（`taskSetVersion` 冻结）。
- 报告产物：`benchmarks/genui-bench/reports/latest.{json,md,html}`，含 generator 标识、任务集版本、逐任务 raw 输出（存证）。**禁止手改数字。**

## 3. 季度发布检查单

- [ ] 任务集版本未静默漂移（diff 评审 + frozenAt 更新）
- [ ] 报告含 generator（模型名/版本）、日期、复现命令
- [ ] 数字可由上述命令复跑得到（抽查 ≥1 个任务）
- [ ] 报告页可从文档站链接（docs `public/bench/latest.json` 随 collect-public 同步）
- [ ] 未实测能力（企业版指标、LLM 实测）在发布文案中不宣称

## 4. 首期状态（诚实声明）

- 2026-08-13：harness、任务集、复现脚本入库并跑通；`bench.generation_quality` 在默认 `pnpm bench:genui` 产物中为 **null**——本环境无模型预算/端点（Phase 8 §13：null 合法，伪造非法）。
- 模板基线（`template-baseline-v0`，确定性 intent-search 组装，非 LLM）实测 8/8 = 1.0000，仅证明 harness 全链路可用，**不代表任何模型生成质量**。
- M8 里程碑中 LLM 实测部分顺延（budget owner 待指定）；详见 `docs/project/reports/M8-AI阶梯收口验收.md`。
