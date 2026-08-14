# 社区纪律包（design-rules pack）创作 → 校验 → 上架 → 安装

> Phase 8 A3 收口文档。纪律包 = 主题三件套中的「骨」（design-rules）+ 可选 Token 覆盖。  
> 样板：`community-focus-first`（已按本路径走通，见 §5 记录）。

## 1. 创作

- 目录三件套：`design-rules.json`（必填）、`meta.json`（`id`/`label`/`kind:"community"`/`pricing`）、`tokens.json`（可为空对象 `{}`）。
- **id 必须带 `community-` 前缀**；官方致敬主题 id（line / silver-arrow / stuttgart / corsa / cupertino / siren / wechat / ant-blue）保留给官方，社区包不得冒用（`install-core` 的 `rules-policy` 会拒绝把官方 id 当付费社区包）。
- schema 公开：`packages/contract/schemas/design-rules.schema.json`（`$id: https://chameleon-ui.dev/schemas/design-rules/v1.0.json`，文档站镜像 `/schemas/design-rules/v1.0.json`；公网 GET 待部署，不宣称已可 GET）。

## 2. 校验（创作期自检）

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/themes validate-rules -- --file <path/to/design-rules.json>
```

- 校验器即 CI 硬门禁同一代码路径（`packages/themes/scripts/validate-rules.mjs`），任一字段非法即非零退出并定位到字段路径。
- CI 侧 8/8 官方主题 + 已上架社区包全量过检；故意构造的非法文档必红（证据见 `docs/project/reports/Phase-8-门禁拦阻证据.md`）。

## 3. 上架

- 包目录放入 registry（本仓形态：`packages/registry/registry/rules/<id>.json`，由 `sync-catalog.mjs` 从 `packages/themes/src/<id>/` 生成）。
- 市场列出走 `market-service` listings（`type: "registry:rules"`）；付费包需经 `RulesDownloadAuthPort` 授权（`prepareRulesInstall`），免费包直接放行。
- 上架检测清单：schema 过检 → `community-` 前缀 → meta.kind=community → 价格策略合法（官方致敬 id 不得作付费 SKU）。

## 4. 安装

```bash
# 经 install-core 内核（唯一写盘路径），幂等
chameleon add community-focus-first        # CLI
# 或 MCP: install_component / market CTA，source ∈ {cli, mcp, docs, market}
```

落盘：`rules/<id>/{design-rules.json, meta.json, tokens.json}`；重复执行全部 skip（幂等证明见 `packages/registry/src/__tests__/community-rules-lifecycle.test.ts`）。

## 5. 样板全链路记录（community-focus-first）

| 环节 | 证据 |
| :--- | :--- |
| 创作 | `packages/themes/src/community-focus-first/{design-rules.json,meta.json,tokens.json}` |
| 校验 | `validate-rules` 覆盖该包（9/9 文档过检）；红proof fixture：`packages/registry/test-fixtures/community-rules/broken-design-rules.json` |
| 上架 | `packages/registry/registry/rules/community-focus-first.json` + market-service seed |
| 安装 | `community-rules-lifecycle.test.ts`：list → prepareRulesInstall → kernel.install → 幂等复跑 |

## 6. 红线

- 安装写盘只经 `install-core`；社区通路不得引入第二套写盘（`scripts/scan-bypass-writes.mjs` 进 CI）。
- 未过 `validate-rules` 的包不得上架；伪造校验通过记录 = 轨道卡 §4 红线。
