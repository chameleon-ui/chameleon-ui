# 组件契约 v0.2：字段映射

规范 schema：`https://chameleon-ui.dev/schemas/component-contract/v0.2.json`（文档站镜像 `/schemas/component-contract/v0.2.json`，公开托管尚未上线）。

磁盘上的契约在 `packages/components-react/src/<slug>/contract.json`。MCP 侧用 `get_contract`，参数 `{ "slug": "…" }`。意图词表见 [`data-ai-vocabulary.md`](./data-ai-vocabulary.md)。

本项目的字段名是权威 v0.2。一份旧报告（§8.2）对部分字段用过不同的名字，下表供外部校验器做映射，语义没有变化。

## 为什么不全量改字段名

- Catalog 契约、registry、文档站副本、意图搜索都已在消费这些字段名。
- 报告 §8.2 只是字段命名提案，不是已发布的标准。
- 有这张表，校验期做机械改名即可，语义零损失。

## 权威 v0.2 ↔ 报告 §8.2

| 权威 v0.2 | 报告 §8.2 | 说明 |
| :--- | :--- | :--- |
| `purpose` | `purpose` | 相同 |
| `scenarios` | `scenarios` | 相同 |
| `props` | `props` | 相同 |
| `variants` | `variants` | 相同 |
| `states` | `states` | 相同 |
| `composition` | `compositionRules` | 改键名，子键相同 |
| `antiPatterns` | `antiPatterns` | 相同 |
| `a11y` | `a11y` | 相同 |
| `responsive` | `threeEndBehavior`（web 切片） | 改键名，platforms 被拆出 |
| `platforms` | `threeEndBehavior`（平台矩阵） | 改键名 |
| `rtl` | `rtlBehavior` | 改键名 |
| `dataAi` | （报告 §8.1 运行时标记） | v0.2 必填：`role` + `states` + `intents` |
| `telemetry` | — | 保留钩子名，默认不发送 |
| `mechanics` | — | 可选，变形与配对说明 |
| `usage` | — | 可选，有序步骤 |
| `exports` | — | 可选，component / hook / function / type |
| `props.*.payload` | — | 可选，`type=event` 时有意义 |

v0.2 中可选（非破坏）：`mechanics`、`usage`、`exports`、`props.payload`。省略它们完全合法。

## v0.1 → v0.2 破坏性变更

1. `schemaVersion`：`0.1` → `0.2`。
2. 顶层 `required` 新增 `dataAi`。
3. `dataAi.required`：`["role"]` → `["role","states","intents"]`（`intents` 至少 1 个，每个 intent 必须出现在 [`data-ai-vocabulary.md`](./data-ai-vocabulary.md) 中）。
4. 相对 v0.1 文档形状没有键改名或删除。归档 schema：`schemas/component-contract.v0.1.json`。

## 外部校验器

加载 v0.2 JSON Schema（2020-12）。要用报告 §8.2 的字段名，在校验前后按上表改写键名即可，语义一致。
