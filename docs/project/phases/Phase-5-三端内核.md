# Phase 5 · 三端内核 — 阶段目标与验收

> **日历**：待指定（建议 3–4 个日历周量级，开工会冻结） · **里程碑**：M5
> **前提**：M4 已关闭（建设期收口，[`Phase-4-v2.0.md`](./Phase-4-v2.0.md)）
> **一句话**：三端一体从「契约描述」落地为工程质量——断点/密度 Token、容器查询基础设施、变形规则矩阵，以及 ActionSheet / TabBar / SafeArea / Sidebar 四个点名组件。
> **必读**：[工程约定与命名规范](../../engineering/工程约定与命名规范.md) + 愿景 v3.0 §7.1 / 附录 C + 本文 §0–§5.7。
> **总览**：[Phase-2-Overview.md](./Phase-2-Overview.md)。

---

## 0. 本阶段前置要求

| # | 前置 | 完成标准 |
| :--- | :--- | :--- |
| 0.1 | M4 报告签字 | A4.* 全绿或遗留项均有 `LEGACY-*` 单 |
| 0.2 | 断点/密度命名冻结会 | 断点 `mobile <768` / `tablet 768–1279` / `desktop ≥1280`（愿景 §7.1）；密度三档命名须处理 `themes` 现有 `spacing.density` 枚举（`compact\|comfortable\|spacious`，design-rules v1.0）与愿景（compact/standard/comfortable）的冲突 → 出 design-rules schema **v1.1 迁移单** |
| 0.3 | catalog 变更流程启动 | 本阶段 4 个新 slug 走 `catalog.json` `changeLog`；冻结会签字 |
| 0.4 | 容器查询基线决议 | 目标浏览器基线书面化；不支持容器查询环境的降级策略书面化（未决不得宣称「三端一体」） |
| 0.5 | 硬编码媒体查询清单签字 | 现存 11 个组件 CSS 含 `768/1280/@media` 字面量（checkbox / app-shell / dialog / select / switch / button / table / radio / spinner / tabs / skeleton），改造范围逐条列出 |

---

## 1. 阶段效果（Objective）

| 效果 | 表现 |
| :--- | :--- |
| 断点即 Token | `tokens` 编译产物含 `--cu-breakpoint-*`；组件 CSS 禁止断点字面量 |
| 密度即 Token | compact/standard/comfortable 三档阶梯可切换；随端默认值表冻结 |
| 容器查询可用 | 共享容器规范 + 首批改造组件在容器（非视口）内正确变形 |
| 变形有矩阵 | 附录 C 变形规则写入契约 `responsive`，实现与契约一致 |
| 新组件 4 个 | action-sheet / tab-bar / safe-area / sidebar 全工序过线 |
| 触控达标 | 本期范围内移动端触控目标 100% ≥44px |

---

## 2. 工作任务（Scope）

T5.1 断点 Token · T5.2 密度阶梯 · T5.3 流体排版 · T5.4 容器查询基础设施 · T5.5 变形规则矩阵 · T5.6 新组件 ×4 · T5.7 输入模态与触控 · T5.8 视觉回归矩阵扩展。

**本阶段不做**：F/G/H 族、Blocks、AG-UI、`data-ai-intent` 铺开、R1–R3 实测（→ P6–P9）。

---

## 3. 怎么做（关键路径）

### 3.1 断点 Token（`packages/tokens`）

1. 新增 `tokens/src/core/breakpoint.json`（DTCG）：`breakpoint.mobile <768px`、`breakpoint.tablet 768–1279px`、`breakpoint.desktop ≥1280px`。
2. 编译进 `dist/css/variables.css`（`--cu-breakpoint-*`），沿用现有 style-dictionary 管线，不新造编译器。
3. stylelint 增加规则：组件 CSS 断点只许消费 Token 变量/具名媒体查询，字面量 `768px|1280px` 拦截（与逻辑属性 lint 同级）。

### 3.2 密度阶梯（`packages/tokens`）

1. 新增 `tokens/src/core/density.json`：compact / standard / comfortable 三档间距与控件尺寸阶梯（`--cu-density-*` 缩放系数 + `--cu-control-size-*`）。
2. 随端默认值映射表（端 × 密度）进冻结会；与 8 套主题 `design-rules.json` 的 `spacing.density` 对齐迁移（schema v1.1）。
3. 触控目标 Token：`--cu-touch-target-min: 44px`（愿景 §7.1）。

### 3.3 流体排版

字号阶梯 `clamp()` 实现，随断点流变；写入 `tokens/src/core/typography.json` 或等效文件（命名冻结会定）；产物仍为静态 CSS。

### 3.4 容器查询基础设施

1. 规范：组件根设 `container-type` 的策略（默认不全局开启，避免嵌套塌陷；白名单制）。
2. 首批改造：§0.5 清单 11 个组件的硬编码媒体查询 → Token/容器查询；`app-shell`、`dialog`、`table`、`tabs` 优先进容器查询（变形相关）。
3. 测试：同一组件在窄容器 + 宽视口、宽容器 + 窄视口两组快照，证明驱动源是容器而非视口。

### 3.5 变形规则矩阵（愿景附录 C 起步）

| 组件 | 桌面 | 平板 | 手机 |
| :--- | :--- | :--- | :--- |
| Dialog | 居中模态 | 居中模态 | Bottom Sheet（已有，回归保持） |
| Navigation（sidebar/tab-bar） | 持久侧边栏 | 可折叠侧边栏 | 底部 TabBar |
| Table | 完整表格 | 响应式列隐藏 | 横向滚动 / 卡片列表（契约描述 + 演示页） |
| DatePicker | 内联日历 | 弹出面板 | 底部弹出（组件本体 P6 交付，本阶段只冻结契约行为） |

矩阵每行进 `contract.responsive`；实现与契约不一致视为缺陷。

### 3.6 新组件 ×4（标准工序，Phase 1 §3.3 不变）

| slug | 族 | 要点 |
| :--- | :--- | :--- |
| `action-sheet` | E 反馈 | 移动端动作面板；Dialog 的手机变形目标；焦点陷阱 + Escape/下滑关闭 |
| `tab-bar` | B 导航 | 移动底部导航；RTL 顺序；安全区底边距 |
| `safe-area` | A 基础与布局 | `env(safe-area-inset-*)` 封装；刘海/虚拟键区适配 |
| `sidebar` | B 导航 | 桌面持久 / 平板可折叠；与 tab-bar 组成 Navigation 变形对 |

每个：目录 `packages/components/src/<slug>/` + `contract.json` + `locales/` 21 语 + 单测 + 三断点快照 + S1 门禁 + `data-ai-role/state`。

### 3.7 输入模态与触控

1. hover 门控：`@media (hover: hover)` 包裹 hover 态，触控不出悬停粘滞。
2. 触控目标：新组件 + 改造清单移动端 100% ≥44px；抽检脚本或人工测量记录入库。
3. 虚拟键盘：输入类组件在移动视口不被键盘遮挡的演示页（input 已有，回归保持）。

### 3.8 视觉回归矩阵扩展

`toolings/visual-regression` 增加：新 4 组件 × {390, 768, 1280} × {ltr, rtl(ar)}；官方目标仍为 `apps/internal-demo`。

---

## 4. 代码设计

| 域 | 设计 |
| :--- | :--- |
| Token | 断点/密度为编译期数据；运行时不注入 JS |
| 媒体/容器查询 | 只消费 `--cu-*`；字面量由 stylelint 拦截 |
| 变形 | 行为差异写 `contract.responsive.breakpoints`；实现对齐契约 |
| 密度切换 | `data-density` 属性或主题层默认值；不改组件 API 面 |
| catalog | 4 个新 slug 追加 + `changeLog` 变更单；不置换既有 50 |

---

## 5. 命名规范（本阶段增量）

| 对象 | 规范 |
| :--- | :--- |
| 断点 Token | `--cu-breakpoint-{mobile,tablet,desktop}` |
| 密度 Token | `--cu-density-{compact,standard,comfortable}`（冻结会最终定） |
| 新组件 slug | kebab：`action-sheet`、`tab-bar`、`safe-area`、`sidebar` |
| design-rules schema | v1.1（密度枚举迁移单） |
| 变更单 | `catalog.json changeLog` 含日期 + 原因 |

---

## 5.5 功能点：预留 · 埋点 · 标记（本阶段矩阵）

> 字典见 [工程约定 §10](../../engineering/工程约定与命名规范.md)。
> **Phase 5 总原则：三端能力全部落在 Token/契约/CSS，不进组件运行时 JS；未改造组件列清单，禁止宣称全库完成。**

| 功能点 | 预留 | 埋点 | 标记 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| 断点/密度 Token | 更多断点档（宽屏）预留 | — | Token 名进 README | |
| 容器查询 | 未改造组件清单公示 | — | 白名单制 | 禁止宣称全量覆盖 |
| 变形矩阵 | 附录 C 外行可追加 | — | `contract.responsive` | |
| 新组件 ×4 | — | — | **必做** contract + 21 语 + `data-ai-role/state` | |
| 触控 44px | 全库审计预留到 P9 | — | 本期范围清单 | 范围外不得宣称 |
| DatePicker 变形 | 组件 P6 才建 | — | 契约行为先冻结 | |

### 合入检查（Phase 5）

- [x] 组件 CSS 无新增断点字面量 — `chameleon/no-breakpoint-literal` 在 `phase1:gates`；`packages/components/src/*/styles.css` 当前无视口 width `@media`
- [x] 容器查询改造组件的「容器驱动」快照成对存在 — A5.3 MET：`packages/components/src/test/container-driven.test.tsx` + `toolings/visual-regression/tests/container-driven.spec.ts` + 成对 PNG（Playwright `--update-snapshots` 实拍）
- [x] catalog `changeLog` 有本阶段 4 条记录 — action-sheet / tab-bar / safe-area / sidebar（2026-08-13）
- [x] 未决降级策略前，文档不出现「三端一体已完成」 — 降级策略已写入 `docs/engineering/容器查询与三端规范.md` §4；文档仍禁止宣称完成

---

## 5.6 性能指标（本阶段）

> 数字 SSOT：工程约定 §11 + `benchmarks/budgets.json`。

| 指标 | 本阶段要求 | 通过标准 |
| :--- | :--- | :--- |
| S1 单基础组件 ≤8KB gzip | **必做 · CI 硬门禁** | 4 个新组件各自过线 |
| S5 首屏套件 ≤100KB | **必做 · 重测** | 新组件不进 common-10 则不重冻结套件；若进则走变更单 |
| R1–R3 | **—** | 仍未测（LEGACY-2026-001…003），本阶段不宣称 |
| 密度/断点 Token | **必做** | 编译产物体积增量写入 M5 报告 |

---

## 5.7 算法 · 复杂度 · 可用性（本阶段）

| 功能点 | 算法/逻辑 | 复杂度 | 可用性 | 要求 |
| :--- | :--- | :--- | :--- | :--- |
| 容器查询改造 | CSS 声明 | 静态 | U6 | 不成对快照不得合入 |
| ActionSheet/TabBar/Sidebar 交互 | 焦点/Roving（经 primitives） | C4/C5 | U1–U5、U8 | 基元不达标不得自研凑合 |
| SafeArea | `env()` 封装 | O(1) | U6 | 无 `env()` 支持环境有回退 |
| 密度切换 | 属性选择器 | 静态 | U8 | 不新增组件必填 prop |

---

## 6–8. 开发 / 技术 / 突破

- **开发**：tokens（breakpoint/density/typography）、容器查询改造 ×11+、新组件 ×4、VR 矩阵。
- **技术**：零运行时不破；契约即变形说明书；L2 不感知 L3/L4。
- **突破**：B2 RTL 回归矩阵随新组件保持；为 P6 组件广度打底。

---

## 9. 讨论会

| 议题 | 产出 |
| :--- | :--- |
| 密度命名与 design-rules v1.1 | 迁移单 |
| 容器查询浏览器基线与降级 | 书面决议 |
| 变形矩阵冻结 | 签字表 |
| catalog v2.0 追加 | changeLog |
| 触控审计范围 | 清单 |

---

## 10–12. 交付 · 验收（DoD）· 报告

**交付**：断点/密度/排版 Token 与编译产物；容器查询规范 + 改造清单；新组件 ×4；变形矩阵；VR 报告；M5 报告。

**验收（可测量）**：

| # | 验收线 |
| :--- | :--- |
| A5.1 | `tokens` 构建产物含 `--cu-breakpoint-*` 与密度阶梯变量；token 编译测试绿 |
| A5.2 | stylelint 断点字面量规则进 CI；§0.5 清单 11 个组件改造完成或有 `LEGACY-*` 单 |
| A5.3 | 容器查询白名单组件均有「窄容器+宽视口 / 宽容器+窄视口」成对快照 |
| A5.4 | action-sheet / tab-bar / safe-area / sidebar 过标准工序：contract 校验、21 语文案、单测、S1、ar RTL 快照 |
| A5.5 | 变形矩阵行与 `contract.responsive` 一一对应；Dialog/Navigation 在 390/768/1280 快照行为与契约一致 |
| A5.6 | 本期范围移动端触控目标 ≥44px 测量记录入库（100% 覆盖本期清单） |
| A5.7 | `ci:phase5` = `ci:phase4` + `phase5:gates`（Token 编译 + 断点 lint + 容器快照 + 新组件门禁）本机绿 |

**报告**：`docs/project/reports/M5-三端内核验收.md` — 摘要、范围、矩阵、证据、A5 逐条、缺陷、Phase 6 输入、签字。

---

## 13. 风险与诚实边界

- 容器查询降级策略未验证前，**禁止**对外宣称「三端一体」。
- 密度枚举迁移是 design-rules v1.0 → v1.1 的破坏性变更；老主题包兼容策略未定时不得强推。
- 触控 44px 与容器查询均限本期清单，禁止扩大宣称。
- R1–R3 仍处 LEGACY 未测状态，本阶段任何性能话术仅限体积门禁。

## 14. 衔接

下一阶段：[Phase-6-组件广度.md](./Phase-6-组件广度.md)。
