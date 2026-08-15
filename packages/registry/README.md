# @chameleon-ui/registry

**L3 目录（catalog）—— 从源码同步生成的 registry 条目，只读。**

CLI / MCP / GenUI-Bench 从本包读取组件、主题、纪律包条目，交给 `@chameleon-ui/install-core` 写入。**本包不写任何用户工程文件**——文件写盘只发生在 `install-core`。

## 条目

由源码同步生成（同步命令见下）：

| 类别 | 目录 | 数量 |
| :--- | :--- | :--- |
| 组件 `registry:ui` | `registry/r/` | **103**（对齐 `catalog.json`） |
| 主题 `registry:theme` | `registry/t/` | 8（`line`、`silver-arrow`、`stuttgart`、`corsa`、`cupertino`、`siren`、`wechat`、`ant-blue`） |
| 纪律包 `registry:rules` | `registry/rules/` | 1（`community-focus-first`） |
| Blocks `registry:block` | `registry/b/` | 12 |

同步：

```bash
pnpm --filter @chameleon-ui/registry sync
```

`--check`（由 `test` 使用）在生成条目缺失或过期时失败。

## Public API（CLI/MCP 契约）

```ts
import {
  registry,
  getRegistryItem,
  searchRegistry,
  listThemes,
  listComponents,
  listRulesPacks,
  prepareRulesInstall,
  type RegistryItem,
} from '@chameleon-ui/registry';
```

**这些命名是 CLI/MCP 契约，不要改名。**

捆绑条目在加载时也暴露 `namespace`（`public`）与 `version`（`0.0.0`）。`registry/` 下的 JSON 保持 schema 兼容；这两个字段由 loader 填充，让私有服务器可用同一 item 形状对话。

## 私有 registry 客户端

- `CU_REGISTRY_URL` **未设置**时：CLI/MCP 用本捆绑目录（本地 R&D，无远程）。
- 设置 `CU_REGISTRY_URL` 时：从私有服务器拉取同 schema 的 `RegistryItem`，配合 `CU_REGISTRY_TOKEN` 与可选 `CU_REGISTRY_NAMESPACE`。

```ts
import {
  createRegistryClientFromEnv,
  createHttpRegistryClient,
  prepareInstall,
} from '@chameleon-ui/registry';
```

文件写盘**只**发生在 `@chameleon-ui/install-core`。
