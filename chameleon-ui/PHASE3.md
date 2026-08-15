# Phase 3 · v1.0 看板（建设期）

> 完整目标卡见 [`../docs/project/phases/Phase-3-v1.0.md`](../docs/project/phases/Phase-3-v1.0.md)。  
> 收口报告：[`../docs/project/reports/M3-v1.0验收.md`](../docs/project/reports/M3-v1.0验收.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

三组落地已收口为一棵树：Theme Studio + design-rules、私有 Registry + `ci:phase3`、Vue 子集 + A2UI adapter。`ci:phase3` = `ci:phase2` + `phase3:gates`（Vue / adapter / studio / registry-private / validate-rules / MVP20 data-ai / Vue S1）。`ci:phase2` 定义未改。

## 同步说明 2026-08-13

看板此前已有勾选与命令，但仍缺红线 / 明确未做 / 合入检查专节，且其它阶段未链到 PHASE5–9，相对 PHASE5+ 偏薄。2026-08-15：T3.10 工程接口说明书已落盘；T3.3 秒表脚本已落地但**真人未跑**保持 `[ ]`；T3.7 / R1–R3 仍指向 P9。Owner 一律 **待指定**。

## 看板

```
P3  [x] T3.1 design-rules v1.0 + validate-rules（8/8 schema）
    [x] T3.2 A2UI SchemaRenderer + form/submit demo；install-core 写盘
    [x] T3.3 / A3.6 MVP20 data-ai-role + data-ai-state 抽检门禁
    [x] T3.4 theme-studio Beta：/editor · /export；导出 generator=theme-studio
    [x] 私有 Registry 同协议 HTTP（Token；namespace；semver）
    [x] 演示形态：本机 Node 127.0.0.1（不强制 Docker/K8s/remote）
    [x] 内网装 button：install-core；与公网条目同 schema
    [x] CLI/MCP：无 CU_REGISTRY_URL = bundled；有 URL 则 Bearer
    [x] 遥测默认关；install 事件名不变
    [x] T3.6 Vue 子集：primitives-vue + components-vue（Button / Input）
    [x] ci:phase3 = ci:phase2 + phase3:gates（本机绿 2026-08-13）
    [x] M3 living 报告（工程本地）
    [ ] T3.3 生手 10 分钟计时 — 秒表脚本已落地 `scripts/novice-timing.mjs`（写 `Phase-3-novice-timing.pending.json`）；**真人未跑**，禁止宣称 ≤10 分钟
    [ ] T3.7 盲测 / 「一眼认出 ≥80%」（禁止宣称）— moved to PHASE9 T9.5；harness 已落地 `/?view=blind`；真人未跑，`盲测结果.pending.json` `rate=null`，保持 `[ ]`
    [x] T3.8 VPAT 草稿 — P4 landed `apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md` status=draft；正式 published → PHASE9 T9.2
    [x] T3.10 接口说明书 — [`Phase-3-接口说明书.md`](../docs/project/reports/Phase-3-接口说明书.md) 覆盖 CLI / MCP / install-core / 私有 Registry HTTP；公网 API 仍未做
    [ ] R1–R3 Lighthouse（禁止伪造）— moved to PHASE9 T9.1（LEGACY-2026-001…003）
    [x] 官方 8 套致敬主题：所有者已确认（2026-08-13）；免费出货
```

Vue 扩面 2→≥20 → PHASE6 A6.6（仍 Button + Input，未达 ≥20）。
AG-UI：P3 已交付 A2UI（T3.2）；P8 landed `adapter-ag-ui` **POC**（DECISION.md owner 待指定），PHASE3 原「A2UI 或 AG-UI」已由 A2UI 满足；POC ≠ 协议认证，不回勾 P3 额外 AG-UI DoD。
运行时 `packages/schema-renderer` → PHASE8 T8.4（已落盘 + 单测；P3 T3.2 的 A2UI SchemaRenderer 仍算 P3 交付）。

## 命令

```
corepack pnpm@9.15.0 studio           # http://127.0.0.1:5177
corepack pnpm@9.15.0 phase3:gates
corepack pnpm@9.15.0 ci:phase2
corepack pnpm@9.15.0 ci:phase3        # = ci:phase2 + phase3:gates
```

下列不是根别名，但是 M3 复现命令且对应包 `scripts` 存在：

```
corepack pnpm@9.15.0 --filter @chameleon-ui/themes validate-rules
corepack pnpm@9.15.0 --filter @chameleon-ui/registry-private start
corepack pnpm@9.15.0 --filter @chameleon-ui/registry-private test
```

环境变量：`CU_REGISTRY_URL`、`CU_REGISTRY_TOKEN`、可选 `CU_REGISTRY_NAMESPACE`。

## 红线

- 协议逻辑只在 L3/L4；L1/L2 禁止出现协议 if 分支。
- Vue 与 React 无第二份 Token 权威。
- `data-ai-*` 仅 DOM 标注，不塞 PII。
- 未做真人计时，**禁止**宣称 A3.3「生手 ≤10 分钟」。
- 禁止伪造 Lighthouse；禁止把可关遥测写成已经上报到公网。
- 私有 Registry 演示形态是本机 Node `127.0.0.1`，禁止用未交付的 Docker/K8s/IdP 冒充企业套件。

## 明确未做（禁止伪造）

- T3.3 真人生手计时录像（秒表脚本 ≠ 达标）
- T3.7 盲测 / 「一眼认出 ≥80%」（→ P9 T9.5；harness 已落地，真人结果 pending，禁止手写 %）
- 公网 OpenAPI / IdP SSO / mTLS（T3.10 工程说明书已覆盖本地 CLI/MCP/私有 Registry）
- R1–R3 Lighthouse（→ P9 T9.1，LEGACY-2026-001…003）
- Vue 扩面 2→≥20（仍 Button + Input → P6 A6.6）
- AG-UI 协议认证（P3 以 A2UI 满足「至少一方」；P8 POC ≠ 认证）
- IdP SSO / mTLS 客户端证书 / 多租户计费 / K8s Operator
- 公网 npm / chameleon-ui.dev
- 主题市场 / 付费纪律包（→ P4）

## 合入检查

- [x] `ci:phase3` 本机绿（含未改定义的 `ci:phase2` + `phase3:gates`）— M3 2026-08-13
- [x] MVP20 根节点 `data-ai-role` + `data-ai-state` 抽检通过
- [x] 企业演示可演示「关闭遥测」— 默认关；`CU_TELEMETRY=1` 才挂钩
- [x] 无市场假页面 — P3 未做假市场；真市场在 P4 `apps/market`
- [x] Vue S1 按子集合计过门禁
- [ ] T3.3 真人生手计时 — 不挡工程本地 M3，禁止宣传达标（脚本已有）
- [x] T3.10 接口说明书（工程本地表面）— [`Phase-3-接口说明书.md`](../docs/project/reports/Phase-3-接口说明书.md)

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
