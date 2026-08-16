# @chameleon-ui/components-react

**L2 · React 组件主包（Headless head + Chameleon 样式）。**

`@chameleon-ui/components-react` 是 React 16/17/18/19 的完整组件实现。每个组件 = **headless 逻辑（来自 `primitives`）+ Chameleon token 样式 + 契约 + 21 语言 + 测试**。完整清单的单一权威来源是 [`catalog.json`](./catalog.json)（当前 **116 个 slug**）。

## 依赖与规则

- 依赖：`primitives` · `tokens` · `i18n`（运行时文案）· `contract`（校验，非契约正文）
- **禁止**依赖 `@ark-ui/*` 或 `@base-ui/react`（headless 只在 `primitives`）
- 目录约定：`src/<kebab-name>/`，导出 **PascalCase**
- 单组件 DoD：实现 + 样式 + `contract.json` + `locales/` + 测试

## 用法

```tsx
import "@chameleon-ui/components-react/style.css";          // 全量样式
import { Button, DataGrid, ThemeProvider } from "@chameleon-ui/components-react";
```

按需引入（per-slug）：

```tsx
import "@chameleon-ui/components-react/button/styles.css";
import { Button } from "@chameleon-ui/components-react/button";
```

> 绝大多数消费者更推荐直接装伞包 [`@chameleon-ui/react`](../react/README.md)（本包是其依赖图一部分），以获得统一入口与 `./css` 别名。

## 契约

每个组件目录内的 `contract.json` 是机器可读契约（含 `dataAi.role` / `states` / `intents`），由 `@chameleon-ui/contract` 强制全量校验——catalog 里每个 slug 都必须有合法 v0.2 契约。

## 构建 / 测试

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/components-react test
corepack pnpm@9.15.0 --filter @chameleon-ui/components-react build
```

## 说明

- 冻结清单与组件置换受 `catalog.json` 变更单约束；不随意替换 slug。
- 本包使用 `workspace:*` 依赖；在 npm 发布前，外部工程请通过伞包 tarball / link 接入（见根 `README.md` 快速开始）。
