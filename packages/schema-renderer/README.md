# @chameleon-ui/schema-renderer

**L3/L4 · 运行时 SchemaRenderer：JSON render-schema → Chameleon UI 组件树。**

默认入口是 React；Vue 走 `@chameleon-ui/schema-renderer/vue`。它是 L3/L4 适配层的旁路包，不进 L1/L2。

## 支持级别

**supported（Phase 8 起）**：示例集快照测试 + 单测进 CI（`phase8:gates`）。`0.x` 阶段 `schema version:"1.0"` 内不破坏；新增字段向后兼容。

## 与 adapter 的关系

| 层 | 职责 |
| :--- | :--- |
| `adapter-a2ui` / `adapter-mcp-apps` / `adapter-ag-ui` | 协议文档 → render node / 安装计划（协议分支留在适配器） |
| `schema-renderer` | 契约化描述（render-schema）→ **真实渲染**为本库组件 |

两层 slug 都来自 catalog；渲染器不感知任何协议字段。

## Schema 形态（v1.0）

```json
{
  "$schema": "https://chameleon-ui.dev/schemas/ui-render/v1.0.json",
  "version": "1.0",
  "root": {
    "component": "stack",
    "props": { "direction": "column", "gap": "2" },
    "children": [
      { "component": "heading", "props": { "level": "level-2" }, "children": ["Sign in"] }
    ]
  }
}
```

- `component`：必须在组件映射表内（默认映射见 `DEFAULT_COMPONENT_MAP`）。
- 守卫：深度 ≤ 32、节点 ≤ 500（禁指数展开）；未知 slug 降级为 `data-schema-error` 占位节点并汇总到 `onIssues`（错误可恢复，不白屏）。
- 复杂度：编译 O(n)。

## 官方示例集

`examples/`：`login-form.json`、`status-card.json`、`empty-results.json`。快照测试逐字节锁定渲染产物（`src/schema-renderer.test.tsx`）；示例增删必须过快照评审。

Agent 一页纸（JSON 形态、默认 10 slug、禁止把 AG-UI POC 当成 supported）：[`docs/ai/schema-renderer.md`](../../docs/ai/schema-renderer.md)。

低代码场景：把 `examples/login-form.json` 喂给 `<SchemaRenderer>` 即得真实组件树。**默认 map 不是全 catalog**。

## 测试

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/schema-renderer test
```
