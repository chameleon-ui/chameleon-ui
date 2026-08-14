# Phase 7 · 场景 Blocks — 阶段目标与验收

> **日历**：待指定（建议 3–4 个日历周量级，开工会冻结） · **里程碑**：M7
> **前提**：M6 已关闭（Blocks 依赖的 DataGrid / Chat / Chart 等组件已交付）
> **一句话**：`packages/blocks` 从延期表落地——十二个场景 Block 经同一 `install-core` 可装，愿景 §7.4 场景矩阵每行有覆盖物。
> **必读**：[工程约定与命名规范](../../engineering/工程约定与命名规范.md) + 愿景 v3.0 §7.3 / §7.4 + [Phase-6-组件广度.md](./Phase-6-组件广度.md)。
> **总览**：[Phase-2-Overview.md](./Phase-2-Overview.md)。

---

## 0. 本阶段前置要求

| # | 前置 | 完成标准 |
| :--- | :--- | :--- |
| 0.1 | M6 签字 | A6.* 全绿或遗留有单；`data-grid` / `chat-bubble` / `chart` 等依赖组件可用 |
| 0.2 | Block manifest 冻结会 | Block 的元数据字段（依赖组件、主题约束、三端/RTL 声明）进 schema |
| 0.3 | Registry 类型扩展 | `registry:block` 类型决议（沿用 shadcn 兼容 schema 扩展）；install-core 依赖图支持「组件+主题+Block」 |
| 0.4 | Block 预算会 | Block 体积预算条目进 `benchmarks/budgets.json`（工程约定 §11.1 修订）；未批则只测不门禁、禁止宣称达标 |
| 0.5 | 场景名单冻结 | §3.2 十二场景签字 |

---

## 1. 阶段效果（Objective）

| 效果 | 表现 |
| :--- | :--- |
| Blocks 可装 | CLI / MCP 一条命令把多组件页面片段装进临时工程，幂等可复装 |
| 场景有矩阵 | 愿景 §7.4 十七行场景每行映射 ≥1 组件/Block |
| 规范不例外 | Block 同样消费 Token、过 RTL、三断点快照 |
| AI 可整体安装 | Block 进 Registry 索引，MCP 意图搜索可达 |

---

## 2. 工作任务（Scope）

T7.1 建 `packages/blocks` · T7.2 Block manifest + Registry 类型 · T7.3 十二场景实现 · T7.4 §7.4 矩阵覆盖 · T7.5 Blocks 进 Bench/门禁。

**本阶段不做**：Blocks 市场交易（→ 运营期）；拖拽引擎自研（看板用基元能力，缺口书面）。

---

## 3. 怎么做（关键路径）

### 3.1 建包

```
packages/blocks/
  package.json   # @chameleon-ui/blocks
  README.md
  src/<block-slug>/{index.ts, manifest.json, locales/, *.tsx, styles.css}
```

Block = 多组件组合的页面片段，源码拷贝分发（同组件模式）；权威源在本包，Registry 条目由生成管线产出，禁止手改发布副本。

### 3.2 十二场景 Block（愿景 §7.3）

| slug | 场景 | 主要依赖组件 |
| :--- | :--- | :--- |
| `login` / `register` | 登录 / 注册页 | form, input, password-input, button |
| `crud-page` | CRUD 页面模板 | data-grid, form, dialog, pagination |
| `kanban` | 看板 | card, tag, list |
| `gantt` | 甘特图 | timeline,（绘制基元；缺口书面） |
| `ticket-flow` | 工单流 | steps, timeline, form |
| `approval-flow` | 审批流 | steps, form, result |
| `im-chat` | IM 会话页 | chat-bubble, markdown-renderer, editor, list |
| `data-screen` | 数据大屏模板 | chart, kpi-dashboard, grid + 自适应缩放容器 |
| `trading-terminal` | 交易终端模板 | ticker, data-grid, chart |
| `iot-panel` | IoT 设备面板 | card, gauge, chart, badge |
| `marketing-site` | 官网 Hero/Pricing/FAQ | typography, button, accordion, card |

### 3.3 场景覆盖矩阵（愿景 §7.4，17 行）

矩阵表进文档站：每行场景 → 覆盖方式（Blocks / 核心组件 / 集成层）→ 具体 slug。验收要求 17/17 行有映射物；「集成层」行（低代码/数字孪生）映射到 SchemaRenderer（P8）与 `canvas` 时须标注阶段依赖，未交付前该行标 `LEGACY-*` 而非伪造覆盖。

### 3.4 Block 工程规范

1. 只消费 `--cu-*` Token 与逻辑属性；样式 lint 同组件级。
2. RTL：ar 快照必绿；图标镜像走既有矩阵。
3. 三端：390/768/1280 快照；变形与组件契约一致。
4. 文案：Block 级文案 en / zh-CN 撰稿，其余 19 语 ICU 骨架（`_cuSkeleton`）并进缺口表（同 docs 纪律，ETA/owner 待指定）。
5. 安装：`install-core` 依赖图解析 Block → 组件 → 主题；冲突检测与幂等复用内核，禁止第二套写盘。

---

## 4. 代码设计

| 域 | 设计 |
| :--- | :--- |
| Block manifest | `manifest.json`：slug、依赖组件 slug 列表、主题约束、三端/RTL 声明、preview 元数据 |
| Registry | `type: registry:block`；条目由生成管线产出 |
| install-core | 依赖图扩节点类型；冲突/幂等语义不变 |
| Bench | genui-bench 增加 block 安装成功率指标（id 进指标字典，见 P8 generation_quality 衔接） |

---

## 5. 命名规范（本阶段增量）

| 对象 | 规范 |
| :--- | :--- |
| Block slug | kebab：`crud-page`、`data-screen` |
| Registry 类型 | `registry:block` |
| manifest | `src/<slug>/manifest.json` |
| Bench 指标 | `bench.block_install_success_rate`（字典登记） |

---

## 5.5 功能点：预留 · 埋点 · 标记（本阶段矩阵）

> **Phase 7 总原则：Block 是一等分发单元——可装、可测、可回溯；场景矩阵不许空行伪造。**

| 功能点 | 预留 | 埋点 | 标记 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| Blocks ×12 | 行业扩展位预留 | **必做** 安装经内核 `install`；来源区分 | manifest 字段 | |
| 矩阵 17 行 | 集成层行阶段依赖标注 | — | `LEGACY-*` 标注未交付行 | 禁止空行冒充覆盖 |
| Block 文案 | 19 语骨架 + 缺口表 | — | `_cuSkeleton` | 同 docs 纪律 |
| 市场交易 | **预留** | **禁止** 成交埋点 | — | 运营期接 |

### 合入检查（Phase 7）

- [ ] 每个 Block 安装路径仅经 install-core
- [ ] manifest 依赖与实际 import 一致（CI 漂移检查）
- [ ] 矩阵表无伪造覆盖行
- [ ] 骨架文案进缺口表，未宣称 21 语完成

---

## 5.6 性能指标（本阶段）

| 指标 | 本阶段要求 | 通过标准 |
| :--- | :--- | :--- |
| Block 体积预算 | **必做 · 预算会先行** | 条目进 `budgets.json` 后转硬门禁；未批只测不门禁 |
| 组件回归 S1–S5 | **必做** | Block 合入不得抬升既有指标 |
| data-screen 首屏 | **应做 · 抽检** | 记录进 M7；不作 R1 宣称 |

---

## 5.7 算法 · 复杂度 · 可用性（本阶段）

| 功能点 | 算法/逻辑 | 复杂度 | 可用性 | 要求 |
| :--- | :--- | :--- | :--- | :--- |
| 依赖图扩 Block | C6 图解析复用 | 不放宽 | U9 | 环依赖失败；部分写入回滚 |
| 看板拖拽 | 基元能力 | 注记 | U1–U5 | 缺口书面，不自研轮子 |
| 甘特绘制 | 日期刻度 | O(n) | U7 | 大任务量降级说明 |

---

## 6–8. 开发 / 技术 / 突破

- **开发**：`packages/blocks` + 12 场景 + 矩阵表 + Bench 指标。
- **技术**：安装单核扩图不分叉；Block 规范与组件同级。
- **突破**：B1 契约延伸到场景级；「拼得出来」（愿景 §4.3 Blocks 职责）补齐。

---

## 9. 讨论会

| 议题 | 产出 |
| :--- | :--- |
| manifest 字段冻结 | schema PR |
| `registry:block` 类型 | 决议 |
| Block 预算 | `budgets.json` PR |
| 拖拽/甘特绘制缺口 | 书面策略 |

---

## 10–12. 交付 · 验收（DoD）· 报告

**交付**：`packages/blocks`；12 个场景 Block；§7.4 矩阵表；Bench 新指标；M7 报告。

**验收（可测量）**：

| # | 验收线 |
| :--- | :--- |
| A7.1 | 12 个 Block 全部可经 CLI 与 MCP 装入临时工程；二次安装幂等（written=0 / skipped>0） |
| A7.2 | 每个 Block：manifest 校验过、Token-only 样式 lint 过、ar RTL + 390/768/1280 快照绿 |
| A7.3 | §7.4 矩阵 17/17 行有映射；未交付行有 `LEGACY-*` 而非空 |
| A7.4 | `bench.block_install_success_rate` 由 harness 生成并可复现 |
| A7.5 | `ci:phase7` = `ci:phase6` + `phase7:gates`（manifest 校验 + Block 安装 + 矩阵覆盖检查）本机绿 |

**报告**：`docs/project/reports/M7-场景Blocks验收.md`。

---

## 13. 风险与诚实边界

- 看板拖拽、甘特绘制若基元不足，缺口书面化，禁止用半成品冒充。
- Block 预算未批前，性能话术不得出现。
- 19 语 Block 文案为骨架，缺口表未清前不得宣称「21 语 Blocks」。
- 「集成层」场景行（低代码/数字孪生）依赖 P8 SchemaRenderer 与 G 族高级能力，按 §3.3 标注，不提前宣称。

## 14. 衔接

下一阶段：[Phase-8-AI阶梯收口.md](./Phase-8-AI阶梯收口.md)。
