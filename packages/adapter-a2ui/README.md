# @chameleon-ui/adapter-a2ui

**L3 协议适配 —— 把 A2UI 文档映射为 Chameleon UI 组件 slug 与安装计划。** L1/L2 保持协议无关。

## 支持级别

**supported**（Phase 8 起，由 POC 晋升）。错误路径（未知类型 / 缺失注册项 / 非法文档）抛定位到元素路径的 `A2UIAdapterError`；测试在 CI 运行（`phase3:gates` + `phase8:gates`），非手工。**版本统一到 0.4.0**：`adapt` / `SchemaRenderer` 签名在 0.4.0 内不破坏，映射表新增键向后兼容。

## 规则

- **协议映射只在本适配器（L3/L4）**——L1/L2 不感知任何 A2UI 字段。
- **本适配器不写盘**：它返回 `InstallPlanEntry[]`；调用方必须把计划交给 `@chameleon-ui/install-core`。
- **运行时渲染**用 `@chameleon-ui/schema-renderer`（本适配器只到 render node / 安装计划为止）。

## 导出

`SchemaRenderer` · `adapt` · `DEFAULT_A2UI_COMPONENT_MAP` · `A2UIAdapterError`

## 用法

```ts
import { SchemaRenderer, adapt } from '@chameleon-ui/adapter-a2ui'
import { registry } from '@chameleon-ui/registry'

const renderer = new SchemaRenderer(registry)
const tree = renderer.renderDocument(a2uiDoc)

const plan = adapt(a2uiDoc, registry)
// plan is ready for install-core
```

`demo/` 有一个最小 form + submit 示例。
