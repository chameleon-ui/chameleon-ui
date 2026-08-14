# @chameleon-ui/adapter-mcp-apps

MCP Apps (SEP-1865, Final 2026-01-26) adapter for Chameleon UI.

- **Support level**: **supported**（Phase 8 起，POC 晋升）。错误路径（未知类型 / 缺失注册项 / 非法文档 / 非 `ui://` URI）抛出定位到字段的 `McpAppsAdapterError`；测试在 CI 运行（`phase4:gates` + `phase8:gates`），非手工。版本承诺：`0.x` 内 `adapt` / `toUiResource` / `toolUiMeta` 签名不破坏。
- **Decision**: adapt (small independent package), not observe-only. See [`DECISION.md`](./DECISION.md).
- **Scope**: map MCP Apps documents (`ui://` + HTML template) into Chameleon UI component slugs and install plans.
- **Rule**: protocol-specific mapping lives **only** in this adapter (L3/L4); L1/L2 remain protocol-free.
- **Install write rule**: this adapter returns an `InstallPlanEntry[]`; it never writes to disk itself. Callers must pass the plan to `@chameleon-ui/install-core`.
- **Exports**: `SchemaRenderer`, `adapt`, `toUiResource`, `toolUiMeta`, `DEFAULT_MCP_APPS_COMPONENT_MAP`, `McpAppsAdapterError`.
- **Runtime rendering**: for JSON Schema → live component tree, use `@chameleon-ui/schema-renderer`.

## What this is not

- Not a host certification (Claude / ChatGPT / VS Code / Goose). **supported** 指本仓适配层的工程质量级别，**不是**任何宿主认证。
- Not a claim that bidirectional JSON-RPC with a real host is wired.
- Not an L1 package. Do not import this from `tokens` / `themes` / `i18n` / `contract` / `primitives`.

## Usage

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

See `demo/` for a minimal form + submit example.

Telemetry: if a caller installs from this plan, use the existing `install` event via install-core (`source` stays `cli` | `mcp` | `docs`). This adapter does not invent event names.
