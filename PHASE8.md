# Phase 8 · AI 阶梯收口看板（第二期）

> 完整目标卡见 [`../docs/project/phases/Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md)。  
> **AI 条目验收口径唯一权威**：[`../docs/project/phases/AI能力体系-A1-A6-收口轨道.md`](../docs/project/phases/AI能力体系-A1-A6-收口轨道.md)。  
> 第二期总览：[`../docs/project/phases/Phase-2-Overview.md`](../docs/project/phases/Phase-2-Overview.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 看板（据树同步 2026-08-13）

```
P8  [x] T8.1 A1：contract schema v0.2（$id …/v0.2.json）+ 映射表 docs/ai/component-contract-v0.2-mapping.md + CI 硬门禁（全量 catalog；n≤50 隔离已撤）
    [x] T8.2 A2：意图搜索 + install_with_theme + 旁路写盘扫描 — registry 测试 + scripts/scan-bypass-writes.mjs + 红proof
        + MCP `get_contract` / `get_design_rules` / `get_import_specifiers` + `pnpm ai:check`（AGENTS.md / 安装文档 import 防漂移）
    [x] T8.3 A3：validate-rules 升硬门禁 + 红proof（phase8:gates）
    [x] T8.4 A4：adapter-ag-ui POC（DECISION.md owner 待指定；非协议认证）+ packages/schema-renderer 单测/快照
        + adapter-a2ui / adapter-mcp-apps README support level=supported
    [x] T8.5 A5：intent 当前 catalog 全库（95）+ 三件套门禁 — A/B 6 目录不存在故未入 catalog；词汇表已扩；红proof 仍走 phase8:gates
    [ ] T8.6 A6：bench.generation_quality null → 实测 — 仍诚实 null（无模型预算）；M8 不签字
    [x] T8.7 DTCG $extends：token-compiler + 8 主题回归脚本 + studio tokenDelta / ExportPage 差量导出
    [x] ci:phase8 = ci:phase4 + phase8:gates — 脚本已落盘（根 package.json）；本次未复跑本机绿；ci:phase7 仍不存在
```

## 命令

```
corepack pnpm@9.15.0 bench:genui      # generation_quality 无模型时保持诚实 null
corepack pnpm@9.15.0 ai:check         # 契约 + MCP + AGENTS.md + 安装文档 import 防漂移
corepack pnpm@9.15.0 phase8:gates
corepack pnpm@9.15.0 ci:phase8        # = ci:phase4 + phase8:gates（无 ci:phase7）
```

## 红线

- 协议逻辑只在 L3/L4；L1/L2 禁止出现协议 if 分支（import 边界测试）。
- Bench 数字由 harness 生成；无模型预算则 `generation_quality` 保持 null 且 **M8 不签字收口**（里程碑顺延）——null 合法，伪造非法。
- data-ai 标注不塞 PII。

## 明确未做（禁止伪造）

- GenUI-Bench 企业版（V4，运营期）
- AI 主题生成器（愿景 §6.5，后续阶段）
- AG-UI 若走观察路径：禁止空包冒充适配

## 合入检查

- [x] 全量 catalog data-ai role+state+intent 门禁覆盖当前 95 slug — A/B 缺口未入 catalog；以 components 测试为准
- [ ] Bench 报告含模型/日期/复现步骤 — generation_quality 仍 null
- [x] `$extends` 产物 8 主题回归绿 — `test-themes-regression.mjs` 在仓（本次未复跑）
- [x] adapter-ag-ui 测试或观察报告签字 — `src/ag-ui.test.ts` 在；DECISION.md 为 POC，owner 待指定未签，OR 条款「测试」已满足

## 其它阶段

| 阶段 | 文档 |
| :--- | :--- |
| Phase 0–4（建设期） | [`PHASE0.md`](./PHASE0.md) … [`PHASE4.md`](./PHASE4.md) |
| Phase 5 | [`Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md) |
| Phase 6 | [`Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md) |
| Phase 7 | [`Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md) |
| Phase 8 | [`Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md) |
| Phase 9 | [`Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md) |
