# Chameleon UI — 软件 / 平台设计概要

> **版本**：v1.0  
> **日期**：2026年8月12日  
> **依据**：《综合可行性研究报告 v3.0》《立项项目书 v1.0》《系统架构设计说明书 v1.0》  
> **定位**：总体设计与关键子系统概要（非详细设计 / 非接口全文）；**架构总图与多视图以《系统架构设计说明书》为准**  
> **阅读对象**：架构师、核心开发、平台与 AI 工具链负责人  

---

## 目录

1. 设计目标与约束  
2. 系统上下文与用户  
3. 总体架构  
4. L1 设计系统基座  
5. L2 组件与三端变体  
6. L3 AI 能力  
7. L4 分发与工具链平台  
8. 横切：性能、质量、安全合规  
9. 技术选型与仓库结构建议  
10. 关键数据与契约  
11. 演进、工期编排（含三班倒）与开放问题  
12. 设计裁定记录  

---

## 1. 设计目标与约束

### 1.1 设计目标

| # | 目标 | 设计含义 |
| :--- | :--- | :--- |
| D1 | 人类与 AI 双消费者 | 文档与 Schema 同源；分发面同时服务 CLI/MCP |
| D2 | 主题换骨而非换皮 | Token 五维 + design-rules 成对交付 |
| D3 | RTL-first | 逻辑属性强制；RTL 评审先于 LTR 镜像 |
| D4 | 三端一体 | 同一组件 API；变形规则写入契约 |
| D5 | 零运行时优先 | Token 编译期产出；性能预算进 CI |
| D6 | 标准可外溢 | 契约/纪律包走开放 Schema，兼容 shadcn Registry |

### 1.2 硬约束

1. **依赖单向向下**：L2 不依赖 L3/L4；人类可只用 L1+L2。  
2. **L1 产出皆为数据**（JSON / CSS 变量 / Locale 包），不耦合 UI 框架。  
3. **L3 只索引、不复制** L1/L2 信息。  
4. **各层可替换**（Headless 底座、Token 编译器可换）。  
5. **MVP 边界**服从立项项目书；本概要中的「全量」能力按阶段启用。  

### 1.3 编号约定

| 前缀 | 含义 |
| :--- | :--- |
| L1–L4 | 总体架构层 |
| A1–A6 | AI 能力阶梯 |
| B1–B4 | 战略突破点 |
| V0–V4 | 商业增值分层（本概要仅标注触点，不展开商务） |

---

## 2. 系统上下文与用户

```
                    ┌──────────────────┐
                    │  AI 编码工具      │
                    │ Cursor/v0/Claude │
                    └────────┬─────────┘
                             │ MCP / Registry
┌────────────┐      ┌────────▼─────────┐      ┌────────────┐
│ 人类开发者  │─────▶│  Chameleon UI    │◀─────│ 企业内网    │
│ (Web 应用)  │ npm  │  Platform        │私有   │ Registry   │
└────────────┘ 拷贝  └────────┬─────────┘Registry└────────────┘
                             │
                    ┌────────▼─────────┐
                    │ 浏览器运行时      │
                    │ 组件 DOM +       │
                    │ data-ai-*        │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ 操作用户界面的 AI │
                    │ RPA / AI 测试    │
                    └──────────────────┘
```

| 角色 | 主要入口 | 核心诉求 |
| :--- | :--- | :--- |
| 个人开发者 | Registry + MCP + 文档站 | 快装、有主题、不撞脸 |
| 企业应用团队 | npm 版本化 + 私有 Registry | 稳定、多语言、合规、SLA |
| AI Agent（写码） | MCP + 契约 + design-rules | 选对组件、守纪律 |
| AI Agent（用界面） | `data-ai-*` | 稳定理解结构与状态 |
| 设计/创作者 | 主题工作台 / 主题市场 | 产主题、产纪律包 |

---

## 3. 总体架构

### 3.1 四层视图

```
┌─────────────────────────────────────────────────────────────┐
│ L4  Distribution & Tooling                                  │
│     npm · Registry · 私有 Registry · MCP · CLI              │
│     主题工作台 · 主题市场 · 文档站                             │
├─────────────────────────────────────────────────────────────┤
│ L3  AI Capability                                           │
│     A1 契约 → A2 Registry/MCP → A3 design-rules             │
│     → A4 协议适配 → A5 data-ai-* → A6 回流/Bench            │
├─────────────────────────────────────────────────────────────┤
│ L2  Components                                              │
│     三端变体内核 · 8 族组件 · Blocks                          │
├─────────────────────────────────────────────────────────────┤
│ L1  Design System Foundation                                │
│     Token/主题 · i18n/RTL · Headless/a11y · 字体             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 层间契约

| 层 | 产出 | 消费者 |
| :--- | :--- | :--- |
| L1 | CSS 变量、Locale 包、字体栈、a11y 工具、主题 Token | L2/L3/L4 |
| L2 | 组件源码、Blocks、（生成）契约字段源 | L3/L4 |
| L3 | Schema、design-rules 索引、MCP 工具面、回流事件 | L4、外部 AI |
| L4 | 包制品、Registry 条目、CLI、站点、工作台 | 终端用户与 Agent |

### 3.3 逻辑部署视图（平台侧）

| 单元 | 形态 | 说明 |
| :--- | :--- | :--- |
| `@chameleon-ui/*` 包 | npm 库 | 企业版本化依赖 |
| Registry 静态目录 | JSON + 源码树 | 兼容 shadcn schema；可 CDN/GitHost |
| MCP Server | Node 服务 / 本地进程 | 搜索、安装、主题联装 |
| 文档站 | 静态站点（自用组件构建） | 21 语言 dogfooding |
| 主题工作台 | Web 应用 | Token 编辑、三端/RTL 预览、a11y 守门 |
| 遥测管道 | 可选、可关闭 | 匿名事件 → 聚合 → Bench |
| 私有 Registry | 企业部署件 | 与公网同协议，不同命名空间 |

---

## 4. L1 设计系统基座

### 4.1 Token 子系统

```
Primitive  →  Semantic  →  Component
(原始值)       (意图别名)     (组件绑定)
```

- 格式：W3C DTCG 2025.10 JSON；主题间 `$extends` 差量继承  
- 五维：Color（OKLCH）/ Shape / Motion / Typography / Density  
- 编译：Style Dictionary 或 Terrazzo → CSS Custom Properties + 静态 CSS  
- **禁止**运行时 CSS-in-JS 作为默认样式方案  

### 4.2 主题引擎

| 能力 | 设计要点 |
| :--- | :--- |
| 内置主题 | 8 套基因致敬主题；代号命名；各含 Token + 图标映射 + 三端/RTL 规格 |
| 成对交付 | 每主题必须附 `design-rules.json`：**物理文件随 themes 包（L1 数据）发布**；L3 只做路径索引与 Schema 校验，**不维护副本** |
| 切换 | 明/暗与主题切换基于 CSS 变量作用域；无整表运行时注入 |
| 自定义 | 工作台编辑 → 导出 DTCG / CSS / Tailwind preset / Figma Tokens |
| MVP | 先交付 3 套：`theme-line` / `theme-cupertino` / `theme-silver-arrow`（各附最小 design-rules） |

### 4.3 i18n / RTL

| 模块 | 设计要点 |
| :--- | :--- |
| Locale | 目标 21 个；MVP：zh-CN / en / de / ar |
| 文案 | ICU MessageFormat；组件内置文案包随库发布 |
| 复数/格式 | CLDR via ICU；日期数字货币走 `Intl`；禁手写复数分支 |
| RTL | 逻辑属性 + lint 禁物理方向；`dir` / `:dir()`；图标镜像矩阵；UGC `unicode-bidi: isolate` |
| 流程 | **RTL-first 评审** → 再镜像 LTR |
| 字体 | 按文字体系 Token 化回退栈；Noto 兜底；unicode-range 分包 |
| CI | 伪本地化；德语膨胀；RTL 视觉回归 **分阶段**：MVP 以 **ar** 打通；ug/ur/fa 随 Phase 2 Locale 全量接入（规范 Phase 0 就位） |

### 4.4 Headless 与无障碍

- Headless：键盘、焦点陷阱、状态机；**Phase 0 POC 在 Ark UI 与 Base UI 间裁定**  
- a11y：WCAG 2.1 AA 角色与交互约定下沉为基元；组件层继承而非补丁  
- 目标产物含 VPAT（发布阶段）  

---

## 5. L2 组件与三端变体

### 5.1 三端变体内核（横切）

| 机制 | 规格 |
| :--- | :--- |
| 断点 | mobile <768 / tablet 768–1279 / desktop ≥1280 |
| 容器查询 | 组件级，避免「大屏嵌小卡片」误变形 |
| 密度 | compact / standard / comfortable（Token） |
| 指针 | 触控目标 ≥44px；hover 仅精确指针 |
| 变形 | 规则表写入组件契约（例：Dialog → 手机 Bottom Sheet / ActionSheet） |
| 排版 | fluid typography（`clamp`） |

### 5.2 组件族（目标目录）

| 族 | 代表 |
| :--- | :--- |
| A 基础与布局 | Button、AppShell、SafeArea、Stack/Grid… |
| B 导航 | Sidebar、TabBar、CommandPalette… |
| C 录入 | Input、Select、Form、DatePicker… |
| D 展示 | Table、DataGrid、List、Tree… |
| E 反馈 | Dialog、ActionSheet、Toast… |
| F 可视化 | Chart 封装、KPI、Sparkline… |
| G 画布 | Canvas 基座、MindMap、GraphView… |
| H 内容协作 | Editor、ChatBubble、CommentThread… |

**MVP**：约 20 个高频组件优先（Button/Input/Select/Dialog/Form/Table 等），契约与三端/RTL/性能过线优先于族内铺全。  
**明确推后**：F/G/H 中的高级能力（DataGrid 高级、Gantt、画布高级、重型 Editor）及行业 Blocks 矩阵 → Phase 2+（与立项 §4.3 一致）；MVP 至多 0～1 个 Blocks 冒烟 Demo。

### 5.3 Blocks

- 多组件页面片段，经 Registry 分发  
- 同样遵守 Token + RTL + 三端 + 契约  
- AI 可整块安装；用于补齐「场景拼得出来」而非堆原子数量  

### 5.4 组件单仓设计约束

每个组件目录建议包含：

```
ComponentName/
  index.ts              # 导出
  ComponentName.tsx     # 实现
  styles.css            # 或 CSS Module / 静态 CSS
  contract.json         # 语义契约（或由 MDX/源生成）
  locales/*.json        # 内置文案
  __tests__/            # 单元 + 视觉快照钩子
```

文档 Prose 与 `contract.json` **同一源生成**，CI 校验无漂移。

---

## 6. L3 AI 能力

### 6.1 能力阶梯

| 阶梯 | 名称 | 设计要点 |
| :--- | :--- | :--- |
| **A1** | 组件语义契约 | 开放 `component-contract.schema.json`；含用途/场景/变体/状态/组合/反模式/a11y/三端/RTL |
| **A2** | Registry + MCP | 兼容 shadcn registry；MCP：搜索、安装、**组件+主题联装** |
| **A3** | design-rules | 排版/间距/色彩边界/禁用模式/组合范式；与主题 Token 成对 |
| **A4** | 协议适配 | SchemaRenderer；v1.0：A2UI + AG-UI；MCP Apps → v2.0 |
| **A5** | data-ai-* | DOM：`data-ai-role/state/intent`；服务操作用户界面的 AI |
| **A6** | 回流 + Bench | 装机/意图/修改归因；GenUI-Bench 季度发布 |

### 6.2 突破点在设计上的落点

| 突破点 | 落点 |
| :--- | :--- |
| B1 开放标准 | A1 公开发布，非私有元数据 |
| B2 RTL-first | L1/L2 工程与评审流程（非仅 L3 特性） |
| B3 纪律包 | A3 + 主题成对；可交易、可校验 |
| B4 回流 | Registry/MCP **Day-1** 埋点；否则网络效应不成立 |

### 6.3 MCP 工具面（概要）

最小工具集（MVP）：

1. `search_components`（意图/标签/契约字段）  
2. `get_component`（源码 + 契约 + 依赖）  
3. `install_component`  
4. `list_themes` / `install_theme`（含 Token + design-rules + 字体配置）  
5. `install_bundle`（组件集 + 主题一次到位）  

### 6.4 回流事件（概要）

| 事件 | 字段原则 |
| :--- | :--- |
| install | 组件/主题 ID、来源（CLI/MCP/工具名）、匿名会话 |
| intent_vs_adopt | 搜索意图、采纳结果、反模式是否触发 |
| generation_quality | 可选：生成结果后续人工修改归因（配合 `data-ai-*`，隐私最小化） |
| opt_out | 用户关闭遥测 |

默认告知、可一键关闭；禁止采集源码内容与密钥。

---

## 7. L4 分发与工具链平台

### 7.1 双轨分发

| 轨道 | 形态 | 适用 |
| :--- | :--- | :--- |
| npm | 语义化版本、changelog、peerDeps | 企业稳定依赖 |
| Registry | 源码拷贝、可 fork | 个人与 AI；兼容 shadcn CLI 生态 |

私有 Registry与公网 **同协议、不同命名空间与鉴权**。

**CLI 与 MCP**：共享同一安装内核（解析 Registry 条目 → 写入约定目录）；CLI 面向人类终端，MCP 面向 Agent。MVP 命令面与 §6.3 工具面对齐：`search` / `add`（component|theme|bundle）/ `list-themes`。不执行远程任意脚本。

### 7.2 主题工作台（平台子系统）

| 模块 | 职责 | 分层 |
| :--- | :--- | :--- |
| Token 编辑器 | OKLCH、间距、圆角、动效曲线 | V0 基础版起 |
| 预览 | 桌面/平板/手机 + LTR/RTL + 明暗并排 | V0 基础版起 |
| a11y 守门 | 对比度实时校验 | V0 基础版起 |
| 导出 | DTCG / CSS / Tailwind preset / Figma | V0 基础版起 |
| AI 草稿 | NL → Token + design-rules 草稿 | V1 Pro / 后期 |
| 团队协作、版本 diff/回滚增强 | 企业向能力 | V1 Pro |

Phase 3 交付「工作台 Beta」≈ V0 基础版可用；V1 Pro 能力按增值层打开。

### 7.3 文档站

- 用本库 + 主题构建（dogfooding）  
- 目标 21 语言；组件页同时渲染人类文档与契约摘要  
- 即对外 Demo，也是质量探针  

### 7.4 与商业层触点（设计侧）

| 增值层 | 平台触点 |
| :--- | :--- |
| V0 | 公网开源全部核心能力 |
| V1 | 工作台 Pro、主题市场（社区原创，非致敬主题） |
| V2 | Pro 组件包（高级 DataGrid 等）独立包名/许可证 |
| V3 | 私有 Registry、企业主题托管、SLA 通道 |
| V4 | Bench 企业版、回流洞察、私有化 AI 工具链 |

---

## 8. 横切：性能、质量、安全合规

### 8.1 性能预算（CI 硬门禁）

| 项 | 预算（gzip） |
| :--- | :--- |
| 单基础组件（含样式） | ≤ 8KB |
| DataGrid 类 | ≤ 60KB |
| 单主题包 | ≤ 20KB |
| 单 Locale 包 | ≤ 6KB |
| 首屏套件（AppShell+常用10） | ≤ 100KB |

运行时目标：中端安卓基线；LCP ≤2.5s（Fast 4G）；INP ≤200ms（P75）；CLS ≤0.1。  
动画仅 `transform` / `opacity`。

### 8.2 质量门禁

| 门禁 | 工具/手段 |
| :--- | :--- |
| 单元 | Vitest |
| E2E / 视觉 | Playwright + RTL/三端快照 |
| i18n | 伪本地化；德语膨胀；ICU lint |
| 样式纪律 | 物理方向属性 eslint/stylelint 拒绝 |
| 契约漂移 | Prose ↔ contract 生成校验 |
| 体积/灯塔 | bundle size + Lighthouse CI |

**发版门禁（与立项 §8.2 对齐）**：超性能预算、RTL/伪本地化红灯、或主题未过约定法务节点 → **不得宣传性发布**。

### 8.3 安全与合规设计要点

- 依赖与字体/图标 license 扫描进 CI  
- 主题资产：禁止商标/官方图标/专有字体入库  
- 遥测：最小化、匿名、opt-out  
- MCP/Registry：安装路径限制在项目约定目录；不执行远程任意脚本（拷贝模式）  
- 企业私有 Registry：鉴权与审计日志（V3）  

---

## 9. 技术选型与仓库结构建议

### 9.1 选型（立项级）

| 域 | 选型 | 备注 |
| :--- | :--- | :--- |
| 语言 | TypeScript strict | 类型即 AI 可理解性基础 |
| 框架 | React 18/19 → Vue 3（视 POC） | 适配层隔离 |
| Headless | Ark **或** Base（POC） | Radix 仅兜底 |
| Token | DTCG + Style Dictionary/Terrazzo | |
| 样式 | CSS 变量 + Tailwind preset 映射 | 零运行时 |
| i18n | i18next / vue-i18n + ICU + Intl | |
| 测试 | Vitest + Playwright | |
| 包管理/构建 | 建议 pnpm + Turborepo（可替换） | Monorepo |

### 9.2 Monorepo 建议结构

```
chameleon-ui/
  packages/
    tokens/                 # DTCG 源与编译产物
    themes/                 # 各主题 Token + design-rules
    primitives/             # Headless/a11y 封装
    components/             # React 组件（Vue 后置 packages/components-vue）
    blocks/                 # 场景 Blocks
    i18n/                   # Locale 包与工具
    contract/               # schema 与生成器
    mcp-server/             # MCP
    cli/                    # CLI
    registry/               # Registry 清单与导出
  apps/
    docs/                   # 文档站
    theme-studio/           # 主题工作台
  toolings/
    eslint-config/
    stylelint-config/       # 含逻辑属性强制
    visual-regression/
  benchmarks/
    genui-bench/
```

### 9.3 框架适配策略

```
共享：tokens / themes / contract / i18n 数据
   ↓
primitives（尽量框架无关或双端）
   ↓
components-react  (P0)
components-vue    (P1，POC 通过后)
```

禁止在 L1 数据层出现 React/Vue 专用类型泄漏。

---

## 10. 关键数据与契约

### 10.1 组件契约（字段组）

| 字段组 | 示例 |
| :--- | :--- |
| 身份 | name、version、category |
| 意图 | purpose、scenarios |
| API 面 | props、variants、sizes、states |
| 组合 | compositionRules、antiPatterns |
| 合规 | accessibility |
| 适配 | threeEndBehavior、rtlBehavior |

### 10.2 design-rules（最小形状）

```json
{
  "typography": { "scale": "major-third", "lineHeight": 1.6 },
  "spacing": { "rhythm": 8, "density": "comfortable" },
  "motion": { "easing": "…", "durationFast": "150ms" },
  "disallowed": ["elastic-bounce", "purple-blue-gradient"],
  "componentRules": { "Button": { "minWidth": 80, "maxWidth": 320 } }
}
```

### 10.3 Registry 条目（逻辑模型）

- `name` / `type`（registry:ui | theme | block）  
- `files[]`、`dependencies`、`meta.contract`、`meta.theme`、`meta.designRules`  
- 保持与 shadcn registry schema **可映射兼容**（差异字段放扩展区）  

### 10.4 data-ai-*（运行时）

| 属性 | 用途 |
| :--- | :--- |
| `data-ai-role` | 组件角色（button/dialog/…） |
| `data-ai-state` | 可见状态机摘要 |
| `data-ai-intent` | 业务意图标签（可选） |

---

## 11. 演进、工期编排（含三班倒）与开放问题

### 11.1 分阶段能力开关与工期

交付内容与立项书一致；建设日历约 **16 周**（见立项书 §7）。

| 阶段 | 日历 | 设计重点 |
| :--- | :--- | :--- |
| Phase 0 | 第 1–5 日 | Ark vs Base POC（O1）；Token 管线；i18n/RTL 骨架；contract schema 草案；O2–O4 尽量拍板 |
| MVP | 第 2–3 周 | L1 骨架 + **20** 组件 + **3** 主题最小纪律 + **4** Locale（含 ar）+ MCP/回流；Blocks 至多 0～1 冒烟 |
| 开源 | 第 4–5 周 | MIT 开源；契约公开；GenUI-Bench 首期；**21 Locale**；**8** 主题；组件补齐 **45–50**；文档站 dogfooding |
| v1.0 | 第 6–9 周 | A3 完整化、A4 协议、工作台 Beta（V0）、私有 Registry、Vue 视 POC |
| v2.0 | 第 10–16 周 | 主题市场、MCP Apps、生态放大 |

### 11.2 三班倒实施模型（支撑 16 周日历）

立项书只锁定里程碑；**如何用人员密度吃掉日历**在本概要规定：

| 项 | 规定 |
| :--- | :--- |
| 班次 | 每日三班：A 00:00–08:00 / B 08:00–16:00 / C 16:00–24:00（可按属地微调，须无缝交接） |
| 编制 | 每班具备可独立推进的最小闭环（组件 + 基座/主题 + AI/平台 + 质量至少各 1 人当班）；三班总编制 ≈ 单班满编的 **3 倍** |
| 交接 | 每班结束强制交接单（当日目标/阻塞/待测/分支）；禁止口头交接 |
| 合并窗口 | 每班设固定合入窗；主干保护 + CI 全绿方可合并，避免三班互相踩踏 |
| 决策窗 | 架构/选型/范围变更仅在 **B 班工作时段**集中拍板（避免凌晨改方向）；**以项目主时区为准** |
| 不可压缩项 | 法务外审、开源后社区反馈、T1–T7 观察期仍按**自然日**计 |

> 未按三班满编到位时，工程侧须书面评估能否守住立项书 §7 日历；不能则申请调整里程碑，不得默契延期。

顺序依赖（POC→规模化组件、规范→主题扩面）仍然存在；三班倒用于提高单位日历日有效工时，而非取消依赖。


### 11.3 待 Phase 0 裁定的开放问题

| ID | 问题 | 裁定方式 |
| :--- | :--- | :--- |
| O1 | Ark UI vs Base UI | **已裁定 Ark UI**；Base UI 仅留 M0 POC 证据，正式包禁止混用 |
| O2 | Token 编译器 Style Dictionary vs Terrazzo | **已裁定 Style Dictionary 4.x**；DTCG + 确定性薄层 |
| O3 | Monorepo 工具链最终选型 | **已裁定 pnpm 9.15.0 + Turborepo** |
| O4 | 视觉回归基线托管（本地/云） | **已裁定 Phase 1 先本地/CI Playwright baseline + artifact**；2026-08-28（M1 计划验收日）前复审云托管 |

未裁定前，详细设计不得假定某一选项为唯一实现。

---

## 12. 设计裁定记录

| 日期 | 项 | 结论 | 依据 |
| :--- | :--- | :--- | :--- |
| 2026-08-12 | 四层架构与 A/B/V 编号 | 采纳 | 可行性报告 v3.0 |
| 2026-08-12 | 双轨分发 + MCP Day-1 回流 | 采纳 | B4 / 立项书 |
| 2026-08-12 | 主题基因致敬、不售卖致敬主题 | 采纳 | 合规红线 |
| 2026-08-12 | React 先行、Vue 视 POC | 采纳 | 可行性 §10 |
| 2026-08-12 | Headless 底座 | 采纳 Ark UI；Base UI 仅留 POC 证据 | O1 / M0 |
| 2026-08-12 | Token 编译器 | 采纳 Style Dictionary 4.x + 确定性薄层 | O2 / M0 |
| 2026-08-12 | Monorepo 工具链 | 保留 pnpm 9.15.0 + Turborepo | O3 / M0 |
| 2026-08-12 | 视觉回归 | Phase 1 先用本地/CI Playwright baseline + artifact；2026-08-28 前复审云托管 | O4 / M0 |

---

## 附录 A · 与立项文档的追溯

本附录是**追溯矩阵**（说明「概要章节 ↔ 上位文档」从哪来），不是待研发交付物。

| 设计章节 | 立项/可行来源 | 完成/维护时点 |
| :--- | :--- | :--- |
| §3 总体架构 | 可行 §4；立项 §6 | **已完成**（随本概要 v1.0）；架构变更时同步改，并核对《系统架构设计说明书》 |
| §4–§7 分层 | 可行 §5–§8、§12 | **已完成**；模块边界变更时同步改 |
| §8 横切 | 可行 §9、§11、§15 | **已完成**；性能预算/门禁数字变更时同步改 |
| §11 演进 | 立项 §4.3、§7；可行 §14 | **已完成**；日历或 Phase 范围变更时同步改 |
| 全文编号 L/A/B/V | 可行 §4.1 约定 | **已完成**；新增编号体系时先改定架构说明书再回写本表 |

**维护节奏**：每个里程碑（M0–M4）退出评审前做一次附录 A 抽查；发现断链当场补，不另开项目。

## 附录 B · 详细设计文档（完成时点）

| 文档 | 用途 | 完成时点（最迟） | 依赖里程碑 |
| :--- | :--- | :--- | :--- |
| 《系统架构设计说明书 v1.0》 | **架构评审主册** | **已完成**（进入 Phase 0 前） | 开工前 |
| 《工程目录与文件结构说明书 v1.0》 | 仓库目录树、包职责、脚手架验收 | **已完成**；目录变更时同步修订 | 进 Phase 0 编码前 |
| 《详细设计与验收说明书 v1.0》 | Phase 流水 + 验收 | **已完成**（进入 Phase 0 前） | 开工前 |
| Phase 0《基元 POC 报告》 | O1（及 O2–O4）书面裁定；回写架构说明书 §13 / 本概要 §12 | **Phase 0 第 5 日（M0）** | M0 退出必交 |
| 《RTL 与图标镜像工程规范》 | 逻辑属性、镜像矩阵、bidi、CI 范围 | **Phase 0 结束（M0）**；Phase 1 可修订补丁 | M0；支撑 MVP ar |
| 《主题 Token 与 design-rules 编写指南》 | 五维 Token、最小/完整 rules、主题 DoD | **Phase 1 第 2 周末前**（首套主题合入前） | 支撑 M1 |
| 《Registry / MCP 接口说明书》 | Registry 条目、MCP/CLI 共内核、工具面字段 | **Phase 1 第 3 周末（M1）前** | M1 退出必交 |
| 《CI 门禁与性能预算实施手册》（可选抽编） | 从本概要 §8 + 验收说明书横切节固化操作册 | **Phase 1 结束（M1）前** 建议完成；最迟 **Phase 2 开源前（M2）** | 发版门禁 |

**未完成处理**：到达上表「最迟」仍无交付 → 不得进入下一 Phase 扩面（与验收说明书退出纪律一致）；仅允许修缺陷，不开新范围。

> **本概要效力**：约束架构边界、契约形状与工程铁律；不替代模块详细设计与接口全文。变更 L1–L4 边界或 A1–A6 顺序，须同步修订立项范围或提交架构变更单。
