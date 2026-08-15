# @chameleon-ui/react

**面向 React 消费者的统一入口伞包（L3 消费层）。**

一个依赖即可拉齐 `@chameleon-ui/tokens`、`i18n`、`primitives`、`themes`、`components` 的完整依赖图，并提供统一的命名空间与 `css` 别名。

## 用法

```ts
import { Button, ThemeProvider } from "@chameleon-ui/react";
import "@chameleon-ui/react/css";   // tokens + line 主题 + 组件基础样式
```

## 接入（npm 发布前）

```bash
node ../scripts/pack-external.mjs
# 在消费者应用：
npm install ../dist-tarballs/chameleon-ui-react-0.2.0.tgz
```

## 包要求：在你的应用根钉住 peers

`react@^19` · `react-dom@^19` · `@ark-ui/react@5.38.0` · `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14`

> React 18 **不在支持范围**。Vite 提示：`resolve.preserveSymlinks: true`，dedupe framework + Ark + FormatJS；#不要给 `@chameleon-ui/*` CSS 加 `resolve.alias` —— 包 `exports` 必须自行解析。

## 备注

- 本包尚未到 npm：发布前用 `pack-external` / `link-external` / `file:` 接入。
- 旧五包接入：`node ../scripts/pack-external.mjs --legacy-five`。
