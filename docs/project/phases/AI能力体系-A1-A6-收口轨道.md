# AI 能力体系收口轨道（A1–A6 六层 + B1–B4 四大突破点）

> **性质**：跨阶段专项轨道（workstream），一等交付物，不是副产品。  
> **权威来源**：[`../../../Chameleon UI — 综合可行性研究报告 v3.0.md`](../../../Chameleon%20UI%20—%20综合可行性研究报告%20v3.0.md) §8「AI 能力体系（六层建设 + 四大突破点）」。  
> **与 Phase 0–4 的关系**：P0–P4 已交付的部分是**基线**（见 §1 审计），本卡只定义**收口差距**与可测 DoD；各 Phase 卡中涉及 AI 的条目以本卡为最终验收口径。  
> **Owner**：各层负责人均 **待指定**（禁止编造姓名）。**预算**：不单列预算数字，工作量随任务单评审。

---

## 1. 基线审计（2026-08-13，工程本地实测）

| 层 | 现状（已验收基线） | 距报告 §8 的差距 |
| :--- | :--- | :--- |
| **A1** 组件语义契约 | `component-contract` schema v0.1；50/50 组件有 `contract.json` 并过校验 | 项目键位（`composition` / `a11y` / `responsive` / `rtl` / `dataAi`）与报告 §8.2 字段规范（`compositionRules` / `antiPatterns` / `threeEndBehavior` / `rtlBehavior` 等）未正式对齐，亦无 canonical 化决议 |
| **A2** Registry + MCP | `registry` + `install-core` + `cli` + `mcp-server`；install-core 唯一写盘 | 无 search-by-intent（按意图搜索）；无 install-with-theme（组件 + Token + 字体 + design-rules 一次到位）的生产化路径 |
| **A3** design-rules | design-rules v1.0 覆盖 8/8 主题；`validate-rules` CLI 存在 | 校验器未作为 CI 硬门禁强制；社区纪律包创作/上架路径未文档化（仅种子 `community-focus-first`） |
| **A4** 协议适配 | `adapter-a2ui`、`adapter-mcp-apps`（均 POC 级） | **无 AG-UI adapter**；**无独立 SchemaRenderer**（JSON Schema → 组件树）；A2UI / MCP Apps 未从 POC 升为 supported |
| **A5** data-ai-* | `data-ai-role` 覆盖 50/50；MVP20 抽检门禁存在 | `data-ai-intent` 全库 **0** 处；13 个组件缺 `data-ai-state`；门禁仅覆盖 MVP20 首批 slug，未扩到全量 catalog |
| **A6** 回流 + Bench | `genui-bench` 跑通 install / idempotency；遥测默认关 | `bench.generation_quality` 为 reserved 占位、恒 `null`，**无实测**；季度发布机制未成文 |

---

## 2. A1–A6 收口任务与 DoD

### A1 · 组件语义契约 —— schema v0.2 决议与全量覆盖

**任务**
1. 召开 schema 决议会，二选一并书面签字：(a) 把键位对齐到报告 §8.2 字段规范（`compositionRules` / `antiPatterns` / `threeEndBehavior` / `rtlBehavior`）；或 (b) 把项目现行键位（`composition` / `a11y` / `responsive` / `rtl` / `dataAi` 等）正式登记为 **canonical v0.2**，并发布与报告字段规范的逐项映射表。
2. 发布 `component-contract.schema.json` v0.2（`$id` 含 `/v0.2/`，破坏性变更策略成文）。
3. 契约校验进 CI 硬门禁；catalog 新增组件无合法 `contract.json` 不得合入。

**DoD**：v0.2 schema 发布且 50/50 组件过校验；CI 在无契约/契约非法的 PR 上实际变红一次（留证据）；映射表或对齐记录入仓；此后组件增长时覆盖率保持 100%（catalog 门禁强制）。

### A2 · Registry + MCP —— 生产化加固

**任务**
1. `search_components` 支持按意图检索（intent 字段/标签来自 A1 契约的 purpose/scenarios），结果可解释。
2. `install_with_theme`（或等价剧本）：一条命令装组件 + Token 包 + 字体配置 + design-rules，全走 `install-core`。
3. CI 增加旁路写盘扫描，证明 cli / mcp / adapters / docs CTA / market 均无第二套写盘。

**DoD**：意图搜索对固定测试集返回预期 slug（用例入仓可复现）；install-with-theme 剧本一次执行落盘四件套且幂等；旁路扫描在 CI 绿、`install-core` 唯一写盘路径不被破坏。

### A3 · design-rules —— 校验强制化 + 社区包通路

**任务**
1. `validate-rules` 升为 CI 硬门禁：8/8 主题过检，任一失败拒合。
2. 社区纪律包路径成文：schema 公开、`community-` 前缀、上架检测（checkRules 等）、经 `install-core` 安装；贡献指南入库。
3. 以 `community-focus-first` 为样板走通「创作 → 校验 → 上架 → 安装」全链路并记录。

**DoD**：CI 中人为制造一条非法 rules 必红（留证据）；社区包全链路演示记录入库；`design-rules.schema.json` 公网可 GET。

### A4 · 生成式 UI 协议适配 —— 补齐 AG-UI 与 SchemaRenderer

**任务**
1. 新建 `packages/adapter-ag-ui`：组件状态 ↔ Agent 状态双向同步，最小可演示 demo（禁止空包冒充）。
2. 新建 SchemaRenderer（JSON Schema → 组件树的声明式渲染器）：渲染官方示例 schema 集，快照 + 单测；与 A1 契约共用 slug 映射。
3. `adapter-a2ui`、`adapter-mcp-apps` 从 POC 升为 supported：错误路径处理、测试、README 支持级别声明、版本承诺。

**DoD**：AG-UI demo 可运行且双向同步有断言测试；SchemaRenderer 对入仓示例集渲染快照全绿；两个既有 adapter 的支持级别在 README 标明且测试在 CI 跑（非手工）。

### A5 · data-ai-* 运行时标注 —— 全量化

**任务**
1. 全库补 `data-ai-intent`（值域写入契约/文档，与 A1 字段交叉引用）。
2. 补齐 13 个缺 `data-ai-state` 的组件。
3. 门禁从 MVP20 抽检扩为全量 catalog：50/50 组件 `data-ai-role` + `data-ai-state` + `data-ai-intent` 三件套断言。

**DoD**：50/50 组件三件套齐（CI 全量门禁绿，非抽检）；值域文档发布；缺任一属性的 PR 实际被门禁拦下（留证据）。

### A6 · 数据回流闭环 + Benchmark —— generation_quality 实测化

**任务**
1. 定义 `bench.generation_quality` 度量（如标准任务集上「一次生成通过契约校验 + 安装成功」的比率），任务集与复现脚本入仓。
2. 移除 reserved-null 占位，跑出真实数字写入 bench JSON 与 `reports/`。
3. GenUI-Bench 季度发布流程成文（指标字典、复现步骤、发布检查单）。

**DoD**：`bench.generation_quality` 在 `pnpm bench:genui` 产物中为**非 null 实测值**，附任务集版本与复现命令；数字可追溯到脚本输出（禁止手写）；季度发布检查单入库并完成首期真实发布。

---

## 3. 四大突破点（报告 §8.3 原文）与验收标准

> 报告原文表述（逐字引用，验收以此为准）：
>
> | 突破点 | 核心主张 | 为什么竞品做不到 |
> | :--- | :--- | :--- |
> | **B1 · 开放标准** | 组件语义契约不是私有特性，而是公开发布的开放 Schema | 私有元数据 = 特性，三个月被抄；开放标准 = 卡位 |
> | **B2 · RTL-first** | 核心组件先在 RTL 语境下设计评审，再镜像回 LTR | 业界全部是"LTR 设计、RTL 补丁"，我们独占品类标签 |
> | **B3 · 设计纪律包** | 主题 = Token（皮）+ design-rules（骨）+ Locale 字体栈（血） | 竞品只有色板，没有可喂给 AI 的结构化设计纪律 |
> | **B4 · 数据回流** | Registry/MCP 从第一天埋数据闭环，GenUI-Bench 每季度发布 | 需要同时掌握组件库 + AI 协议 + 数据基础设施 |

### B1 · 开放标准 — 验收标准

- `component-contract.schema.json` v0.2 与 `design-rules.schema.json` 均在公网稳定 URL **无登录可 GET**（路径含版本）。
- 版本策略与破坏性变更期成文并随 schema 发布。
- A1 的键位决议（对齐或 canonical 映射表）公开发布，外部校验器可独立实现。

### B2 · RTL-first — 验收标准

- 核心组件（catalog `common10` 起步，扩至全量）有归档的 RTL 语境设计评审记录（评审在 LTR 定稿**之前**）。
- 新组件合入 checklist 含 RTL 评审勾稽项；ar/RTL 视觉回归快照覆盖全量组件并进 CI 门禁。
- 评审记录缺失的组件不得标记 `status: stable`。

### B3 · 设计纪律包 — 验收标准

- 8/8 官方主题「Token + design-rules + Locale 字体栈」三件套齐且过 CI 校验（A3 门禁）。
- 社区纪律包经 `registry:rules` 通路从创作到安装全链路可复现（A3 样板记录）。
- AI 安装主题时四件套（组件 + Token + 字体 + rules）一次到位（A2 install-with-theme 剧本）。

### B4 · 数据回流 — 验收标准

- telemetry 事件字典冻结并版本化；默认关、可 opt-in 的告知文案在 README/站点可查。
- `bench.generation_quality` 实测非 null（A6 DoD），回流数据可归因到版本与任务集。
- GenUI-Bench 季度发布机制成文，首期真实发布完成（报告页可从文档站链接）。

---

## 4. 治理与红线

- **不伪造**：任何指标数字必须可由入仓脚本复现；未做的能力（如未实测的 generation_quality、未做的盲测）在对外文档中禁止宣称。
- **不空包**：`adapter-ag-ui`、SchemaRenderer 未达 DoD 前不得建空包占位充数。
- **单核不可破**：所有安装写盘只经 `install-core`；A2/A4 新增能力不得引入旁路。
- **门禁命名**：本轨道新增 CI 门禁统一进 `phase*-gates` 或独立 `ai:gates` 脚本，命令与通过标准随任务单冻结。
- **Owner**：A1–A6、B1–B4 负责人均 **待指定**；排期在任务单评审时确定，本卡不编造日历承诺。

---

## 5. AI consumer 基线（2026-08-14）— 相对**外部编码 Agent**，不是对本仓

Dogfooding（stock-analyzer）失败点是 **Agent 从文档抄错 specifier**（未导出 CSS 路径、把 `workspace:*` 写进非 pnpm 工程）。本仓 A1–A5 门禁绿 **不等于** 外部 Agent 能一次生成可编译应用。

口径：Agent 能否只靠 `chameleon-ui/AGENTS.md` + MCP + 安装页「外部工程」片段，在非 pnpm-workspace 的 React 应用里写出正确 import 并拿到契约。**禁止**用 `generation_quality` 占位分冒充。

| 层 | 对本仓 | 对 AI consumer（外部工程） | 本轮 |
| :--- | :--- | :--- | :--- |
| **A1** 契约 | catalog 全量 v0.2 + `dataAi` 三件套门禁 | Agent 可 `get_contract` / `@chameleon-ui/components/contracts/<slug>` | **done**（消费路径已接到 MCP） |
| **A2** Registry + MCP | 意图搜索 + `install_with_theme` + 旁路扫描 | 工具齐：`search_components`（intent）· `get_contract` · `get_design_rules` · `get_import_specifiers` · `list_themes` · `install_with_theme`；Cursor MCP JSON 在 mcp-server README | **done**（消费方）；写盘仍只走 install-core |
| **A3** design-rules | 8/8 + 社区包 CI 硬门禁 | Agent 可 `get_design_rules`；社区上架仍走市场通路 | **done**（读规则）；社区创作/上架对外部 Agent 仍是 **partial**（文档在 `docs/ai/community-rules-pack-guide.md`，非默认消费路径） |
| **A4** 协议适配 | SchemaRenderer 快照绿；a2ui/mcp-apps = supported；ag-ui = POC | SchemaRenderer 默认 map **仅 10 slug**；一页纸 `docs/ai/schema-renderer.md`。AG-UI **不要当 supported** | **partial**（10 slug 可生成；全 catalog / AG-UI 未开放给消费 Agent） |
| **A5** data-ai-* | 全 catalog 三件套门禁 | 三件套在契约里，随 `get_contract` 可见 | **done** |
| **A6** Bench | `generation_quality` **诚实 null**（无模型预算） | 无实测一次生成成功率。禁止手写分数 | **blocked** |

### 本轮已补（Agent-facing，非伪造）

- SSOT：`chameleon-ui/AGENTS.md` + `docs/ai/agent-consume.md` + `.cursor/rules/chameleon-ui-consume.mdc`
- MCP：`get_contract` / `get_design_rules` / `get_import_specifiers` + 单测 + README Cursor JSON
- `pnpm ai:check`：契约 N/N、MCP 工具名、AGENTS.md、安装 MDX 外部工程片段、8 主题 / 21 locale 防漂移（亦进 `phase8:gates`）
- 安装 MDX（zh-CN / zh-HK / en）增加可复制的外部工程 `App.tsx`（canonical CSS + `@chameleon-ui/components`）

### 仍开放（对 AI consumer）

| 项 | 状态 |
| :--- | :--- |
| npm 首发，外部可 `npm install` 而不全量 link | 未做；本仓不 publish |
| SchemaRenderer 默认 map 扩到全 catalog | 未做；诚实写明 10 slug |
| AG-UI 升 supported / 协议认证 | 未做；保持 POC |
| `bench.generation_quality` 非 null | **blocked**（无模型预算；null 合法） |
| `chameleon-ui.dev` 公网 GET schema | pending（B1） |

