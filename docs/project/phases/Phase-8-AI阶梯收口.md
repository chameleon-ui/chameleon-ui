# Phase 8 · AI 阶梯收口 — 阶段目标与验收

> **日历**：待指定（建议 3–5 个日历周量级；可与 P6/P7 部分并行，开工会冻结） · **里程碑**：M8
> **前提**：M5 已关闭；P6 组件面进展 ≥ 冻结清单（全量 data-ai 门禁依赖组件面）
> **一句话**：A1–A6 阶梯清零——schema v0.2 决议、Registry/MCP 生产化、rules 校验强制化、AG-UI 与运行时 SchemaRenderer、data-ai 全量化、`bench.generation_quality` 实测、DTCG `$extends` 主题继承。
> **必读**：[工程约定与命名规范](../../engineering/工程约定与命名规范.md) + 愿景 v3.0 §8 / §6.3 + [Phase-2-Overview.md](./Phase-2-Overview.md)。
> **验收口径**：AI 条目的最终验收以专项轨道卡 [`AI能力体系-A1-A6-收口轨道.md`](./AI能力体系-A1-A6-收口轨道.md) 为唯一权威；本卡是其在阶段轴上的落位与排期载体，DoD 不一致处以轨道卡为准。

---

## 0. 本阶段前置要求

| # | 前置 | 完成标准 |
| :--- | :--- | :--- |
| 0.1 | 轨道卡任务单评审 | A1–A6 各层任务单排期；owner 均 **待指定**（沿用轨道卡纪律，不编姓名） |
| 0.2 | AG-UI 决策会 | 沿用 Phase 3 §3.2 决策树：协议成熟度评估 → 「适配 POC」或「仅观察报告」，书面签字 |
| 0.3 | schema v0.2 决议会 | 轨道卡 A1：键位对齐报告 §8.2 或登记 canonical v0.2 + 映射表，二选一签字 |
| 0.4 | generation_quality 指标定义会 | 指标口径、任务集、模型与日期记录格式冻结；**禁止不可解释黑盒分**（Phase 2 §5.7 纪律沿用） |
| 0.5 | `$extends` 迁移方案 | token 编译管线改造方案 + 8 主题回归计划签字 |
| 0.6 | 模型调用预算与合规 | 调用外部模型的成本/数据边界书面（owner 待指定）；无预算的处置见 §13 |

---

## 1. 阶段效果（Objective）

| 效果 | 表现 |
| :--- | :--- |
| A1 | `component-contract.schema.json` v0.2 发布；契约校验 CI 硬门禁 |
| A2 | 意图搜索可复现；`install_with_theme` 四件套剧本一次到位且幂等；旁路写盘扫描进 CI |
| A3 | `validate-rules` 升硬门禁；社区纪律包「创作→校验→上架→安装」全链路记录 |
| A4 | AG-UI 适配 POC（或签字观察报告）；独立运行时 SchemaRenderer；a2ui / mcp-apps 从 POC 升 supported |
| A5 | 全量组件 `data-ai-role/state/intent` 三件套门禁（轨道卡口径） |
| A6 | `bench.generation_quality` 非 null 实测；季度发布机制成文 |
| 主题 | 任一主题可 `$extends` 派生，差量存储、可 diff；8 主题回归绿 |

---

## 2. 工作任务（Scope）

T8.1 A1 schema v0.2 决议与硬门禁 · T8.2 A2 生产化（意图搜索 / install_with_theme / 旁路扫描） · T8.3 A3 校验强制化 + 社区包通路 · T8.4 `adapter-ag-ui` + `packages/schema-renderer` + 既有 adapter 升 supported · T8.5 A5 全量化（补 13 组件 state + intent 铺开 + 门禁升级） · T8.6 A6 generation_quality 实测化 · T8.7 DTCG `$extends`。

**本阶段不做**：GenUI-Bench 企业版（V4，运营期）；AI 主题生成器（愿景 §6.5，后续阶段）。

---

## 3. 怎么做（关键路径）

### 3.1 A1 · schema v0.2（按轨道卡）

1. 决议会二选一：键位对齐报告 §8.2（`compositionRules`/`antiPatterns`/`threeEndBehavior`/`rtlBehavior`）或现行键位登记为 canonical v0.2 + 逐项映射表。
2. 发布 `component-contract.schema.json` v0.2（`$id` 含 `/v0.2/`，破坏性变更策略成文）。
3. 契约校验升 CI 硬门禁；catalog 新增组件无合法契约不得合入（P6 新组件同样适用）。

### 3.2 A2 · Registry + MCP 生产化（按轨道卡）

1. `search_components` 支持按意图检索（intent 来自契约 purpose/scenarios），结果可解释，固定测试集入仓。
2. `install_with_theme` 剧本：组件 + Token 包 + 字体配置 + design-rules 一次到位，全走 `install-core`。
3. CI 旁路写盘扫描：证明 cli / mcp / adapters / docs CTA / market 无第二套写盘。

### 3.3 A3 · design-rules 强制化（按轨道卡）

1. `validate-rules` 升 CI 硬门禁：8/8 主题过检，任一失败拒合；人为造一条非法 rules 必红（留证据）。
2. 社区纪律包路径成文（schema 公开、`community-` 前缀、检测流水线、经内核安装），以 `community-focus-first` 走通全链路并记录。

### 3.4 A4 · 协议适配补齐

1. **AG-UI**：按 §0.2 决策树。适配则新建 `packages/adapter-ag-ui`（独立包，**不进 L1/L2**）：组件状态 ↔ Agent 状态双向同步 demo + 断言测试；观察则交一页报告（协议版本、缺口、复评日期、签字）。禁止空包冒充。
2. **SchemaRenderer**：新建 `packages/schema-renderer`——JSON Schema → 组件树的**运行时**渲染器（React 先行）。与 `adapter-a2ui` 的关系：adapter 负责协议文档 → render node/安装计划；schema-renderer 负责把契约化描述真实渲染为本库组件；共享 slug 映射，协议分支不进 L1/L2。渲染入仓官方示例集，快照 + 单测。低代码场景（愿景 §7.4）最小演示页录像归档。
3. `adapter-a2ui` / `adapter-mcp-apps` 从 POC 升 supported：错误路径处理、测试进 CI、README 支持级别声明与版本承诺。

### 3.5 A5 · data-ai 全量化（按轨道卡口径）

1. 补 `data-ai-state` 的 13 组件（审计名单逐个核对）：`breadcrumb`、`description-list`、`divider`、`empty-state`、`grid`、`kbd`、`label`、`link`、`menu`、`number-input`、`pagination`、`progress`、`slider`。
2. `data-ai-intent` 值域写入契约/文档（与 A1 字段交叉引用），全库铺开。
3. 门禁升级：`mvp20-data-ai` 抽检 → 全量 catalog 三件套断言（role + state + intent），CI 实际拦一次缺属性的 PR 留证据。

### 3.6 A6 · generation_quality 实测化（按轨道卡）

1. 指标口径（冻结会定准，轨道卡示例形态）：标准任务集上「一次生成通过契约校验 + 安装成功」的比率；任务集与复现脚本入仓。
2. 移除 reserved-null 占位，真实数字由 harness 写入 bench JSON 与 `reports/`；记录模型名/版本/日期。
3. 季度发布流程成文（指标字典、复现步骤、发布检查单），首期真实发布完成。

### 3.7 DTCG `$extends`（本卡独有项，轨道卡未覆盖）

1. token 编译管线支持 `$extends` 原生继承（DTCG 2025.10）；派生主题差量存储。
2. 8 套主题继承化改造回归：产物逐字节 diff 或等价校验，回归绿前不切换默认。
3. theme-studio 导出改用 `$extends` 差量；可 diff / 可回滚说明进文档。

---

## 4. 代码设计

| 域 | 设计 |
| :--- | :--- |
| adapter-ag-ui | 协议逻辑只在 L3/L4；`source='ag-ui'` 进 InstallPlan |
| schema-renderer | 消费 contract + registry；渲染错误可恢复；禁指数展开 |
| data-ai | 值域入契约/文档；DOM 标注不塞 PII |
| bench | 指标 id 字典登记；模型输出存证（可复现） |
| `$extends` | 编译期解析；产物仍是静态 CSS（零运行时不破）；环引用必须报错 |

---

## 5. 命名规范（本阶段增量）

| 对象 | 规范 |
| :--- | :--- |
| 适配包 | `@chameleon-ui/adapter-ag-ui` |
| 渲染器包 | `@chameleon-ui/schema-renderer` |
| InstallPlan source | `ag-ui`（追加枚举） |
| contract schema | v0.2（内容以轨道卡 A1 决议为准） |
| Bench 指标 | `bench.generation_quality`（reserved 转正）；门禁脚本进 `phase*-gates` 或独立 `ai:gates`（轨道卡 §4） |

---

## 5.5 功能点：预留 · 埋点 · 标记（本阶段矩阵）

> **Phase 8 总原则：协议可观察但禁止空包；Bench 数字可追溯；标注不含 PII。**

| 功能点 | 预留 | 埋点 | 标记 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| adapter-ag-ui | 若观察：报告预留下期 | 适配则安装走内核 `install` | source=`ag-ui` | 不进 L1 |
| schema-renderer | Vue 版预留 | — | 包名 | |
| data-ai 全量 | — | — | **必做** 三件套 100%（轨道卡口径） | 门禁化 |
| generation_quality | 企业版指标预留列 | **必做** 复现材料入库 | 指标 id | 无预算处置见 §13 |
| `$extends` | 多品牌组合预留 | — | 主题 meta 标注派生链 | |

### 合入检查（Phase 8）

- [x] 无协议逻辑渗进 L1/L2（import 边界测试）— `scripts/phase8-gates.mjs` `checkL1Boundary`
- [x] data-ai 三件套全量门禁绿，且有拦阻证据 — 当前 catalog 全量门禁 + 红proof（`phase8:gates`）；以看板 PHASE8.md 为准
- [x] Bench 报告含模型/日期/复现步骤 — 默认 null 仍诚实；`generation-quality-template-baseline.json` 含 generator / measuredAt / 复现；见 `M8-AI阶梯收口验收.md`
- [x] `$extends` 产物 8 主题回归绿 — `packages/themes/scripts/test-themes-regression.mjs` 经 `phase8:gates` 复跑

---

## 5.6 性能指标（本阶段）

| 指标 | 本阶段要求 | 通过标准 |
| :--- | :--- | :--- |
| data-ai 属性 | — | 无可测量运行时税（沿用 Phase 3 口径） |
| schema-renderer | **应做 · 抽检** | 渲染千节点页不阻塞输入的演示记录 |
| 主题编译 | **必做 · 回归** | `$extends` 产物体积 ≤ 现行 overlay 产物 + 书面容差 |
| S1–S5 / R1–R3 | **应做 · 回归** | 主库不放宽；R1–R3 仍未测不宣称（P9 收口） |

---

## 5.7 算法 · 复杂度 · 可用性（本阶段）

| 功能点 | 算法/逻辑 | 复杂度 | 可用性 | 要求 |
| :--- | :--- | :--- | :--- | :--- |
| 意图搜索 | 契约标签检索 | 结果可解释 | U9 | 固定测试集可复现 |
| AG-UI 状态同步 | 事件流 | 注记 | 断线可恢复 | |
| SchemaRenderer | 树渲染 | O(n)；禁指数 | 错误可恢复 U9 | |
| 契约校验 | Schema 校验 | C9 | U9 定位到字段 | |
| `$extends` 解析 | 图展开 | O(n)；环检测 | 编译错误可读 | 环引用必须报错 |

---

## 6–8. 开发 / 技术 / 突破

- **开发**：schema v0.2、A2 生产化、rules 硬门禁、adapter-ag-ui（或观察报告）、schema-renderer、data-ai 全量、bench 实测、`$extends`。
- **技术**：适配只在 L3/L4；契约单源；零运行时不破；安装单核不旁路（CI 扫描证明）。
- **突破**：B1 开放标准 v0.2 + 协议面；B3 纪律包强制化与社区通路；B4 回流闭环出首个质量数（B1–B4 验收标准以轨道卡 §3 为准）。

---

## 9. 讨论会

| 议题 | 产出 |
| :--- | :--- |
| schema v0.2 键位决议 | 签字 + 映射表 |
| AG-UI 适配/观察 | 决策记录 |
| generation_quality 口径 | 指标定义单 |
| `$extends` 迁移 | 方案 + 回归计划 |
| 模型预算 | 书面（owner 待指定） |

---

## 10–12. 交付 · 验收（DoD）· 报告

**交付**：schema v0.2 与硬门禁证据；意图搜索测试集与 install_with_theme 记录；rules 门禁证据与社区包全链路记录；adapter-ag-ui POC 或观察报告；`packages/schema-renderer` + 演示；data-ai 全量门禁；generation_quality 报告与季度检查单；`$extends` 管线；M8 报告。

**验收（可测量；A1–A6 细目以轨道卡 §2 DoD 为最终口径）**：

| # | 验收线 |
| :--- | :--- |
| A8.1 | 轨道卡 A1 DoD：v0.2 发布且 50/50 过校验；CI 拦阻证据入仓 |
| A8.2 | 轨道卡 A2 DoD：意图搜索测试集可复现；install_with_theme 四件套幂等落盘；旁路扫描 CI 绿 |
| A8.3 | 轨道卡 A3 DoD：rules 硬门禁必红证据；社区包全链路记录；schema 公网可 GET |
| A8.4 | 轨道卡 A4 DoD：AG-UI demo 双向同步断言测试（或签字观察报告）；SchemaRenderer 示例集快照全绿；两个既有 adapter 升 supported（README 声明 + CI 测试） |
| A8.5 | 轨道卡 A5 DoD：13 组件 state 补齐；全量 catalog 三件套 100% 门禁绿；值域文档发布 |
| A8.6 | 轨道卡 A6 DoD：`bench.generation_quality` 非 null 实测（任务集版本 + 复现命令）；季度发布检查单入库且首期真实发布 |
| A8.7 | `$extends`：任一主题派生演示可跑；8 主题继承化回归绿；studio 导出为差量 |
| A8.8 | `ci:phase8` = `ci:phase7` + `phase8:gates`（或轨道卡 `ai:gates`，命名随任务单冻结）本机绿 |

**报告**：`docs/project/reports/M8-AI阶梯收口验收.md`。

---

## 13. 风险与诚实边界

- AG-UI 协议若未成熟，诚实落「观察报告」，不抢发半成品适配；空包冒充违反轨道卡 §4 红线。
- generation_quality 依赖外部模型预算：预算不到位时 **M8 不得签字收口**（里程碑顺延），指标保持 null——null 是合法状态，伪造不是；禁止为赶里程碑手写数字。
- intent 值域/契约键位未冻结前不铺开，避免全库返工。
- `$extends` 是主题管线破坏性改造；回归未绿前不切换默认导出。

## 14. 衔接

下一阶段：[Phase-9-硬化与发布.md](./Phase-9-硬化与发布.md)。
