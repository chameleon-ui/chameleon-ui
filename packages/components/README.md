# @chameleon-ui/components

L2 · React 组件主包。

- 依赖：`primitives` · `tokens` · `i18n`（运行时文案工具）· `contract`（校验，非正式契约正文）
- **禁止**依赖 `@ark-ui/*` 或 `@base-ui/react`
- 单组件 DoD：实现 + 样式 + contract + locales + 测试
- 目录：`src/<kebab-name>/`，导出 PascalCase
- 冻结清单：[`catalog.json`](./catalog.json)（20 组件 + S5 常用 10）。置换须变更单。

Phase 1：20 个 slug 均为 `implementation: complete`（含 `AppShell`）。

## 外部工程本地链接（npm link）

`dependencies` 使用 pnpm 的 `workspace:*`。**尚未 npm 发布**（版本 `0.0.0`，首发 tag 仍是 `v0.1.0`）。在非 pnpm-workspace 的外部工程里只 `npm link` 本包会失败：npm 无法解析 `workspace:*`。

必须把运行时图一次全部 link（tokens → i18n → primitives → themes → components）：

```bash
cd chameleon-ui
node ./scripts/link-external.mjs          # 打印命令
node ./scripts/link-external.mjs --apply  # 在各包执行 npm link
# 然后在外部工程：
npm link @chameleon-ui/tokens @chameleon-ui/i18n @chameleon-ui/primitives @chameleon-ui/themes @chameleon-ui/components
```

发布后由 pnpm 把 `workspace:*` 改写成具体版本，外部工程改为 `npm install @chameleon-ui/components`。本仓不执行 npm publish；owner **待指定**。不提供第二套写盘安装器（仍只走 `install-core`）。

