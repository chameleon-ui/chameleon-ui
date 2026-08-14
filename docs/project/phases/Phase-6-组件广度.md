# Phase 6 · 组件广度 — 阶段目标与验收

> **日历**：待指定（建议 5–8 个日历周量级，开工会冻结） · **里程碑**：M6
> **前提**：M5 已关闭（断点/密度 Token、容器查询、变形矩阵就位）
> **一句话**：F/G/H 三族从零建齐、缺口名单清零，8 族组件目录达到愿景 §7.2 全集；Vue 子集同步扩面。
> **必读**：[工程约定与命名规范](../../engineering/工程约定与命名规范.md) + 愿景 v3.0 §7.2 / §9.4 + [Phase-5-三端内核.md](./Phase-5-三端内核.md)。
> **总览**：[Phase-2-Overview.md](./Phase-2-Overview.md)。

---

## 0. 本阶段前置要求

| # | 前置 | 完成标准 |
| :--- | :--- | :--- |
| 0.1 | M5 签字 | A5.* 全绿或遗留有单 |
| 0.2 | catalog v2.0 冻结会 | 本阶段全部新 slug 名单 + 总数（约 101，含 P5 的 4 个；准数以冻结会为准）签字；置换走 `changeLog` |
| 0.3 | 重型预算修订会 | DataGrid（S2 ≤60KB）、F 族单组件、G 族画布的预算条目写入 `benchmarks/budgets.json`（工程约定 §11.1 修订）；**未批则对应组件不得合入** |
| 0.4 | 图表/编辑器选型会 | Chart 统一封装层（自研 SVG 子集 vs 集成成熟引擎）、Editor 内核（自研 vs 成熟内核封装）书面裁定 |
| 0.5 | 砍单顺序书面化 | 进度不逮时的降级顺序（见 §13），冻结会签字 |
| 0.6 | Vue 范围单 | 本阶段 Vue 子集目标清单（≥20）签字 |

---

## 1. 阶段效果（Objective）

| 效果 | 表现 |
| :--- | :--- |
| 8 族无空族 | F/G/H 从 0 到可用；愿景 §7.2 每个点名组件有 slug 对应 |
| 目录全集 | catalog v2.0 冻结；8 族映射表 100% 覆盖 |
| 重型过线 | DataGrid 虚拟化万级行演示；S2 预算进 CI |
| 双栈扩面 | Vue 子集 ≥20 组件，S1 同口径 |
| 门禁不松 | 每个新组件走 Phase 1 §3.3 标准工序全量 |

---

## 2. 工作任务（Scope · 显式名单）

现有 50（catalog.json 冻结）+ P5 新增 4（action-sheet / tab-bar / safe-area / sidebar）之上，本阶段新增 **47**：

**F 可视化族 ×6**（愿景 §7.2 F，现状 0/6）

| slug | 说明 |
| :--- | :--- |
| `chart` | 统一封装层（选型会定内核）；主题消费 Token |
| `kpi-dashboard` | 指标卡组合栅格 |
| `ticker` | 行情滚动条 |
| `sparkline` | 迷你趋势图（SVG） |
| `heatmap` | 热力矩阵 |
| `gauge` | 仪表盘 |

**G 画布族 ×7**（愿景 §7.2 G，现状 0/7）

| slug | 说明 |
| :--- | :--- |
| `canvas` | 基座：缩放/平移/小地图/网格吸附（Canvas 2D 后端） |
| `flow-node` | 流程节点 |
| `edge` | 连线 |
| `mind-map` | 思维导图布局 |
| `graph-view` | 关系图布局 |
| `pipeline-view` | CI/CD 流水线视图 |
| `canvas-toolbar` | 画布工具条 |

**H 内容协作族 ×7**（愿景 §7.2 H，现状 0/7）

| slug | 说明 |
| :--- | :--- |
| `editor` | 富文本编辑器（内核选型会定） |
| `markdown-renderer` | Markdown 渲染（流式友好，供 AI 对话场景） |
| `comment-thread` | 评论串 |
| `chat-bubble` | 对话气泡 |
| `code-block` | 代码块（高亮 + 复制） |
| `article-card` | 文章卡片 |
| `share-panel` | 分享面板 |

> H 族的「Rating/Review」由 C 族 `rating` + `comment-thread` 组合覆盖，矩阵中注明，不重复建 slug。

**A 族补 ×3**：`space`（与既有 `stack` 的去重决议进冻结会）、`container`、`masonry`

**B 族补 ×3**：`navbar`、`steps`、`command-palette`（⌘K）

**C 族补 ×10**：`password-input`、`otp-input`、`multi-select`、`rating`、`date-picker`、`time-picker`、`calendar`、`color-picker`、`search-bar`、`upload`（既有 `file-input` 之上的完整上传：拖拽/粘贴/进度/多文件）

**D 族补 ×7**：`data-grid`（虚拟化万级行）、`tag`、`statistic`、`timeline`、`tree`、`image`、`carousel`

**E 族补 ×4**：`notification`、`confirm-dialog`、`result`、`loading-bar`

**Vue 扩面**：`components-vue` 由 2 → ≥20（S5 common-10 + 表单/反馈基础族，清单冻结会定）；只包装 `primitives-vue` + `tokens`，禁止复制第二份权威。

**本阶段不做**：Blocks（→ P7）；AG-UI / SchemaRenderer / data-ai-intent（→ P8）；G 族 WebGL/Worker/LOD 高级渲染（→ 后续阶段，见 §13）；R1–R3 实测（→ P9）。

---

## 3. 怎么做（关键路径）

1. 所有新组件按 Phase 1 §3.3 标准工序：目录 → 实现 → `contract.json` → `locales/` 21 语 → 单测 + 三断点快照 → 导出 → S1 门禁 → 合入。三端行为写 `contract.responsive`，消费 P5 断点/密度 Token 与容器查询。
2. DataGrid：虚拟化（行列双向）；1 万行演示页进 `apps/internal-demo`；S2 预算条目先于实现获批。
3. Chart：封装层只暴露 Token 化主题接口与数据契约；内核选型记录归档；不新造与预算无关的依赖。
4. G 族：`canvas` 基座先行，其余 6 个以其为依赖；布局算法复杂度进 `@complexity` 注记；本期 Canvas 2D 后端，WebGL/Worker 不宣称。
5. 每批次合入跑 RTL（ar）+ 伪本地化 + 德语膨胀门禁，与既有 CI 同级。
6. Vue：与 React 同契约同 Token；S1 同口径测量；差异书面说明。

---

## 4. 代码设计

| 域 | 设计 |
| :--- | :--- |
| catalog | v2.0 冻结；`changeLog` 记录本阶段全部追加；族字段（family）补齐 |
| F 族 | Chart 封装层依赖隔离；主题只走 Token |
| G 族 | `canvas` 为唯一渲染基座；节点/边为数据 + 渲染分离 |
| D DataGrid | 虚拟化引擎可替换（接口先行）；S2 硬门禁 |
| Vue | `components-vue` 目录与 React 同 slug 对齐 |

---

## 5. 命名规范（本阶段增量）

| 对象 | 规范 |
| :--- | :--- |
| 新 slug | 上文 §2 名单；kebab；冻结会定准 |
| 族标注 | catalog/contract 增加 `family: A|B|C|D|E|F|G|H` |
| DataGrid 预算 | `S2`（工程约定 §11.1 修订后生效） |

---

## 5.5 功能点：预留 · 埋点 · 标记（本阶段矩阵）

> **Phase 6 总原则：广度扩面不稀释单件质量；重型组件先预算后实现。**

| 功能点 | 预留 | 埋点 | 标记 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| 47 新组件 | 高级能力在 contract 标 `todo` | — | **必做** contract + 21 语 + `data-ai-role/state` | |
| DataGrid | 高级版能力（V2）预留 | — | S2 预算条目 | 未批预算不得合入 |
| G 族 | WebGL/Worker/LOD 预留接口 | — | 后端标记 `canvas-2d` | 禁止宣称高级渲染 |
| Editor | 协同能力预留 | — | 内核选型记录 | |
| Vue ≥20 | 其余组件 ETA 表 | — | 包名/目录同构 | R4 风险在 §13 |

### 合入检查（Phase 6）

- [ ] 新组件均有 `changeLog` 记录 — P6 slug 未写入 `catalog.json` `changeLog`（catalog 仍 50+P5×4）
- [ ] F/G/H 每族至少一个组件过全工序 — 各族均有 tsx+contract+21语+单测；缺三断点 / ar RTL VR，不算全工序
- [x] DataGrid 合入前 S2 条目已在 `budgets.json` — `metrics.S2.components: ["data-grid"]`，limit 60KB gzip
- [x] Vue 与 React 未出现第二份 Token 权威 — `components-vue` 仍消费 `@chameleon-ui/tokens`

---

## 5.6 性能指标（本阶段）

| 指标 | 本阶段要求 | 通过标准 |
| :--- | :--- | :--- |
| S1 ≤8KB | **必做 · CI** | 新基础组件逐一过线 |
| S2 ≤60KB | **必做 · CI（预算获批后）** | DataGrid 实测 |
| F/G 族预算 | **必做 · 预算会** | 条目进 `budgets.json` 后转硬门禁 |
| S3/S4 | **必做 · 回归** | 21 语 × 新组件文案、8 主题不超标 |
| S5 | **必做 · 重测** | 套件清单若变更走变更单 |
| R1–R3 | **—** | 仍未测，禁止宣称（P9 收口） |

---

## 5.7 算法 · 复杂度 · 可用性（本阶段）

| 功能点 | 算法/逻辑 | 复杂度 | 可用性 | 要求 |
| :--- | :--- | :--- | :--- | :--- |
| DataGrid 虚拟化 | 窗口化渲染 | O(可视行) | U1–U5 | 万级行滚动演示页证据 |
| G 族布局 | 树/图布局 | 注记；禁指数 | 错误可恢复 | 大图降级策略书面 |
| Editor | 内核选型 | 按选型 | U1 | 键盘/AT 契约继承内核能力，差距公示 |
| 日期族（date-picker/calendar/time-picker） | Intl + CLDR | — | U7 | 21 语格式化走 Intl，禁止手拼 |
| CommandPalette | 过滤/排序 | O(m log m) | U8 | 默认排序可复现 |

---

## 6–8. 开发 / 技术 / 突破

- **开发**：47 组件 + Vue ≥20；catalog v2.0；预算修订。
- **技术**：零运行时不破；契约/RTL/伪本地化门禁不松；安装单核不旁路。
- **突破**：组件丰富度从短板变及格线以上（愿景：丰富度权重最低，但 8 族空缺是口号硬缺口）。

---

## 9. 讨论会

| 议题 | 产出 |
| :--- | :--- |
| catalog v2.0 冻结（总数、space/stack 去重） | 签字表 + changeLog |
| 预算修订（S2 / F / G） | `budgets.json` PR |
| Chart / Editor 选型 | 决策记录 |
| 砍单顺序 | 书面 |
| Vue 范围 | 范围单 |

---

## 10–12. 交付 · 验收（DoD）· 报告

**交付**：47 个新组件（React）+ ≥20 Vue 组件；catalog v2.0；8 族映射表；DataGrid 万行演示；M6 报告。

**验收（可测量）**：

| # | 验收线 |
| :--- | :--- |
| A6.1 | catalog v2.0：愿景 §7.2 点名组件 → slug 映射 100% 覆盖（含组合覆盖注明）；`changeLog` 齐全 |
| A6.2 | 47 个新组件每个过标准工序（contract 校验 + 21 语 + 单测 + 三断点快照 + ar RTL + S1 + data-ai-role/state） |
| A6.3 | DataGrid 万级行演示页可跑；S2 实测 ≤ 预算且 CI 硬门禁生效 |
| A6.4 | F 族 `chart` 封装层主题完全来自 Token（无硬编码色值抽检） |
| A6.5 | G 族 `canvas` 基座缩放/平移/小地图/网格吸附演示可跑（Canvas 2D） |
| A6.6 | Vue 子集 ≥20 组件，S1 同口径实测记录入库 |
| A6.7 | `ci:phase6` = `ci:phase5` + `phase6:gates`（catalog 校验 + 族映射 + S2 + Vue S1）本机绿 |

**报告**：`docs/project/reports/M6-组件广度验收.md`。

---

## 13. 风险与诚实边界

- **吞吐风险**：47+ 组件是五个阶段中最大工作量；进度不逮按 §0.5 砍单顺序执行（建议顺序：G 族高级渲染 → Editor 高级能力 → carousel → 其余），砍单项转 `LEGACY-*` + ETA，禁止半成品合入。
- **双栈风险（R4）**：Vue 扩面若拖垮节奏，按 M0 决议机制触发推迟函，不砍 React 质量门禁。
- **预算未批**：S2/F/G 预算条目未过修订会前，对应组件不得合入、不得宣称达标。
- **G 族性能**：WebGL/Worker/LOD（愿景 §9.4）本阶段不交付，宣传口径仅限 Canvas 2D 基座。

## 14. 衔接

下一阶段：[Phase-7-场景Blocks.md](./Phase-7-场景Blocks.md)。
