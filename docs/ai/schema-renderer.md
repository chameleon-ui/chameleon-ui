# SchemaRenderer

包：`@chameleon-ui/schema-renderer`。把 JSON 树渲染成真实组件，默认映射固定为 10 个 slug。

| 适配器 | 状态 |
| :--- | :--- |
| `@chameleon-ui/adapter-a2ui` | supported |
| `@chameleon-ui/adapter-mcp-apps` | supported |
| `@chameleon-ui/adapter-ag-ui` | POC，不要当作 supported |

## 数据形状

```json
{
  "$schema": "https://chameleon-ui.dev/schemas/ui-render/v1.0.json",
  "version": "1.0",
  "root": {
    "component": "card",
    "props": { "variant": "outlined", "padding": "lg" },
    "children": [
      { "component": "heading", "props": { "level": "level-2" }, "children": ["Sign in"] },
      {
        "component": "stack",
        "props": { "direction": "column", "gap": "2" },
        "children": [
          { "component": "input", "props": { "label": "Email", "value": "", "type": "email" } },
          { "component": "button", "props": { "variant": "solid" }, "children": ["Continue"] }
        ]
      }
    ]
  }
}
```

已提交的示例在 `packages/schema-renderer/examples/`（`login-form.json`、`status-card.json`、`empty-results.json`）。直接拷进消费者工程，包本身不导出 `examples` 子路径。

## 渲染

React：

```tsx
import { SchemaRenderer } from "@chameleon-ui/schema-renderer";
import schema from "./login-form.json";

export function Page() {
  return <SchemaRenderer schema={schema} />;
}
```

Vue：

```ts
import { SchemaRenderer } from "@chameleon-ui/schema-renderer/vue";
```

同样只有 10-slug 默认映射。

## 默认映射（仅 10 个 slug）

`alert` · `badge` · `button` · `card` · `divider` · `empty-state` · `heading` · `input` · `stack` · `typography`

未知 slug 渲染为带 `data-schema-error` 的占位符，不会白屏。限制：深度 ≤ 32，节点 ≤ 500。

`table`、`chart`、`kpi-dashboard`、`tabs`、`grid` 以及目录里其余组件不在默认映射内，从 `@chameleon-ui/react` 或 `@chameleon-ui/vue` 引入（也可以传自定义 `map` prop）。不要宣称 SchemaRenderer 覆盖完整目录。

## 不归这个包管

- 线协议格式（A2UI / MCP Apps / AG-UI）由对应的 `adapter-*` 处理（AG-UI 仍是 POC）。
- 文件脚手架由 `install-core` / `chameleon add` 处理。SchemaRenderer 只负责渲染。
