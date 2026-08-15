# Phase 3 · 接口说明书（T3.10）

> 日期：2026-08-15 · Owner：待指定  
> 范围：建设期工程本地可调用表面（CLI / MCP / Registry HTTP / install-core）。  
> **不是**公网 API、**不是** IdP/SSO、**不是**计费计次。

## 1. 写盘唯一内核

所有安装写盘经 `@chameleon-ui/install-core` 的 `createInstallKernel(registry).install(...)`。

| 字段 | 说明 |
| :--- | :--- |
| `item.type` | `registry:ui` · `registry:theme` · `registry:rules` · `registry:block` |
| `source` | `cli` \| `mcp` \| `docs` \| `market` \| `ag-ui` |
| 幂等 | 二次安装 identical 文件 → `written=[]`、`skipped>0` |
| 冲突 | 不同内容 → `InstallError`（不部分写入） |
| 遥测 | 默认关；仅当传入 `telemetry` hook 或 `CU_TELEMETRY=1` 时挂钩 |

## 2. CLI（`@chameleon-ui/cli`）

环境：`CU_TARGET_DIR`（必填目标目录）、可选 `CU_REGISTRY_URL` / `CU_REGISTRY_TOKEN` / `CU_REGISTRY_NAMESPACE`。

| 命令 | 作用 |
| :--- | :--- |
| `chameleon add <component>` | 装组件（`registry:ui`） |
| `chameleon add-block <block>` | 装场景 Block（`registry:block`）及组件依赖 |
| `chameleon add-theme <theme>` | 装主题 |
| `chameleon bundle <component> <theme>` | 组件 + 主题两次 install |
| `chameleon install-with-theme <component> <theme>` | 四件套一次幂等 install |

无 `CU_REGISTRY_URL` → bundled catalog；有 URL → Bearer HTTP 客户端（同 schema）。

## 3. MCP（`@chameleon-ui/mcp-server`）

工具名 snake_case。写盘工具同样只调 install-core。

| 工具 | 写盘？ |
| :--- | :--- |
| `search_components` / `get_component` / `get_contract` / `get_design_rules` / `get_import_specifiers` / `list_themes` | 否 |
| `install_component` / `install_block` / `install_theme` / `install_bundle` / `install_with_theme` | 是 |
| `telemetry_opt_out` / `record_intent` | 否（钩子） |

目标目录：`CU_TARGET_DIR`。

## 4. 私有 Registry HTTP（`@chameleon-ui/registry-private`）

演示形态：本机 Node `127.0.0.1`（不强制 Docker/K8s）。

权威细节与路由见包内 [`packages/registry-private/README.md`](../../../chameleon-ui/packages/registry-private/README.md)。

要点：

- 同 `RegistryItem` schema（与公网 bundled 条目同构）
- Bearer Token；namespace + semver
- **不写**消费方磁盘（只提供目录；安装仍经 install-core）

## 5. 市场安装（Phase 4 衔接）

`apps/market` → `POST /api/v1/listings/:id` → `market-service` → `install-core`（`source=market`）。本说明书不展开市场 listing schema。

## 6. 明确未做

- 公网 Registry / chameleon-ui.dev 托管
- IdP SSO / mTLS 客户端证书 / 多租户计费
- OpenAPI 生成物自动发布到公网
