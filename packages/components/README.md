# @chameleon-ui/components

L2 · React 组件主包。

- 依赖：`primitives` · `tokens` · `i18n`（运行时文案工具）· `contract`（校验，非正式契约正文）
- **禁止**依赖 `@ark-ui/*` 或 `@base-ui/react`
- 单组件 DoD：实现 + 样式 + contract + locales + 测试
- 目录：`src/<kebab-name>/`，导出 PascalCase
- 冻结清单：[`catalog.json`](./catalog.json)（20 组件 + S5 常用 10）。置换须变更单。

Phase 1：20 个 slug 均为 `implementation: complete`（含 `AppShell`）。

## 外部工程本地链接（npm link / pack）

`dependencies` 使用 pnpm 的 `workspace:*`。**尚未 npm 发布**（版本 `0.2.0`）。外部工程优先装 umbrella `@chameleon-ui/react`（本包是其依赖图的一部分）：

```bash
cd chameleon-ui
node ./scripts/pack-external.mjs
# 外部工程：
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-react-0.2.0.tgz
# 或：
node ./scripts/link-external.mjs --apply
npm link @chameleon-ui/react
```

旧五包：`--legacy-five`。发布后由 pnpm 把 `workspace:*` 改写成具体版本。本仓不执行 npm publish。

