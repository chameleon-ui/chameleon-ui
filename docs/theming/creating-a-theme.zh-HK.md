# 建立自訂主題

> **繁體中文（香港）· [简体中文](creating-a-theme.md) · [English](creating-a-theme.en.md) · [العربية](creating-a-theme.ar.md)**

呢個教學教你為 Chameleon UI 加**自己嘅主題**。佢基於真實機制：主題係一個 **overlay**——只覆蓋 core token 嘅某啲子集，而唔複製整套設計 token；再由 `themes` 嘅構建腳本編譯成一份 CSS 變數檔。

> 前提：你已喺倉庫根行過 `pnpm install`，了解 `packages/themes` 同 `packages/tokens`。

---

## 1. 理解主題 = overlay

- **core** 喺 `packages/tokens/src/core/`——係全部設計 token 嘅單一權威來源（顏色、間距、圓角、陰影、動效、排版）。
- **主題目錄**喺 `packages/themes/src/<id>/`，入面嘅 `tokens.json` 只描述**你要改嘅部分**。未覆蓋嘅 token 由 core 繼承。
- 組件 CSS 同主題透過 **CSS 自訂屬性**（`--cu-*`）消費呢啲值。

一個最小主題目錄有 4 個檔案：

```
src/<id>/
├── tokens.json        # overlay：覆蓋 core token 子集（必填）
├── design-rules.json  # 排版/間距/圓角/對比/禁用模式等規則（必填）
├── meta.json          # id / label / preview / fonts（必填，id 必須=目錄名）
└── effects.css        # 可選：圓角/陰影/動效語言，構建時追加進 CSS
```

---

## 2. 第一步：建主題目錄

喺 `packages/themes/src/` 下新建目錄（ids 用小寫連字符，如 `my-brand`）：

```bash
mkdir packages/themes/src/my-brand
```

### 2.1 `tokens.json`（overlay）

只寫你要改嘅 token。下面嘅 `$type`/鍵寫法、以及 `{...}` 引用語法，都同 core 真實形狀一致（可對照 `packages/tokens/src/core/*.json`）。

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

**關鍵規則**
- 引用用 `{...}` 指向已有 token，如 `{color.palette.ink}`；會被編譯器展開，避免重複字面值。
- 你**唔需要**列晒成個 core——只寫要改嘅。
- 若想**繼承另一個主題**而唔係 core，可喺頂層加 `"$extends": "./line/tokens.json"`（ref 必須解析到 `packages/themes/src` 內，唔允許逃逸）。

### 2.2 `meta.json`（必填，id 必須等於目錄名）

```json
{
  "id": "my-brand",
  "label": "My Brand",
  "preview": { "accent": "#0ea5e9", "surface": "#fbfcfd" },
  "fonts": { "sans": "system-ui, sans-serif" }
}
```

> 構建腳本會斷言 `meta.id === 目錄名`，唔一致會拋錯。

### 2.3 `design-rules.json`（必填）

對照官方主題嘅完整結構（如 `packages/themes/src/linear/design-rules.json`）。最小可用版：

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

### 2.4 `effects.css`（可選）

需要時補一份 `effects.css`（圓角/陰影/動效語言），構建時會追加進產出嘅 `variables.css`。唔需要就省略。

---

## 3. 第二步：註冊進構建

`themes` 嘅構建腳本 `packages/themes/scripts/build-themes.mjs` 入面有一份**硬編碼嘅 `themeIds` 陣列**（目前 8 個官方主題）。將 `my-brand` 加埋落去：

```js
const themeIds = [
  "linear", "mercedes", "porsche", "ferrari", "apple", "tiktok", "wechat", "alipay",
  "my-brand", // ← 新增
];
```

然後構建：

```bash
pnpm --filter @chameleon-ui/themes build
```

產物會出現喺 `packages/themes/dist/my-brand/variables.css`。

---

## 4. 第三步：暴露導出（可選但推薦）

官方主題有配套嘅 `./<id>/css`、`./<id>/meta` 等 specifier。推薦喺 `packages/themes/package.json` 嘅 `exports` 度為你嘅主題加優雅別名：

```jsonc
"./my-brand/css":           { "style": "./dist/my-brand/variables.css", "import": "./dist/my-brand/variables.css", "default": "./dist/my-brand/variables.css" },
"./my-brand/css?raw":       "./dist/my-brand/variables.css",
"./my-brand/meta":          "./dist/my-brand/meta.json",
"./my-brand/design-rules":  "./dist/my-brand/design-rules.json",
"./my-brand/tokens":        "./dist/my-brand/tokens.json"
```

> 就算唔加，`./dist/*` 通配符已經存在，`@chameleon-ui/themes/dist/my-brand/variables.css` 都用得——但加別名更符合官方用法。

---

## 5. 使用你嘅主題

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

> 唔好漏咗同時引入 `@chameleon-ui/tokens/density.css`——否則密度/控件尺寸唔會隨斷點切換。

---

## 6. 校驗

- `pnpm --filter @chameleon-ui/themes validate-rules` 會對 `design-rules.json` 做 schema 校驗。
- `pnpm --filter @chameleon-ui/themes test` 執行主題回歸測試。
- 檢查產物：`packages/themes/dist/my-brand/variables.css` 應只含覆蓋後嘅變數。
- `meta.id` 必須同目錄名一致，否則構建拋錯。

---

## 參考

- 官方主題示例：`packages/themes/src/linear/`（最細）、`packages/themes/src/apple/`（含 `effects.css`）
- core token 權威源：`packages/tokens/src/core/*.json`
- 主題套件文件：[`packages/themes/README.md`](../../packages/themes/README.md)
- token 編譯機制：[`packages/tokens/README.md`](../../packages/tokens/README.md)
- Token 系統點樣運作：[`token-system.zh-HK.md`](./token-system.zh-HK.md)
