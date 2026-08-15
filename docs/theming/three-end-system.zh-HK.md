# 三端一體工作原理

> **繁體中文（香港）· [简体中文](three-end-system.md) · [English](three-end-system.en.md) · [العربية](three-end-system.ar.md)**

「三端一體」指 Chameleon UI 用**同一套組件**自動適應**三種裝置形態**——手機（390）、平板（768）、桌面（1280），而唔係每種形態各寫一套。本文講清楚佢嘅**真實機制**。

> 配套：Token 點樣編譯見 [`token-system.zh-HK.md`](./token-system.zh-HK.md)；點樣建主題見 [`creating-a-theme.zh-HK.md`](./creating-a-theme.zh-HK.md)。

---

## 0. 先釐清一個概念：React / Vue 同「三端」嘅關係

講三端之前必須先講清楚「框架」呢一度，避免混淆兩個唔同嘅「端」：

- **框架維度 = React、Vue**（兩個渲染適配層）。見下節。
- **視口/形態維度 = 手機、平板、桌面（三端一體）**。呢個先係「三端」。

兩者正交：React 同 Vue **各自都實現三端一體**。所以「三端一體」唔係某個框架獨有，而係設計系統嘅共同能力。

### 點解要區分 React 同 Vue？

因為底層 **headless 內核（Ark UI / Zag）係按框架打包嘅**，冇辦法跨框架共用介面：

| | React 線 | Vue 線 |
| :--- | :--- | :--- |
| headless 內核 | `@ark-ui/react` → `primitives` | `@ark-ui/vue` → `primitives-vue` |
| 組件殼 | `components`（`*.tsx`） | `components-vue`（`*.vue`） |
| 消費傘包 | `@chameleon-ui/react` | `@chameleon-ui/vue` |

但呢兩條線**共享同一套設計層**，所以唔係「兩套隨機庫」，而係「一個設計系統 × 兩個渲染適配」：

- **單一 catalog**：`components/catalog.json`（103 組件）係唯一權威，Vue **冇自己嘅 catalog**。
- **同一契約**：`contract.json` 被 React 同 Vue 共用（`Button` 嘅 props/a11y/RTL 行為完全一致）。
- **同一 token / i18n / 主題**：`tokens`、`i18n`（21 語言）、`themes` 全部雙端共用。

結論：**設計決策喺共享嘅 L1（token/契約/i18n）層，React/Vue 只負責將同一套語義「翻譯」成各自框架嘅組件**。呢個就係「雙框架一致」嘅根基，亦都係點解分 React/Vue、而唔係淨做一套。

---

## 1. 三端 = 三個斷點檔位

三端嘅物理基礎係三檔**斷點 token**（定義喺 `packages/tokens/src/core/breakpoint.json`）：

| 檔 | token | 值 | 範圍 |
| :--- | :--- | :--- | :--- |
| mobile | `breakpoint.mobile` | `0px` | `< 768px` |
| tablet | `breakpoint.tablet` | `48rem` | `768 – 1279px` |
| desktop | `breakpoint.desktop` | `80rem` | `≥ 1280px` |

斷點用 **rem**（而唔係 px）表達，保證跟住根字號縮放、放大唔會變形。呢個亦都係 `390 / 768 / 1280` 呢啲數字嘅來源（@16px root）。

---

## 2. 三端最核心嘅機制：容器查詢（`@container`）而唔係 `@media`

傳統做法用 `@media (min-width: 1280px)` 按**視口**切換。Chameleon UI 用嘅係**容器查詢**：組件睇**自己所在容器**嘅寬度，而唔係成個瀏覽器視口。

```
組件自身寬度 =  < 20rem    → 手機形態
               48–80rem   → 平板形態（可摺 rail）
              ≥ 80rem     → 桌面形態（持久側欄）
```

**點解用容器查詢？**
- 組件喺「嵌入窄 sidebar」定「佔滿闊視口」時，應該按**自身可用寬度**變形，而唔係按瀏覽器窗口。
- 例如 Navigation（見第 4 節）用 `@container navigation (min-width: …)` 判斷自己容器寬度嚟決定側欄/可摺/Tab。

**門禁保證**：組件 CSS **禁止直接消費 `@media` 寬度斷點**（stylelint `chameleon/no-breakpoint-literal` 會攔截），寬度響應一律走 `@container`——保證機制唔會被繞過、保持一致。

---

## 3. 密度同控件隨端變化

三端唔止有「佈局」差異，仲有**密度**差異：同一個組件喺手機上更鬆動（觸控友好）、喺桌面上更緊湊。

### 3.1 密度 token（`density.json`）

| token | 係數 |
| :--- | :--- |
| `density.compact` | `0.875` |
| `density.standard` | `1` |
| `density.comfortable` | `1.125` |

控件最小高度三檔：`control.size.{compact,standard,comfortable}` = `2.25 / 2.5 / 2.75rem`（即 36 / 40 / 44px @16px root）。`touch-target.min` = `2.75rem`（44px，觸控無障礙下限）。

### 3.2 隨端預設密度

`@chameleon-ui/tokens/density.css`（由 `scripts/density-css.mjs` 產生）提供**隨斷點變化嘅預設密度**：

| 端 | 預設密度 |
| :--- | :--- |
| mobile | `comfortable`（鬆動，44px 觸控目標） |
| tablet | `standard` |
| desktop | `compact`（緊湊） |

**雙通道切換**：
- **視口級**：`@media` 覆蓋頁面級 shell（成個頁面隨窗口寬度變密度）。
- **容器級**：`@container app-shell` 覆蓋「寬視口裡內嵌嘅窄 shell」（如 dashboard 內嵌細面板）——呢個係 `A5.3` 場景。
- **顯式覆蓋**：`<html data-density="compact|standard|comfortable">` 可以強制指定某檔，唔受斷點影響。

**重要**：消費 `@chameleon-ui/tokens/css` 嘅應用**必須同時** `import '@chameleon-ui/tokens/density.css'`，否則 `--cu-density-active` / `--cu-control-size-active` 唔會隨斷點切換。

---

## 4. 三端導航：同一個 API，三種形態

應用骨架（`AppShell`）同導航（`Navigation`）係「三端一體」最直觀嘅展示——**用同一份 `items` 數據，喺三種寬度下呈現三種形態**：

| 端 | Navigation 形態 |
| :--- | :--- |
| 手機（窄容器） | 底部 **Tab Bar**（緊湊），溢出項收進 `More` |
| 平板 | **可摺疊 rail** |
| 桌面（寬容器） | **持久側欄** |

實現：`Navigation` 嘅 CSS 用容器查詢按 `min-width: 48rem / 80rem` 切換形態：

```css
@container navigation (min-width: 80rem) { /* 側欄形態 */ }
@container navigation (min-width: 48rem)  { /* rail 形態 */ }
@container navigation (max-width: 20rem)  { /* Tab 形態 */ }
```

配套三端組件：`AppShell`（三端應用骨架）· `SafeArea`（劉海/手勢條安全區）· `ActionSheet`（手機底部動作面板）· `Navbar` / `NavigationBar`（橫向列隊導航）。

---

## 5. 工作流：點解「一套程式、三種形態」唔會爆

- **樣式**：單個組件樣式用容器查詢寫三檔，CSS 自訂屬性（`--cu-*`）承載 token 值。
- **JS/邏輯**：同一份組件 API（`items`、`locale`、props）——形態切換係純 CSS 嘅，唔會改變數據結構。
- **契約**：`contract.json` 記錄 `responsive` 同三端行為，React/Vue 雙端共享。

於是「三端一體」唔係三份實現，而係**一份契約 + 一份互動邏輯 + 容器查詢樣式**，喺三種寬度下自動變形。

---

## 6. 快速自查

1. 切換咗三端冇效？
   - 確認引入咗 `@chameleon-ui/tokens/density.css`（見 3.2）。
   - 確認冇被 stylelint 擋住 `@media` 寬度斷點（應改 `@container`）。
2. 某組件嵌入窄容器冇縮細？
   - 佢依賴嘅容器需要設 `container-type: inline-size`（如 Navigation 容器、AppShell）。
3. `data-density` 冇效？
   - `density.css` 未引入，或者 `[data-density]` 拼寫不符 `compact|standard|comfortable`。

---

## 參考

- 斷點/密度 token 源：`packages/tokens/src/core/breakpoint.json` · `density.json`
- 密度產生腳本：`packages/tokens/scripts/density-css.mjs`
- 三端導航樣式：`packages/components/src/navigation/styles.css`
- 應用骨架樣式：`packages/components/src/app-shell/styles.css`
- Token 工作原理：[`token-system.zh-HK.md`](./token-system.zh-HK.md)
- Token 套件文件：[`packages/tokens/README.md`](../../packages/tokens/README.md)
