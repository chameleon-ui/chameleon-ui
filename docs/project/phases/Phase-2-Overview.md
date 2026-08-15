# 第二期（Phase 5–9）· 总览与缺口追溯

> **命名说明**：本文件的「第二期」指 M4 建设收口之后的第二个建设期（工程阶段 Phase 5–9）。与建设期 M2 的 [`Phase-2-开源发布.md`](./Phase-2-开源发布.md) 不是同一文档。
> **目标口号**：新一代 WebUI：全球首个 AI-Native 设计系统 —— 二十一语言（含四种 RTL）× 八大致敬主题 × 三端一体。
> **对齐文档**：[`../../../Chameleon UI — 综合可行性研究报告 v3.0.md`](../../../Chameleon%20UI%20—%20综合可行性研究报告%20v3.0.md)（§5 Locale / §6 主题 / §7 组件·三端·Blocks / §8 AI 阶梯）+ [工程约定与命名规范](../../engineering/工程约定与命名规范.md)。
> **日期**：2026-08-13 起草 · 状态：**规划（未开工）**。

---

## 1. 基线（M4 收口事实，禁止美化）

| 维度 | 现状 | 证据 |
| :--- | :--- | :--- |
| 组件 | 50 个冻结（`implementation: complete`），A–E 族为主 | `chameleon-ui/packages/components/catalog.json` |
| 主题 | 8 套致敬 + `community-focus-first` 纪律包；design-rules v1.0 全字段 | `chameleon-ui/packages/themes/src/` |
| 国际化 | 21 Locale 文案文件齐备；i18n 含 RTL 集合 / `directionForLocale` / 伪本地化 | `chameleon-ui/packages/i18n/src/` |
| Token | `tokens/src/core/` 仅 `color.json` + `space.json`；无断点/密度 Token | `chameleon-ui/packages/tokens/src/core/` |
| 三端 | 11 个组件 CSS 有硬编码媒体查询；`@container` 用量为 0；仅 Dialog 实现 sheet 变形 | 本仓检索（2026-08-13） |
| AI | A2UI + MCP Apps 适配器在；AG-UI、运行时 SchemaRenderer、`data-ai-intent` 缺；13 组件缺 `data-ai-state`；`bench.generation_quality` = null | `packages/adapter-*`、`benchmarks/genui-bench` |
| Blocks | `packages/blocks` 未创建 | `STRUCTURE.md` 延期表 |
| Vue | 仅 Button + Input POC | `packages/components-vue/` |
| 合规 | VPAT status=draft；R1–R3 未测（LEGACY-2026-001…003）；文档 21 语 270/315 格为骨架（LEGACY-2026-004/005/017） | `docs/project/reports/Phase-4-全量性能与a11y审计.md`、`Phase-4-文档21语缺口表.md` |

## 2. 缺口 → 阶段追溯矩阵

| 愿景条目 | 缺口（审计事实） | 收口阶段 |
| :--- | :--- | :--- |
| §7.1 断点 mobile/tablet/desktop | 无断点 Token；媒体查询字面量散落 | **P5** |
| §7.1 密度 compact/standard/comfortable | 无密度 Token；design-rules 枚举不一致（`spacious` vs `standard`） | **P5**（迁移单） |
| §7.1 组件级容器查询 | `@container` = 0 | **P5** |
| §7.1 / 附录 C 变形规则 | 仅 Dialog 一例实现 | **P5**（矩阵）→ P6 随新组件 |
| §7.2 ActionSheet / TabBar / SafeArea / Sidebar | 缺 | **P5** |
| §7.2 F 可视化族（Chart/KPIDashboard/Ticker/Sparkline/Heatmap/Gauge） | 0/6 | **P6** |
| §7.2 G 画布族（Canvas/FlowNode/Edge/MindMap/GraphView/PipelineView/CanvasToolbar） | 0/7 | **P6** |
| §7.2 H 内容协作族（Editor/MarkdownRenderer/CommentThread/ChatBubble/CodeBlock/ArticleCard/SharePanel） | 0/7（Rating 归 C 族） | **P6** |
| §7.2 缺口名单（DataGrid/Steps/CommandPalette/…/Upload 等 27 项） | 缺 | **P6** |
| §7.3 场景 Blocks ×12 | `packages/blocks` 不存在 | **P7** |
| §7.4 场景覆盖矩阵 ×17 行 | 无映射物 | **P7** |
| §8.2 A1 schema 键位决议（v0.2） | 与报告 §8.2 字段规范未对齐 | **P8**（口径见轨道卡） |
| §8.2 A2 意图搜索 / install-with-theme | 未生产化 | **P8**（口径见轨道卡） |
| §8.2 A3 rules 校验强制化 + 社区包通路 | validate-rules 未升硬门禁 | **P8**（口径见轨道卡） |
| §8.2 A4 AG-UI / 运行时 SchemaRenderer / 既有 adapter 升 supported | 缺（A2UI、MCP Apps 为 POC） | **P8**（口径见轨道卡） |
| §8.2 A5 `data-ai-intent` + 13 组件补 `data-ai-state` | intent=0；13 缺 state | **P8**（口径见轨道卡） |
| §8.2 A6 `bench.generation_quality` | null（reserved） | **P8**（口径见轨道卡） |
| §6.3 DTCG `$extends` 主题继承 | 仅 overlay merge | **P8** |
| §3 / 路线图 Vue 子集 | 2 组件 POC | **P6**（扩面） |
| §9.3 R1–R3（LCP/INP/CLS） | 未测，禁伪造 | **P9** |
| §11.4 VPAT 正式 | draft | **P9** |
| §14 Phase 2 npm / 公网托管 | `publish:check` 在，未发包 | **P9** |
| §5 文档 21 语真内容 | 19 语骨架 | **P9** |

## 3. 阶段索引（一行状态）

| 阶段 | 里程碑 | 一句话 | 状态 | 文档 |
| :--- | :--- | :--- | :--- | :--- |
| Phase 5 · 三端内核 | M5 | 断点/密度 Token + 容器查询 + 变形矩阵 + ActionSheet/TabBar/SafeArea/Sidebar | 工程本地收口（密度签字仍开） | [Phase-5-三端内核.md](./Phase-5-三端内核.md) |
| Phase 6 · 组件广度 | M6 | F/G/H 三族从 0 建齐 + 缺口名单清零 + Vue 扩面（约 100 slug，冻结会定准数） | 工程本地收口（冻结会/全量 VR 仍开） | [Phase-6-组件广度.md](./Phase-6-组件广度.md) |
| Phase 7 · 场景 Blocks | M7 | `packages/blocks` + §7.3 十二场景 + §7.4 矩阵 17/17 | 工程本地收口（见 PHASE7 / M7） | [Phase-7-场景Blocks.md](./Phase-7-场景Blocks.md) |
| Phase 8 · AI 阶梯收口 | M8 | A1–A6 全收口（AG-UI / SchemaRenderer / data-ai 三件套 / generation_quality）+ `$extends` | 工程本地收口（LLM generation_quality 仍 null） | [Phase-8-AI阶梯收口.md](./Phase-8-AI阶梯收口.md)（AI 条目验收口径以 [AI能力体系-A1-A6-收口轨道.md](./AI能力体系-A1-A6-收口轨道.md) 为唯一权威） |
| Phase 9 · 硬化与发布 | M9 | R1–R3 实测、VPAT 正式、npm 发包路径、21 语真内容 | 诚实收口 / 多项 deferred | [Phase-9-硬化与发布.md](./Phase-9-硬化与发布.md) |

依赖序：P5 → P6 → P7（Blocks 消费 P6 组件）；P8 与 P6/P7 可并行启动，但其全量门禁依赖 P6 组件面；P9 最后（收口其余全部）。

## 4. 口号诚实核对表（截至 2026-08-15）

权威逐行表：[`../reports/Phase-9-口号核对表.md`](../reports/Phase-9-口号核对表.md)（A9.6）。摘要：

| 口号成分 | 今日可宣称？ | 差距 |
| :--- | :--- | :--- |
| 二十一语言（含四种 RTL） | 部分：组件文案 21 语齐备；**文档站仍有英文骨架** | A9.4 deferred · LEGACY-004/005/017 |
| 八大致敬主题 | 可宣称存在 + 工程量化；**「一眼认出 ≥80%」禁止宣称**（PROTOCOL-READY，`rate=null`） | 真人盲测 · LEGACY-008 |
| 三端一体 | **降级**：「三端支持（降级策略验证中）」— Token/密度/容器查询/变形已落；降级未验 | P5 红线仍开 |
| AI-Native | 部分：A1–A5 工程轨；A6 `generation_quality=null`；AG-UI=POC | P8 诚实边界 |
| 性能达标 | 体积门禁可宣称；R1/R3 本地 lab 有生成物；**R2 INP / 真机禁止宣称** | LEGACY-001…003 |

## 5. 纪律（沿用建设期）

- 安装写入仅 `install-core`；Blocks/适配器不得旁路。
- 性能预算数字只出自 `benchmarks/budgets.json`（工程约定 §11.1）；新增预算条目须预算会修订，禁止阶段卡自造数字。
- Bench 数字由 harness 生成，禁止手写；未测项一律 `LEGACY-*`。
- owner/日历未定项标 **待指定**，不编人名、不编预算数。
