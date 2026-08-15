# @chameleon-ui/adapter-mcp-apps

**L3 协议适配 —— 把 MCP Apps（SEP-1865）的 `ui://` 资源与 HTML 模板映射为 Chameleon UI 组件 slug 与安装计划。** L1/L2 保持协议无关。

## 支持级别

**supported**（Phase 8 起，由 POC 晋升）。错误路径（未知类型 / 缺失注册项 / 非法文档 / 非 `ui://` URI）抛定位到字段的 `McpAppsAdapterError`；测试在 CI（`phase4:gates` + `phase8:gates`）运行，非手工。**版本统一到 0.2.0**：`adapt` / `toUiResource` / `toolUiMeta` 签名在 0.2.0 内不破坏。

## 决策

**适配（adapt）而不是只观察（observe-only）**，独立小包。见 [DECISION.md](./DECISION.md)。

## 它不是什么

- **不是宿主认证**（Claude / ChatGPT / VS Code / Goose）。"supported" 指本仓适配层的工程质量级别，**不是**任何宿主认证。
- 不宣称已与真实宿主的双向 JSON-RPC 打通。
- **不是 L1 包**：不要从 `tokens` / `themes` / `i18n` / `contract` / `primitives` import 它。

## 导出

`SchemaRenderer` · `adapt` · `toUiResource` · `toolUiMeta` · `DEFAULT_MCP_APPS_COMPONENT_MAP` · `McpAppsAdapterError`

## 用法

```ts
import { SchemaRenderer, adapt, toUiResource, toolUiMeta } from '@chameleon-ui/adapter-mcp-apps'
import { registry } from '@chameleon-ui/registry'

const renderer = new SchemaRenderer(registry)
const tree = renderer.renderDocument(mcpAppsDoc)

const plan = adapt(mcpAppsDoc, registry)
const resource = toUiResource(mcpAppsDoc)
const meta = toolUiMeta(mcpAppsDoc.uri)
// plan is ready for install-core
```

`demo/` 有一个最小 form + submit 示例。

## 遥测

若调用方从此 plan 安装，复用 install-core 的既有 `install` 事件（`source` 保持 `cli` | `mcp` | `docs` 之一）。**本适配器不发明新事件名。**
