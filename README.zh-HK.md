# Chameleon UI

<p align="center">
  <img src="./brand/chameleon-logo.png" alt="Chameleon UI logo" width="200" />
</p>

> **繁體中文（香港）· [简体中文](README.md) · [English](README.en.md) · [العربية](README.ar.md)**

**AI-native · headless-first · 三端一體（390/768/1280）· 跨框架設計系統（React 同 Vue）。**

Chameleon UI 係一套面向 AI 時代嘅設計系統。佢以 **headless（無頭）原語**為基礎，喺同一套 token、契約同架構之上，為 **React 19** 同 **Vue 3.5** 提供完整一致嘅組件庫，並實現**三端一體**（手機 / 平板 / 桌面自適應）。同時透過契約驅動、MCP 同協定轉換器，令 **AI 代理（agent）可以「理解」並且可靠咁組裝或者安裝組件**。

- **組件**：116 個目錄項目（React 同 Vue **框架雙端**對齊 `116/116`）
- **三端一體**：手機 390 / 平板 768 / 桌面 1280 視口自適應（密度、控件、排版隨端變化）
- **主題**：8 套（`linear` / `apple` 雙視覺旗艦 + 6 套致敬覆蓋層）
- **語言**：21 個 locale（ICU MessageFormat），含 RTL（`ar` `ug` `ur` `fa`）
- **Headless**：基於 **Ark UI / Zag**（`primitives` / `primitives-vue` 薄封裝）
- **授權**：MIT。遙測預設關閉（`telemetry-notice.v1`）。

> **現時版本：`0.4.0`（未發佈到 npm）**。喺 npm publish 之前，請用 `link-external` / `pack-external` 或者官方 Vite 模板接入。

---

## 點解揀 Chameleon UI

- **三端一體（390 / 768 / 1280）**：同一套組件，透過容器查詢 + 密度 token，喺手機、平板、桌面三檔視口下自動適應——密度、觸控目標、排版隨端變化；桌面可摺側欄、平板軌道、手機底部 Tab 都係由同一個 `Navigation` 變形而嚟。
- **跨框架一致**：同一套設計 token、同一套組件契約，無差別嘅 React 同 Vue 實現。揀一個 umbrella（`@chameleon-ui/react` 或 `@chameleon-ui/vue`），體驗一致。
- **Headless 核心**：展示邏輯同無頭邏輯分離。要完全控制渲染？可以直接用 `primitives` 層。
- **AI 原生**：每個組件都有機器可讀嘅 `contract.json`（含 `dataAi.role` / `states` / `intents`），`AGENTS.md` 係 AI 消費嘅單一事實來源（SSOT），並透過 MCP server 令代理可以直接查詢契約、安裝組件。
- **契約驅動**：組件清單、契約、設計規則、詞表各自只有一個權威來源，防止文檔同實現漂移。
- **版本化主題同 i18n**：DTCG token 編譯成標準 CSS 變數；主題、語言都係可組合嘅獨立套件。

---

## 快速開始

### 環境要求

- Node `>= 20.19.0`
- pnpm `9.15.0`（建議用 Corepack：`corepack enable`）

### 喺本倉庫內構建 / 執行

```bash
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 check      # lint + typecheck + test + build
```

常用命令（根 `package.json`）：

| 命令 | 作用 |
| :--- | :--- |
| `pnpm build` | 用 Turborepo 全量構建所有套件 |
| `pnpm check` | lint + typecheck + test + build 一站式驗證 |
| `pnpm clean` | 清理 `.turbo` / `dist` / 本地構建緩存 |
| `pnpm publish:check` | 發佈前乾跑檢查（唔會推送） |
| `pnpm ai:check` | 校驗 AGENTS / 契約 / 安裝文檔一致性 |
| `pnpm verify:external` | 校驗官方外部模板可被消費 |

### 喺你嘅應用度使用（npm 發佈前）

兩種方式都**唔需要** `workspace:*`：

```bash
# 1. 打包成 tarball，再喺應用度安裝
node ./scripts/pack-external.mjs            # React umbrella
node ./scripts/pack-external.mjs --vue     # Vue umbrella
npm install <path-to>/dist-tarballs/chameleon-ui-react-0.4.0.tgz

# 2. 或者 npm link
node ./scripts/link-external.mjs --vue --apply
```

官方入門模板：

- [`templates/external-vite-react`](./templates/external-vite-react)
- [`templates/external-vite-vue`](./templates/external-vite-vue)

---

## 軟件套件（Workspace）

倉庫採用 **pnpm + Turborepo** monorepo，21 個 `@chameleon-ui/*` 套件按分層組織。

### 分層規則

| 層 | 包含 | 規則 |
| :--- | :--- | :--- |
| **L1 基礎** | `tokens` · `themes` · `i18n` · `contract` | 框架無關，禁止 `react`/`vue` 依賴 |
| **L1 原語** | `primitives` · `primitives-vue` | 只薄封裝 `@ark-ui/*` / Zag；peer 對應框架 |
| **L2 組件** | `components` · `components-vue` | 只依賴 L1；**禁止直接 `import '@ark-ui/*'`** |
| **L3/L4 轉換** | `adapter-*` · `schema-renderer` | 協定映射；寫盤只經 `install-core` |
| **安裝內核** | `install-core` | **唯一**寫盤入口 |
| **目錄** | `registry` · `registry-private` | 唯讀 / 私有服務，唔寫盤 |
| **外殼/服務** | `cli` · `mcp-server` · `market-service` | 薄外殼，寫盤全部收斂到 `install-core` |
| **消費傘包** | `react` · `vue` | 一個依賴即可，面向最終消費者 |

### 套件速覽

| 套件 | 說明 |
| :--- | :--- |
| `@chameleon-ui/tokens` | DTCG 設計 token 權威源 + 確定性 CSS 變數編譯 |
| `@chameleon-ui/themes` | 主題覆蓋層同 `design-rules`（`linear` / `apple` 雙旗艦 + 6 套致敬） |
| `@chameleon-ui/contract` | 組件同設計規則嘅 JSON Schema + 校驗 |
| `@chameleon-ui/i18n` | ICU MessageFormat 執行期、C3 Map 查詢、偽本地化工具 |
| `@chameleon-ui/primitives` · `primitives-vue` | Ark UI / Zag 薄封裝（headless 內核） |
| `@chameleon-ui/components-react` | React 組件實現（116 slugs + 契約檔案） |
| `@chameleon-ui/components-vue` | Vue 組件（116/116 slugs + ThemeProvider） |
| `@chameleon-ui/react` | React 消費傘包（統一入口） |
| `@chameleon-ui/vue` | Vue 消費傘包（統一入口） |
| `@chameleon-ui/install-core` | 唯一寫盤內核：依賴圖、衝突偵測、冪等複製 |
| `@chameleon-ui/registry` | 組件/主題目錄（catalog） |
| `@chameleon-ui/registry-private` | 本地內網私有目錄伺服器 |
| `@chameleon-ui/cli` | `chameleon` CLI，薄殼指向 `install-core` |
| `@chameleon-ui/mcp-server` | MCP server（代理可查詢契約 / 安裝組件） |
| `@chameleon-ui/schema-renderer` | JSON Schema → 組件樹渲染（預設 10 slugs） |
| `@chameleon-ui/blocks` | 可組合業務場景塊 |
| `@chameleon-ui/adapter-a2ui` | A2UI 協定轉換 |
| `@chameleon-ui/adapter-ag-ui` | AG-UI 協定轉換（**POC**，非正式支援） |
| `@chameleon-ui/adapter-mcp-apps` | MCP Apps（SEP-1865）協定轉換（**POC**） |
| `@chameleon-ui/market-service` | 主題市場 / 社區紀律套件服務 |
| `@chameleon-ui/utils` | 通用工具（PNG/圖像基本操作，純 JS 零原生依賴） |

---

## 三端一體（手機 / 平板 / 桌面）

Chameleon UI 嘅核心體驗係**一套組件自動適應三種視口**——390（手機）、768（平板）、1280（桌面），而唔係每種形態各寫一套。

驅動機制：

| 維度 | 三檔 | 說明 |
| :--- | :--- | :--- |
| 斷點 | `<768` / `768–1279` / `≥1280` | Token `--cu-breakpoint-{mobile,tablet,desktop}` |
| 密度 | `comfortable` / `standard` / `compact` | 隨端預設（手機舒適 / 平板標準 / 桌面緊湊），可用 `[data-density]` 覆蓋 |
| 控件 | 36 / 40 / 44px | `--cu-control-size-{compact,standard,comfortable}` |
| 排版 | `clamp()` 流體 | 隨 `20rem → 80rem` 縮放 |

- **寬度響應走 `@container` 容器查詢**，唔直接用 `@media` 寬度斷點（stylelint 會攔截）。
- 消費 `@chameleon-ui/tokens/css` 時**必須同時**引入 `@chameleon-ui/tokens/density.css`，否則密度/控件尺寸唔會隨斷點切換。
- 應用外殼同導航：`AppShell` 提供三檔應用骨架，`Navigation` 用同一個 `items` API，喺桌面側欄 / 平板可摺 / 手機底部 Tab 之間變形；`SafeArea` 處理劉海同手勢條安全區。

三檔相關組件：`AppShell` · `Navigation` · `NavigationTitle` · `Sidebar` · `TabBar` · `ActionSheet` · `SafeArea`。

三端一體嘅完整工作原理（斷點 token、容器查詢 vs `@media`、隨端密度、Navigation 變形、以及「點解分 React/Vue」）：[**三端一體工作原理**](./docs/theming/three-end-system.zh-HK.md)。

---

## 組件同主題

### 組件（103）

完整清單嘅單一權威來源：[`packages/components-react/catalog.json`](./packages/components-react/catalog.json)。每個組件仲帶一份機器可讀嘅契約：

- `contract.json`（含 `dataAi.role` / `states` / `intents`）
- 21 個 locale 嘅文案表
- 樣式、類型、測試

### 主題（8）

| 主題 | 說明 |
| :--- | :--- |
| `linear` | **視覺旗艦**（深色優先，Linear 值級復刻；產品預設外觀） |
| `apple` | **視覺旗艦**（淺色優先，HIG / iOS 值級復刻；支援手動切深色） |
| `mercedes` `porsche` `ferrari` `tiktok` `wechat` `alipay` | 致敬覆蓋層 |
| `community-focus-first` | 社區紀律套件（`registry:rules`）種子 |

> **狀態說明**：`linear` 同 `apple` 係兩套經過完整斷言驗證嘅視覺旗艦（色值、動效、字級、圓角全部上鎖），預設用 `linear`；「似唔似原品」嘅觀感驗收仍以瀏覽器實測為準。其餘 6 套致敬覆蓋層**仍在打磨中**，可作為靈感同探索使用。

- **Token 系統點樣工作**：由 DTCG 權威源到 `--cu-*` 編譯、引用解析、環偵測同 overlay/`$extends` 繼承機制，見 [**Token 工作原理**](./docs/theming/token-system.zh-HK.md)。
- 想加自己嘅主題？主題係 **overlay**（只覆蓋 core token 子集）。分步教學：[**建立自訂主題**](./docs/theming/creating-a-theme.zh-HK.md)。

### 語言同 RTL

- 21 個 locale（見 `catalog.json`）
- RTL 語言：`ar` `ug` `ur` `fa`
- 用 `directionForLocale`（`@chameleon-ui/i18n`）決定方向，唔好自己估 `dir`

---

## AI 使用（首選入口）

**`AGENTS.md` 係成個庫對 AI 消費嘅 SSOT**。無論你係模型、代理,定係想「俾 AI 幫你組裝」,都由佢開始。

- [`AGENTS.md`](./AGENTS.md) — AI 消費嘅完整規則（CSS、JS 引入、安裝、MCP、禁止項）
- [`docs/ai/`](./docs/ai/) — 附加說明（消費流程、SchemaRenderer、詞表、主題延伸、社區套件）
- [**AI 工作原理**](./docs/ai/how-ai-works.zh-HK.md) — 契約驅動、意圖詞表、MCP 鏈路、映射→渲染→安裝 三層嘅端到端機制

如果掛載咗 MCP，標準嘅工具調用順序係：

`get_started` → `get_import_specifiers`（寫 import 前）→ `get_contract`（發組件前）→ `get_design_rules`（處理密度/RTL 前）

**一切磁碟寫入都必須經過 `install-core`**（`chameleon add` / MCP `install_*`），禁止喺第度另寫一套。

---

## 目錄結構

```
.
├── packages/                # 全部 @chameleon-ui/*
├── scripts/                 # lib 構建 / pack / link / publish:check / ai:check
├── templates/               # 官方外部 Vite 工程（React / Vue）
├── docs/ai/                 # AI 消費說明（SSOT 為 AGENTS.md）
├── brand/                   # Logo / 品牌資產
├── AGENTS.md                # AI 消費 SSOT
├── STRUCTURE.md             # 詳細目錄地圖
└── LICENSE · CONTRIBUTING.md · SECURITY.md · CHANGELOG.md
```

> 維護者嘅 lint / 構建工具、體積預算等**唔喺本倉庫內**（位於倉庫外部），與消費者無關。

---

## 參考文檔

| 主題 | 位置 |
| :--- | :--- |
| 目錄地圖 | [`STRUCTURE.md`](./STRUCTURE.md) |
| AI 消費規則 | [`AGENTS.md`](./AGENTS.md) |
| 版本變更 | [`CHANGELOG.md`](./CHANGELOG.md) |
| 貢獻指南 | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| 安全政策 | [`SECURITY.md`](./SECURITY.md) |

---

## License

[MIT](./LICENSE)
