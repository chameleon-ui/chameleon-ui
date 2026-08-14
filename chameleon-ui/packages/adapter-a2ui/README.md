# @chameleon-ui/adapter-a2ui

A2UI protocol adapter for Chameleon UI.

- **Support level**: **supported**（Phase 8 起，POC 晋升）。错误路径（未知类型 / 缺失注册项 / 非法文档）抛出定位到元素路径的 `A2UIAdapterError`；测试在 CI 运行（`phase3:gates` + `phase8:gates`），非手工。版本承诺：`0.x` 内 `adapt` / `SchemaRenderer` 签名不破坏，映射表新增键向后兼容。
- **Scope**: map A2UI documents into Chameleon UI component slugs and install plans.
- **Rule**: protocol-specific mapping lives **only** in this adapter (L3/L4); L1/L2 remain protocol-free.
- **Install write rule**: this adapter returns an `InstallPlanEntry[]`; it never writes to disk itself. Callers must pass the plan to `@chameleon-ui/install-core`.
- **Exports**: `SchemaRenderer`, `adapt`, `DEFAULT_A2UI_COMPONENT_MAP`, `A2UIAdapterError`.
- **Runtime rendering**: for JSON Schema → live component tree, use `@chameleon-ui/schema-renderer`（本适配器只到 render node/安装计划为止）。

## Usage

```ts
import { SchemaRenderer, adapt } from '@chameleon-ui/adapter-a2ui'
import { registry } from '@chameleon-ui/registry'

const renderer = new SchemaRenderer(registry)
const tree = renderer.renderDocument(a2uiDoc)

const plan = adapt(a2uiDoc, registry)
// plan is ready for install-core
```

See `demo/` for a minimal form + submit example.
