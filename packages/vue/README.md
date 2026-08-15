# @chameleon-ui/vue

**面向 Vue 消费者的统一入口伞包（L3 消费层）。**

一个依赖即可拉齐 `@chameleon-ui/tokens`、`i18n`、`primitives-vue`、`themes`、`components-vue` 的完整依赖图，并提供统一命名空间与 `css` 别名。

## 用法

```ts
import { Button, ThemeProvider } from "@chameleon-ui/vue";
import "@chameleon-ui/vue/css";   // tokens + density + line 主题 + 组件基础样式
```

其他主题（同一包）：

```ts
import "@chameleon-ui/vue/themes/cupertino/css";   // 或 @chameleon-ui/themes/<id>/css
```

## 接入（npm 发布前）

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/vue... build
node ../scripts/pack-external.mjs --vue
# 在消费者应用：
npm install ../dist-tarballs/chameleon-ui-vue-0.2.0.tgz
```

## 包要求：在你的应用根钉住 peers

`vue@^3.5` · `@ark-ui/vue@5.38.1` · `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14`

## 验收（全新 Vite Vue 应用，仅伞包，零 alias）

```bash
node ../scripts/verify-vue-css-consume.mjs
```

## 备注

- 本包尚未到 npm：发布前用 `pack-external` / `link-external` / `file:` 接入。
- 旧五包接入：`node ../scripts/pack-external.mjs --vue --legacy-five`。
