# @chameleon-ui/contract

L1/L3 · 组件契约的 schema 与生成/校验入口。

- `schemas/component-contract.schema.json` 是 Phase 0 的 v0.1 schema 种子。
- `samples/button.contract.json` 只用于演示和自检，**不是** Button 权威契约正文；Phase 1 起正文只能位于组件源目录。
- 禁止依赖 UI 框架。
- `$id` 是未来稳定 URL 的保留标识，Phase 0 不声称它已公开部署。
- `dataAi` / `telemetry` 仅定义可选静态契约字段，不会采集或发送任何数据。

## 自检

```bash
pnpm --filter @chameleon-ui/contract test
```

自检使用 Ajv 2020：先执行 schema 元校验和 strict 编译，再校验有效 sample，并确认一个无效文档确实被拒绝。错误格式包含实例路径、原因和下一步。首次运行前需在 monorepo 根完成正常的 `pnpm install`。

Schema 校验复杂度为 O(n·r)、空间 O(n)，其中 n 是实例节点数、r 是适用规则数，符合 Phase 0 C9。
