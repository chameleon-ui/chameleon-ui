# Token 工作原理

> **繁體中文（香港）· [简体中文](token-system.md) · [English](token-system.en.md) · [العربية](token-system.ar.md)**

本文說明 Chameleon UI 嘅 **design token 系統**點樣運作：由一份 DTCG 風格嘅 JSON 權威源，到瀏覽器可用嘅 CSS 自訂屬性（`--cu-*`）。理解呢個機制，係使用/覆蓋 token、建立同繼承主題嘅基礎。

> 配套：[建立自訂主題](./creating-a-theme.zh-HK.md) 講「點樣覆蓋 token 嚟做主題」；本文講「token 系統本身點樣運轉」。

---

## 1. 一幅圖

```
packages/tokens/src/core/*.json   ← DTCG 權威源（唯一）
        │  flattenTokens(展平)
        ▼
  扁平 token 列表（path → value）
        │  resolveTokens(解析引用 + 環偵測)
        ▼
  已解析嘅 token（無 {…} 引用）
        │  renderCss
        ▼
  :root { --cu-color-fg-default: …; … }   ← dist/css/variables.css
```

主題路徑上多咗**一步 overlay**：

```
core 目錄 + 主題 tokens.json(overlay)  → overlayTokenTrees(深合併)  → 編譯 → 主題 variables.css
```

---

## 2. 權威源：`src/core/*.json`

所有設計決策嘅唯一數值來源係 `packages/tokens/src/core/` 下嘅幾個 DTCG 檔案：

`color.json` · `space.json` · `radius.json` · `shadow.json` · `motion.json` · `typography.json` · `blur.json` · `breakpoint.json` · `density.json`

- 結構係**巢狀 DTCG 物件**：組（group）下面掛葉子（leaf），葉子由 `$type` + `$value` 定義。
- 一個真實例子：

```json
{
  "color": {
    "palette": {
      "brand": { "$value": "#2563eb", "$type": "color" }
    },
    "background": {
      "default": { "$value": "{color.palette.paper}" }
    }
  }
}
```

- `$value` 可以直接係值，都可以係 `{...}` 引用（見第 4 節）。
- core 係**單一權威**：組件、主題都消費佢編譯出嚟嘅產物，唔會各自複製一份數值。

---

## 3. 編譯三步（`token-compiler.mjs`）

`@chameleon-ui/tokens/compiler` 嘅 `compileTokenObject(root)` 按三步處理：

### 3.1 `flattenTokens` — 展平

將巢狀 JSON 展平成一個 **path → value** 嘅扁平列表，例如 `color.fg.default`、`space.2`。複雜度 O(n)。

### 3.2 `resolveTokens` — 解析引用

將每個 `{...}` 引用解析成真實值（例如 `{color.palette.paper}` → `#ffffff`）。呢個階段會：

- **環偵測**：`a` 引用 `b` 又引用 `a` → 拋錯，絶對唔會產生「部分成功」嘅 CSS。
- **未知引用**、重複路徑、不可序列化值 → 拋錯（錯誤含路徑 + 原因 + 下一步）。

### 3.3 `renderCss` — 產生 CSS 變數

將每個 token 路徑轉成 CSS 自訂屬性名：

```
color.fg.default  →  --cu-color-fg-default
space.2           →  --cu-space-2
breakpoint.mobile →  --cu-breakpoint-mobile
```

規則（見 `cssVariableName`）：

- 前綴固定 `--cu-`（常數 `tokenCssVariablePrefix`）。
- 路徑段用 `-` 連接；非法字元替換為 `-`，並轉小寫。
- 若多個路徑歸一化到同一變數名 → 拋錯（保證每個 `--cu-*` 唯一）。

產物裝入 `:root { … }`，預設載入進 `@chameleon-ui/tokens/css`。

---

## 4. 引用語法 `{...}`

- `$value` 裡面可以用 `{<path>}` 引用另一個 token，例如 `{color.palette.ink}`。
- 引用解析後**唔會再保留**喺輸出度；`dist/tokens.json` 係已解析嘅扁平表，JS/TS 可以直接消費。
- 引用唔會造成循環（環偵測會攔住）。

---

## 5. 主題 = overlay（覆蓋 core）

主題**唔複製** core 源，而係提供一個 **overlay**：`packages/tokens/src/core/` 係基底，主題嘅 `tokens.json` 只寫「要覆蓋嘅子集」，由 `overlayTokenTrees` 做**深合併**（`compileThemeTokens(coreDirectory, overlay, label)`）：

- **葉子命中** → 用 overlay 嘅葉子覆蓋 core 嘅葉子。
- **組唔喺 core** → 作為新組加入。
- **組遞歸深合併**：只覆蓋提及嘅分支，未提及嘅保持 core 值。
- **約束**：唔可以用一個組去覆蓋一個已有葉子；`$` 開頭嘅中繼資料（`$type`/`$description`）直通，唔會喺 overlay 度被當成 token 組。

> 複雜度 O(n log n)，空間 O(n)。保證：overlay 替換 core 葉子時**唔複製 core 源樹**。

例子：core 定義 `color.background.subtle = #f6f6f4`，某主題 overlay：`{ "color": { "background": { "subtle": { "$value": "#eef4f8" } } } }` → 最終該變數係 `#eef4f8`，其餘背景色唔變。

---

## 6. `$extends`：主題繼承

一個主題嘅 overlay 文件可以聲明 `"$extends": "<ref>" | ["<ref>", ...]`，從而繼承一個或多個基礎主題/文件：

- **合併順序**：父文件按陣列順序，derived（派生文件）最後——後者喺葉子衝突時勝出；組按 overlay 嘅深合併規則。
- **環安全**：最大繼承深度 16（`MAX_EXTENDS_DEPTH`），循環引用會畀出可讀嘅 chain 報錯。
- **ref 解析**：由調用方注入嘅 `loadRef` 完成（本倉庫係檔案系統，而且**限定喺 `packages/themes/src` 內**，禁止逃逸到任意路徑）。
- 複雜度 O(n + e)，空間 O(d)，d ≤ 16。
- **`$extends` 唔會泄漏進輸出**。

---

## 7. 產物

一次編譯產出三份視圖（`compileTokenObject` 嘅返回值，都寫盤）：

| 產物 | 內容 |
| :--- | :--- |
| `css` | `:root { --cu-…: … }`（供 `@chameleon-ui/tokens/css` 同各主題 `/css`） |
| `dtcg` | 已解析嘅 DTCG 樹（`toResolvedDtcgTree`） |
| `tokens` | 扁平 resolved token 列表（`dist/tokens.json`） |

**確定性保證**：輸出唔含時間戳；相同輸入位元組級一致。穩定排序、memo 化引用解析（攤還 O(d)，最大深度 32）。

---

## 8. 約定與限制

- **唔依賴框架**：token 編譯只發生喺構建期，禁止 React / Vue / Svelte。
- **組件 CSS 唔直接消費 `@media` 寬度斷點**；三端（390/768/1280）用 `@container` + `--cu-*` 斷點/密度 token（見 [`tokens/README.md`](../../packages/tokens/README.md) 嘅三端章節）。
- **`dist/css/variables.css` 係生成物，唔好手改**。

---

## 參考

- 編譯實作：[`packages/tokens/scripts/token-compiler.mjs`](../../packages/tokens/scripts/token-compiler.mjs)
- core 權威源：[`packages/tokens/src/core/`](../../packages/tokens/src/core/)
- token 套件文件：[`packages/tokens/README.md`](../../packages/tokens/README.md)
- 用 overlay 建主題：[`建立自訂主題`](./creating-a-theme.zh-HK.md)
