# AI 工作原理

> **繁體中文（香港）· [简体中文](how-ai-works.md) · [English](how-ai-works.en.md) · [العربية](how-ai-works.ar.md)**

本文說明 Chameleon UI 嘅 **AI 機制點樣端到端運作**：AI（agent / 模型）點樣「理解」組件、點樣攞到**合法且可靠**嘅用法、以及點樣**安裝**組件/主題。呢個係架構層面嘅機制說明；具體操作規則以 [`AGENTS.md`](../../AGENTS.md) 為唯一事實來源（SSOT）。

> 一句講晒：Chameleon UI 令**機器可讀嘅契約**驅動一切——AI 唔係靠估，而係透過查詢契約同詞表嚟組裝所見即所得嘅組件，而且寫盤始終收斂到一個內核。

---

## 1. 核心思想：契約驅動

傳統組件庫對 AI 係「黑盒」——AI 只能由 README/例子估用法，好容易作造 import、錯 props 或者唔存在嘅路徑。Chameleon UI 反轉嚟：**每個組件都帶一份機器可讀嘅 `contract.json`**，AI 直接讀佢就可以攞到權威、可校驗嘅用法。

每個組件嘅 `contract.json`（位於 `packages/components-react/src/<slug>/contract.json`）包含：

- `slug` / `name` / `schemaVersion`
- `props` / `variants` / `states`
- `composition` / `antiPatterns`（唔應該點樣用）
- `a11y`（無障礙要求）
- `responsive` / `rtl`（三端同 RTL 行為）
- **`dataAi`**：`{ "role", "states", "intents" }` —— 機器可讀嘅行為語義
- `usage` / `exports` / `mechanics`

真實例子（button 嘅 `dataAi`）：

```json
{
  "role": "button",
  "states": ["default", "loading", "disabled"],
  "intents": ["submit", "confirm", "cancel"]
}
```

契約由 [`@chameleon-ui/contract`](../../packages/contract/README.md) 用統一 schema **強制全量校驗**：catalog 入面每個 slug 都必須有合法契約，否則 CI 變紅。所以「契約係可信」唔係靠自覺，而係被門禁保證。

---

## 2. 意圖詞表：data-ai-vocabulary

AI 搜索/描述組件嗰陣，用一個**凍結嘅意圖詞表**嚟對齊語義：

[`docs/ai/data-ai-vocabulary.json`](./data-ai-vocabulary.json) 定義一組標準 `intents`（目前 **70** 個），例如 `submit`、`cancel`、`choose-option`、`confirm`。

- 每個 intent 係一句英文語義描述（如 `adjust-value`: "Adjust a numeric value along a range."）。
- 作用：令「需求描述」同「組件能力」用**同一個詞彙表**對接，令 AI 嘅搜索/推薦可解釋、可預測。
- 詞表係**凍結**嘅：新增 intent 之前必須先喺度登記，再由 `catalog-data-ai.test.ts` 同 `generate-data-ai-vocabulary.mjs --check` 雙向防漂移。

---

## 3. 兩條消費路徑

AI 消費 Chameleon UI 有**兩條**路徑，由「有冇掛載 MCP」決定：

### 路徑 A：掛載 MCP（推薦俾準生產 AI 工作流）

`@chameleon-ui/mcp-server` 提供一個 stdio 嘅 [Model Context Protocol](../../packages/mcp-server/README.md) server，AI 透過工具調用**實時查詢**，而唔係靠估：

| 時機 | 工具 |
| :--- | :--- |
| 第一次 | `get_started`（目錄摘要、主題、工具順序、禁止項） |
| 寫任何 CSS/JS import 之前 | `get_import_specifiers`（返回**合法** specifier） |
| 揀組件 | `list_components` / `search_components`（按 `intent`） |
| 發組件 JSX/SFC | `get_contract`（v0.2 契約） |
| 處理密度 / 半徑 / RTL | `get_design_rules` |
| 列出主題 | `list_themes` |
| 落地安裝 | `install_with_theme` 等 `install_*` |

唯讀工具唔寫盤；**一切寫盤經 `install-core`**。

### 路徑 B：唔掛載 MCP（零依賴）

AI 直接讀倉庫入面嘅 `AGENTS.md` 同 `docs/ai/`，由檔案系統攞契約、複製官方 import specifier。此時**禁止作造**替代路徑或 specifier——`AGENTS.md` 嘅規則就係要防「估」。

---

## 4. 三層職責：映射 → 渲染 → 安裝

協定文件（A2UI / MCP Apps / AG-UI）要變成真實嘅 Chameleon 組件，經過三層分工，**協定欄位絶不會泄漏入 L1/L2**：

| 層 | 套件 | 職責 | 寫盤？ |
| :--- | :--- | :--- | :--- |
| 協定映射 | `adapter-a2ui` / `adapter-mcp-apps` / `adapter-ag-ui` | 協定文件 → render node / 安裝計劃 | 否（返回計劃） |
| 執行期渲染 | `schema-renderer` | JSON render-schema → **真實組件樹**（預設 10 slugs） | 否 |
| 安裝內核 | `install-core` | 按計劃**落盤**（依賴圖、衝突偵測、冪等） | **係（唯一）** |

- `schema-renderer` 共享 catalog 嘅 slug 命名，但唔感知任何協定欄位。
- adapters 同 schema-renderer 係**旁路**（L3/L4），唔污染 headless 內核。
- 實例：某個 `schema-renderer` 嘅 JSON 輸入：

```json
{
  "version": "1.0",
  "root": {
    "component": "stack",
    "props": { "direction": "column", "gap": "2" },
    "children": [
      { "component": "heading", "props": { "level": "level-2" }, "children": ["Sign in"] }
    ]
  }
}
```

---

## 5. AI 組裝嘅安全邊界（NEVER）

`AGENTS.md` 用一個明確嘅 **NEVER 清單** 約束 AI，防止產生壞程式：

- **禁止**作造 `@chameleon-ui/*/css` 嘅 specifier，或者喺消費者入面寫 `workspace:*`。
- **禁止**同時引入 `@chameleon-ui/react` 同 `@chameleon-ui/vue`。
- **禁止**當 AG-UI adapter 係 supported 協定（佢係 POC）。
- **禁止**作造性能數字、盲測識別率、無障礙認證。
- **禁止**喺 `install-core` 之外寫第二條安裝路徑。
- **禁止**幫 `@chameleon-ui/*` CSS 加 `resolve.alias` hack —— 套件 `exports` 必須要能自行解析。

呢啲唔係建議，而係 CI/門禁會攔嘅硬約束。

---

## 6. 工作流示例：AI 加一個登入表單

1. `get_started` → 攞到主題 `linear`、CSS 引入、工具順序。
2. `search_components`(`intent: "authenticate"`)→ 命中 `login` / `input` / `password-input`。
3. `get_import_specifiers` → 攞到呢組組件嘅**合法** import。
4. `get_contract`(`input`)→ 攞到 props / a11y / antiPatterns。
5. `get_design_rules`(`linear`)→ 攞到密度 / RTL / 間距規則。
6. 產出 JSX/SFC，用官方 specifier 引入，零 `resolve.alias`。
7. 如需落盤：`install_with_theme`（經 install-core 冪等寫入）。

成條鏈路**每一步都有權威來源**，AI 唔需要估。

---

## 7. 相關文件

| 主題 | 位置 |
| :--- | :--- |
| AI 消費規則（SSOT） | [`AGENTS.md`](../../AGENTS.md) |
| Agent 消費流程 | [`docs/ai/agent-consume.md`](./agent-consume.md) |
| 契約欄位映射 | [`docs/ai/component-contract-v0.2-mapping.md`](./component-contract-v0.2-mapping.md) |
| 意圖詞表 | [`docs/ai/data-ai-vocabulary.md`](./data-ai-vocabulary.md) |
| SchemaRenderer | [`docs/ai/schema-renderer.md`](./schema-renderer.md) · [`packages/schema-renderer`](../../packages/schema-renderer/README.md) |
| MCP server | [`packages/mcp-server/README.md`](../../packages/mcp-server/README.md) |
| 契約校驗 | [`packages/contract/README.md`](../../packages/contract/README.md) |
| 安裝內核 | [`packages/install-core/README.md`](../../packages/install-core/README.md) |
