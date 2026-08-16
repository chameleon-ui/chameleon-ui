# AI 工作原理

> **简体中文 · [English](how-ai-works.en.md) · [繁體中文（香港）](how-ai-works.zh-HK.md) · [العربية](how-ai-works.ar.md)**

本文说明 Chameleon UI 的 AI 机制如何端到端工作：AI（agent 或模型）如何理解组件、如何获得合法可靠的用法、如何安装组件和主题。这是架构层面的机制说明，具体操作规则以 [`AGENTS.md`](../../AGENTS.md) 为唯一事实来源。

核心思路：由机器可读的契约驱动一切。AI 不靠猜，而是查询契约与词表来组装组件；写盘始终收敛到一个内核。

---

## 1. 契约驱动

传统组件库对 AI 是黑盒：AI 只能从 README 和示例猜用法，容易编造 import、写错 props、引用不存在的路径。Chameleon UI 的做法相反，每个组件自带一份机器可读的 `contract.json`，AI 直接读它就能得到权威、可校验的用法。

每个组件的 `contract.json`（位于 `packages/components-react/src/<slug>/contract.json`）包含：

- `slug` / `name` / `schemaVersion`
- `props` / `variants` / `states`
- `composition` / `antiPatterns`（不该怎么用）
- `a11y`（无障碍要求）
- `responsive` / `rtl`（三端与 RTL 行为）
- `dataAi`：`{ "role", "states", "intents" }`，机器可读的行为语义
- `usage` / `exports` / `mechanics`

真实示例（button 的 `dataAi`）：

```json
{
  "role": "button",
  "states": ["default", "loading", "disabled"],
  "intents": ["submit", "confirm", "cancel"]
}
```

契约由 [`@chameleon-ui/contract`](../../packages/contract/README.md) 用统一 schema 强制全量校验：catalog 里每个 slug 必须有合法契约，否则 CI 失败。契约可信这件事由门禁保证，不靠自觉。

---

## 2. 意图词表：data-ai-vocabulary

AI 搜索或描述组件时，用一个冻结的意图词表对齐语义。

[`docs/ai/data-ai-vocabulary.json`](./data-ai-vocabulary.json) 定义了标准 `intents`（当前 78 个），例如 `submit`、`cancel`、`choose-option`、`confirm`。

- 每个 intent 配一句英文语义描述（如 `adjust-value`："Adjust a numeric value along a range."）。
- 作用是让需求描述和组件能力用同一张词汇表对接，AI 的搜索和推荐因此可解释、可预测。
- 词表是冻结的：新增 intent 必须先在此登记，再由 `catalog-data-ai.test.ts` 与 `generate-data-ai-vocabulary.mjs --check` 双向防漂移。

---

## 3. 两条消费路径

AI 消费 Chameleon UI 有两条路径，取决于是否挂载 MCP。

### 路径 A：挂载 MCP（推荐给准生产 AI 工作流）

`@chameleon-ui/mcp-server` 提供一个 stdio 的 [Model Context Protocol](../../packages/mcp-server/README.md) server，AI 通过工具调用实时查询：

| 时机 | 工具 |
| :--- | :--- |
| 第一次 | `get_started`（目录摘要、主题、工具顺序、禁止项） |
| 写任何 CSS/JS import 前 | `get_import_specifiers`（返回合法 specifier） |
| 选组件 | `list_components` / `search_components`（按 `intent`） |
| 发组件 JSX/SFC 前 | `get_contract`（v0.2 契约） |
| 处理密度、半径、RTL 前 | `get_design_rules` |
| 列主题 | `list_themes` |
| 落地安装 | `install_with_theme` 等 `install_*` |

只读工具不写盘；一切写盘经 `install-core`。

### 路径 B：不挂载 MCP（零依赖）

AI 直接读仓库里的 `AGENTS.md` 与 `docs/ai/`，从文件系统取契约，原样拷贝官方 import specifier。此时禁止编造替代路径或 specifier，AGENTS.md 的规则就是用来防猜的。

---

## 4. 三层职责：映射、渲染、安装

协议文档（A2UI / MCP Apps / AG-UI）变成真实 Chameleon 组件要经过三层分工，协议字段不进入 L1/L2：

| 层 | 包 | 职责 | 写盘？ |
| :--- | :--- | :--- | :--- |
| 协议映射 | `adapter-a2ui` / `adapter-mcp-apps` / `adapter-ag-ui` | 协议文档 → render node / 安装计划 | 否（返回计划） |
| 运行时渲染 | `schema-renderer` | JSON render-schema → 真实组件树（默认 10 slugs） | 否 |
| 安装内核 | `install-core` | 按计划落盘（依赖图、冲突检测、幂等） | 是（唯一入口） |

- `schema-renderer` 共享 catalog 的 slug 命名，但不感知任何协议字段。
- adapters 与 schema-renderer 是旁路（L3/L4），不污染 headless 内核。
- 一个 `schema-renderer` 的 JSON 输入实例：

```json
{
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

---

## 5. 安全边界（NEVER）

`AGENTS.md` 用一份 NEVER 清单约束 AI，防止产出坏代码：

- 禁止编造 `@chameleon-ui/*/css` 的 specifier，或在消费者里写 `workspace:*`。
- 禁止同时引入 `@chameleon-ui/react` 与 `@chameleon-ui/vue`。
- 禁止把 AG-UI adapter 当作 supported 协议（它是 POC）。
- 禁止编造性能数字、盲测识别率、无障碍认证。
- 禁止在 `install-core` 之外开第二条安装路径。
- 禁止给 `@chameleon-ui/*` CSS 加 `resolve.alias` hack，包 `exports` 必须能自行解析。

这些不是建议，是 CI 和门禁会拦的硬约束。

---

## 6. 工作流示例：AI 添加一个登录表单

1. `get_started`：拿到主题 `linear`、CSS 引入方式、工具顺序。
2. `search_components`(`intent: "authenticate"`)：命中 `login` / `input` / `password-input`。
3. `get_import_specifiers`：拿到这组组件的合法 import。
4. `get_contract`(`input`)：拿到 props / a11y / antiPatterns。
5. `get_design_rules`(`linear`)：拿到密度 / RTL / 间距规则。
6. 产出 JSX/SFC，用官方 specifier 引入，不用 `resolve.alias`。
7. 如需落盘：`install_with_theme`（经 install-core 幂等写入）。

整条链路每一步都有权威来源，AI 不需要猜。

---

## 7. 相关文档

| 主题 | 位置 |
| :--- | :--- |
| AI 消费规则（SSOT） | [`AGENTS.md`](../../AGENTS.md) |
| Agent 消费流程 | [`docs/ai/agent-consume.md`](./agent-consume.md) |
| 契约字段映射 | [`docs/ai/component-contract-v0.2-mapping.md`](./component-contract-v0.2-mapping.md) |
| 意图词表 | [`docs/ai/data-ai-vocabulary.md`](./data-ai-vocabulary.md) |
| SchemaRenderer | [`docs/ai/schema-renderer.md`](./schema-renderer.md) · [`packages/schema-renderer`](../../packages/schema-renderer/README.md) |
| MCP server | [`packages/mcp-server/README.md`](../../packages/mcp-server/README.md) |
| 契约校验 | [`packages/contract/README.md`](../../packages/contract/README.md) |
| 安装内核 | [`packages/install-core/README.md`](../../packages/install-core/README.md) |
