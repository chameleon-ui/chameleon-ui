# @chameleon-ui/contract

L1/L3 · 组件契约的 schema 与生成/校验入口。

- `schemas/component-contract.schema.json` 是 **v0.2**（Phase 8 冻结，canonical 键位 + `dataAi` 三字段必填）。
- `schemas/component-contract.v0.1.json` 是归档的 v0.1，只读保留，供版本对照与旧文档复验。
- `schemas/design-rules.schema.json` 是 Phase 3 的 v1.0 design-rules 完整字段 schema。
- `samples/button.contract.json` 只用于演示和自检，**不是** Button 权威契约正文；Phase 1 起正文只能位于组件源目录。
- 禁止依赖 UI 框架。
- `$id` 是稳定 URL 标识：当前 `https://chameleon-ui.dev/schemas/component-contract/v0.2.json`（历史 `…/v0.1.json`）。
- Phase 2 文档站把 schema 拷到本地可 GET 路径 `/schemas/component-contract/v0.2.json`（v0.1 同步保留）。
- 本机 R&D 仓 **没有** 部署 `chameleon-ui.dev`；公网 GET 仍 pending（B1 验收以此为准，不宣称已公网可 GET）。
- v0.1 → v0.2 的键位决议与逐项映射表见 [`../../../docs/ai/component-contract-v0.2-mapping.md`](../../../docs/ai/component-contract-v0.2-mapping.md)。

## 版本策略（破坏性变更）

- `schemaVersion` 与 `$id` 路径中的版本号一一对应；破坏性变更（删除/改名/收紧必填）必须升 minor 版本号并保留旧版本文件至少一个大阶段。
- v0.2 相对 v0.1 的破坏性变更：顶层 `required` 新增 `dataAi`；`dataAi.required` 从 `["role"]` 收紧为 `["role","states","intents"]`；`schemaVersion` 常量从 `0.1` 改为 `0.2`。键位未改名（canonical 化，见映射表）。
- 新版本发布时必须同步：本包 `src/index.ts` 常量、文档站 `collect-public.mjs` 拷贝、映射表文档。

## 硬门禁

`scripts/validate-catalog-contracts.mjs` 以 `catalog.json` 为 SSOT 做 100% 覆盖校验：catalog 中每个 slug 必须有合法 v0.2 契约，否则 CI 红。尚未进入 catalog 的在研目录不在门禁范围，进入 catalog 时即被门禁接管。

`dataAi` / `telemetry` 仅定义静态契约字段，不会采集或发送任何数据。

## 自检

```bash
pnpm --filter @chameleon-ui/contract test
```

自检使用 Ajv 2020：先执行 schema 元校验和 strict 编译，再校验有效 sample，并确认一个无效文档确实被拒绝。错误格式包含实例路径、原因和下一步。首次运行前需在 monorepo 根完成正常的 `pnpm install`。

Schema 校验复杂度为 O(n·r)、空间 O(n)，其中 n 是实例节点数、r 是适用规则数，符合 Phase 0 C9。
