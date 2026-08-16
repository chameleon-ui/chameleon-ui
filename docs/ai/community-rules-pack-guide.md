# 社区 design-rules 包

规则包（rules pack）是主题的骨架：一份 `design-rules.json` 加可选的 token 覆盖。示例包：`community-focus-first`。

## 创建

目录内容：

| 文件 | 必需 | 说明 |
| :--- | :--- | :--- |
| `design-rules.json` | 是 | 按 design-rules schema 校验 |
| `meta.json` | 是 | `id`、`label`、`kind: "community"`、`pricing` |
| `tokens.json` | 是 | 可以是 `{}` |

规则：

- 包 `id` 必须带 `community-` 前缀。
- 官方主题 id（`linear`、`mercedes`、`porsche`、`ferrari`、`apple`、`tiktok`、`wechat`、`alipay`）是保留字，社区包不得拿它们做付费 SKU（`install-core` 的 `rules-policy` 会拒绝）。
- Schema 在 `packages/contract/schemas/design-rules.schema.json`（`$id`：`https://chameleon-ui.dev/schemas/design-rules/v1.0.json`，文档站镜像 `/schemas/design-rules/v1.0.json`）。公开 GET 尚未上线，不要宣称它已可访问。

## 校验

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/themes validate-rules -- --file <path/to/design-rules.json>
```

与 CI 同一代码路径（`packages/themes/scripts/validate-rules.mjs`）。字段非法时非零退出并给出字段路径。

## 注册

- 源主题目录：`packages/themes/src/<id>/`
- Registry 条目：`packages/registry/registry/rules/<id>.json`（由 `sync-catalog.mjs` 生成）
- 市场上架：`type: "registry:rules"`；付费包走 `RulesDownloadAuthPort` / `prepareRulesInstall`，免费包不经此门直接安装

上架前检查：schema 合法、`community-` 前缀、`meta.kind=community`、定价策略合法。

## 安装

写盘只经 `install-core`，幂等：

```bash
chameleon add community-focus-first
# 或 MCP install_*、市场 CTA；source ∈ {cli, mcp, docs, market}
```

落盘位置：`rules/<id>/{design-rules.json, meta.json, tokens.json}`。重复执行跳过已存在文件。

生命周期测试：`packages/registry/src/__tests__/community-rules-lifecycle.test.ts`。

## 示例包路径

| 环节 | 路径 |
| :--- | :--- |
| 源 | `packages/themes/src/community-focus-first/` |
| 损坏夹具 | `packages/registry/test-fixtures/community-rules/broken-design-rules.json` |
| Registry | `packages/registry/registry/rules/community-focus-first.json` |

## 硬规则

- 安装没有第二条写盘路径，CI 里有 `scripts/scan-bypass-writes.mjs` 检查。
- 未通过 `validate-rules` 的包不得上架。
