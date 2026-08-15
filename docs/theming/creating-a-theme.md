# 创建自定义主题

> **简体中文 · [English](creating-a-theme.en.md) · [繁體中文（香港）](creating-a-theme.zh-HK.md) · [العربية](creating-a-theme.ar.md)**

本教程教你为 Chameleon UI 添加**自己的主题**。它基于真实机制：主题是一个**overlay**——只覆盖 core token 的某子集，而不复制整套设计 token；再由 `themes` 的构建脚本编译成一份 CSS 变量文件。

> 前提：你已在本仓库根跑过 `pnpm install`，了解 `packages/themes` 与 `packages/tokens`。

---

## 1. 理解主题 = overlay

- **core** 在 `packages/tokens/src/core/`——是全部设计 token 的单一权威来源（颜色、间距、圆角、阴影、动效、排版）。
- **主题目录**在 `packages/themes/src/<id>/`，其中的 `tokens.json` 只描述**你要改的部分**。未覆盖的 token 从 core 继承。
- 组件 CSS 与主题通过 **CSS 自定义属性**（`--cu-*`）消费这些值。

一个最小主题目录有 4 个文件：

```
src/<id>/
├── tokens.json        # overlay：覆盖 core token 子集（必填）
├── design-rules.json  # 主题的排版/间距/圆角/对比度/禁用模式等规则（必填）
├── meta.json          # id / label / preview / fonts（必填，id 必须=目录名）
└── effects.css        # 可选：圆角/阴影/动效语言，构建时追加进 CSS
```

---

## 2. 第一步：建主题目录

在 `packages/themes/src/` 下新建目录（ids 用小写连字符，如 `my-brand`）：

```bash
mkdir packages/themes/src/my-brand
```

### 2.1 `tokens.json`（overlay）

只写你要改的 token。下面的 `$type`/键写法、以及 `{...}` 引用语法，都来自 core 的真实形状（可对照 `packages/tokens/src/core/*.json`）。

```json
{
  "color": {
    "palette": {
      "brand": { "$value": "#0ea5e9" },
      "ink":   { "$value": "#0b1220" },
      "paper": { "$value": "#fbfcfd" }
    },
    "background": {
      "default":   { "$value": "{color.palette.paper}" },
      "subtle":    { "$value": "#eef4f8" },
      "elevated":  { "$value": "{color.palette.paper}" },
      "inverse":   { "$value": "{color.palette.ink}" }
    },
    "fg": {
      "default": { "$value": "{color.palette.ink}" },
      "muted":   { "$value": "#52606e" }
    }
  },
  "radius": {
    "sm": { "$value": { "value": 6, "unit": "px" } },
    "md": { "$value": { "value": 10, "unit": "px" } },
    "lg": { "$value": { "value": 16, "unit": "px" } }
  }
}
```

**关键规则**
- 引用用 `{...}` 指向已有 token，如 `{color.palette.ink}`；会被编译器展开，避免重复字面量。
- 你**不需要**枚举整个 core——只写要改的。
- 若想**继承另一个主题**而非 core，可在顶层加 `"$extends": "./line/tokens.json"`（ref 必须解析到 `packages/themes/src` 内，不允许逃逸）。

### 2.2 `meta.json`（必填，id 必须等于目录名）

```json
{
  "id": "my-brand",
  "label": "My Brand",
  "preview": { "accent": "#0ea5e9", "surface": "#fbfcfd" },
  "fonts": { "sans": "system-ui, sans-serif" }
}
```

> 构建脚本会断言 `meta.id === 目录名`，不一致会抛错。

### 2.3 `design-rules.json`（必填）

对照官方主题的完整结构（如 `packages/themes/src/line/design-rules.json`）。最小可用版：

```json
{
  "version": "1.0",
  "typography": {
    "scale": "major-third",
    "lineHeightBody": 1.5,
    "fontFamilyToken": "font.family.sans",
    "headingWeightToken": "font.weight.semibold"
  },
  "spacing": {
    "rhythm": 8,
    "density": "comfortable",
    "scale": {
      "strategy": "rem-steps",
      "steps": ["space.0", "space.1", "space.2", "space.3", "space.4", "space.5", "space.6"]
    },
    "radiusStrategy": {
      "default": "radius.md",
      "interactive": "radius.sm",
      "surface": "radius.lg"
    }
  },
  "colorBoundaries": {
    "accentUsage": "primary-actions-only",
    "surfaceLayers": [
      "color.background.default",
      "color.background.subtle",
      "color.background.elevated"
    ]
  },
  "forbiddenPatterns": [],
  "composition": {
    "surfaceHierarchy": "flat",
    "preferredStacks": ["button", "input", "stack"],
    "componentRules": {}
  },
  "rtl": {
    "supported": true,
    "strategy": "logical-properties-only; no runtime DOM mirroring"
  }
}
```

### 2.4 `effects.css`（可选）

需要时补一份 `effects.css`（圆角/阴影/动效语言），构建时会追加进产出的 `variables.css`。不需要就省略。

---

## 3. 第二步：注册进构建

`themes` 的构建脚本 `packages/themes/scripts/build-themes.mjs` 里有一份**硬编码的 `themeIds` 数组**（目前是 8 个官方主题）。把 `my-brand` 加进去：

```js
const themeIds = [
  "line", "silver-arrow", "stuttgart", "corsa", "cupertino", "siren", "wechat", "ant-blue",
  "my-brand", // ← 新增
];
```

然后构建：

```bash
pnpm --filter @chameleon-ui/themes build
```

产物会出现在 `packages/themes/dist/my-brand/variables.css`。

---

## 4. 第三步：暴露导出（可选但推荐）

官方主题有配套的 `./<id>/css`、`./<id>/meta` 等 specifier。推荐在 `packages/themes/package.json` 的 `exports` 里为你的主题加优雅别名：

```jsonc
"./my-brand/css":           { "style": "./dist/my-brand/variables.css", "import": "./dist/my-brand/variables.css", "default": "./dist/my-brand/variables.css" },
"./my-brand/css?raw":       "./dist/my-brand/variables.css",
"./my-brand/meta":          "./dist/my-brand/meta.json",
"./my-brand/design-rules":  "./dist/my-brand/design-rules.json",
"./my-brand/tokens":        "./dist/my-brand/tokens.json"
```

> 即便不加，`./dist/*` 通配符已存在，`@chameleon-ui/themes/dist/my-brand/variables.css` 也可用——但加了别名更符合官方用法。

---

## 5. 使用你的主题

React：

```tsx
import "@chameleon-ui/themes/my-brand/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
import { ThemeProvider } from "@chameleon-ui/react";

<ThemeProvider theme="my-brand">{/* app */}</ThemeProvider>
```

Vue：

```vue
<script setup lang="ts">
import '@chameleon-ui/themes/my-brand/css'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
import { ThemeProvider } from '@chameleon-ui/vue'
</script>
```

> 别忘了同时引入 `@chameleon-ui/tokens/density.css`——否则密度/控件尺寸不随断点切换。

---

## 6. 校验

- `pnpm --filter @chameleon-ui/themes validate-rules` 会对 `design-rules.json` 做 schema 校验。
- `pnpm --filter @chameleon-ui/themes test` 运行主题回归测试。
- 检查产物：`packages/themes/dist/my-brand/variables.css` 应只含覆盖后的变量。
- `meta.id` 必须与目录名一致，否则构建抛错。

---

## 参考

- Token 工作原理（编译 / 引用 / overlay / `$extends`）：[`token-system.md`](./token-system.md)
- 官方主题示例：`packages/themes/src/line/`（最小）、`packages/themes/src/cupertino/`（含 `effects.css`）
- core token 权威源：`packages/tokens/src/core/*.json`
- 主题包文档：[`packages/themes/README.md`](../../packages/themes/README.md)
- token 编译机制：[`packages/tokens/README.md`](../../packages/tokens/README.md)
