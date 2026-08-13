# Chameleon UI — 系统架构设计说明书

> **版本**：v1.0  
> **日期**：2026年8月12日  
> **依据**：《综合可行性研究报告 v3.0》《立项项目书 v1.0》《软件/平台设计概要 v1.0》  
> **定位**：**架构单一事实来源**（逻辑 / 运行 / 部署 / 数据 / 安全视图）；供架构评审与研发对齐  
> **非本册**：分阶段流水任务与验收 →《详细设计与验收说明书》；商务分层细节 → 可行性 §12  

---

## 目录

1. 架构目标与原则  
2. 系统上下文  
3. 逻辑架构（L1–L4）  
4. 运行时架构  
5. 构建与制品架构  
6. 包与仓库架构  
7. 关键链路（时序）  
8. 部署架构  
9. 数据与契约架构  
10. 安全与合规架构  
11. 质量与观测架构  
12. 演进与技术风险  
13. 架构裁决与变更  

---

## 1. 架构目标与原则

### 1.1 要解决的架构问题

1. 同一套设计系统同时服务 **人类开发者** 与 **AI Agent**  
2. 主题必须是 **五维 Token + 设计纪律**，而非换色  
3. 国际化 **RTL-first**，非事后补丁  
4. 手机 / 平板 / 桌面 **同源组件**  
5. 分发同时支持 **npm 稳定依赖** 与 **Registry 源码拷贝 + MCP**  

### 1.2 架构原则（不可破）

| ID | 原则 | 含义 |
| :--- | :--- | :--- |
| P1 | 依赖单向向下 | L2 不依赖 L3/L4；人类可只用 L1+L2 |
| P2 | L1 皆为数据 | Token/Locale/rules 文件不耦合 React/Vue |
| P3 | L3 只索引不复制 | 契约/规则的权威在源包；AI 层索引与校验 |
| P4 | 层可替换 | Headless、Token 编译器、MCP 实现可换实现不换契约 |
| P5 | 零运行时默认 | 样式编译期产出；禁默认 CSS-in-JS |
| P6 | 文档与契约同源 | Prose 与 `contract` 同一生成源，CI 防漂移 |
| P7 | 双轨同分发语义 | CLI 与 MCP 共享安装内核 |

### 1.3 编号约定

| 前缀 | 含义 |
| :--- | :--- |
| L1–L4 | 总体逻辑层 |
| A1–A6 | L3 内 AI 能力阶梯 |
| B1–B4 | 战略突破点（落在多层） |
| V0–V4 | 商业触点（架构只标边界） |

---

## 2. 系统上下文

```
                 ┌─────────────────────┐
                 │  AI 编码工具         │
                 │  Cursor / v0 / …    │
                 └──────────┬──────────┘
                            │ MCP
┌──────────┐     ┌──────────▼──────────┐     ┌──────────────┐
│ 人类开发者 │────▶│   Chameleon UI      │◀────│ 企业私有      │
│ Web App  │npm/ │   Platform          │同协议│ Registry     │
└──────────┘拷贝 └──────────┬──────────┘     └──────────────┘
                            │ 渲染
                 ┌──────────▼──────────┐
                 │ 浏览器 DOM           │
                 │ + data-ai-*         │
                 └──────────┬──────────┘
                            │
                 ┌──────────▼──────────┐
                 │ 操作用户界面的 AI     │
                 │ RPA / AI 测试        │
                 └─────────────────────┘
```

**信任边界**：公网 Registry/MCP（匿名遥测可选）≠ 企业私有 Registry（鉴权+审计）。

---

## 3. 逻辑架构（L1–L4）

### 3.1 分层总图

```
┌──────────────────────────────────────────────────────────────┐
│ L4  Distribution & Tooling                                   │
│     npm · Registry · 私有 Registry · MCP · CLI               │
│     文档站 · 主题工作台 · 主题市场 · 遥测汇聚                    │
├──────────────────────────────────────────────────────────────┤
│ L3  AI Capability                                            │
│     A1 契约 → A2 Registry元数据/MCP → A3 rules索引            │
│     → A4 协议适配 → A5 data-ai-* → A6 回流/Bench             │
├──────────────────────────────────────────────────────────────┤
│ L2  Components                                               │
│     三端变体内核 · 8 族组件 · Blocks                           │
├──────────────────────────────────────────────────────────────┤
│ L1  Design System Foundation                                 │
│     Token/主题(含 rules 文件) · i18n/RTL · Headless/a11y · 字体 │
└──────────────────────────────────────────────────────────────┘
         ▲ 依赖单向向下
```

### 3.2 层职责与非职责

| 层 | 职责 | 非职责 |
| :--- | :--- | :--- |
| **L1** | 定义 Token/主题/Locale/基元；产出可编译数据与行为基元 | 不知 MCP、不知 Registry 协议 |
| **L2** | 组装可视组件与 Blocks；写契约源字段；消费 L1 | 不知 L3/L4；不做遥测汇聚 |
| **L3** | 索引契约与 rules、MCP 语义、协议适配、回流语义 | 不复制 themes/rules 内容另维护一份 |
| **L4** | 打包、托管、安装、站点与工作台、对外暴露 | 不发明设计 Token 语义 |

### 3.3 L1 内部结构

```
L1
├── tokens/          DTCG Primitive→Semantic→Component；OKLCH 五维
├── themes/          8 致敬主题 + design-rules.json（权威落盘）
├── i18n/            21 Locale；ICU；Intl；RTL 规范与镜像矩阵数据
├── fonts/           文字体系回退栈 Token
├── primitives/      Headless（POC：Ark 或 Base）+ a11y 约定
└── build/           Token 编译器配置（Style Dictionary / Terrazzo）
```

### 3.4 L2 内部结构

```
L2
├── runtime-core/    三端断点 · 容器查询 · 密度 · 指针模态 · 变形引擎
├── components/      8 族（MVP 20 → 建设期 45–50）
├── blocks/          场景片段（MVP 0～1）
└── contract-src/    与文档同源的契约生成输入
```

### 3.5 L3 内部结构（A1–A6）

| 阶梯 | 架构职责 |
| :--- | :--- |
| A1 | 发布/校验 `component-contract.schema.json`；生成机器可读契约 |
| A2 | Registry 元数据索引；MCP 工具面语义（安装仍调 L4 内核） |
| A3 | 索引 themes 内 design-rules；Schema 校验；不存第二份正文 |
| A4 | SchemaRenderer；A2UI/AG-UI 适配器（v1.0）；MCP Apps（v2.0） |
| A5 | 约定并注入 `data-ai-*`（由 L2 渲染落实） |
| A6 | 定义回流事件模型；Bench 消费聚合结果 |

**B1–B4 落点**：B1→A1；B2→L1/L2 工程；B3→themes+A3；B4→A6+L4 管道 Day-1。

### 3.6 L4 内部结构

```
L4
├── publish/     npm 包流水线
├── registry/    公网静态 Registry（shadcn 兼容映射）
├── registry-private/  企业部署件（同协议+鉴权）
├── mcp-server/  MCP 进程（调用 install 内核）
├── cli/         人类终端（同一 install 内核）
├── apps/docs/   文档站
├── apps/studio/ 主题工作台（V0 基础 / V1 Pro）
└── telemetry/   可选汇聚 → Bench
```

### 3.7 层间契约表

| 生产者 | 产物 | 消费者 |
| :--- | :--- | :--- |
| L1 | CSS 变量、Locale、字体栈、themes(+rules)、primitives | L2、L3、L4 |
| L2 | 组件/Blocks 源码、契约源 | L3、L4 |
| L3 | Schema、索引、MCP 语义、回流模型、协议适配器 | L4、外部 AI |
| L4 | 制品、Registry 条目、站点、安装结果 | 开发者、Agent、企业 |

---

## 4. 运行时架构

### 4.1 应用侧（消费方项目）

```
App (React/Vue)
  ├── Theme provider（CSS 变量作用域 / data-theme）
  ├── Locale provider（i18n 实例 + dir）
  ├── Chameleon components（L2）
  │     └── primitives（L1 Headless）
  └── DOM + data-ai-*（供操作用户界面的 AI）
```

- **无**默认运行时样式引擎注入  
- 主题切换 = 切换 CSS 变量作用域，而非重算整表 JS theme object  

### 4.2 平台侧进程

| 进程/服务 | 运行形态 | 状态 |
| :--- | :--- | :--- |
| MCP Server | 本地 stdio 或远端 HTTP（按客户端） | 无业务库强状态；安装写用户工程目录 |
| 文档站 | 静态托管 | 构建期生成 |
| 主题工作台 | Web 应用（可 BFF） | 编辑态本地/云草稿 |
| 遥测汇聚 | 可选小服务 | 匿名事件；可关 |
| 私有 Registry | 企业内网静态+鉴权网关 | 与公网条目同构 |

---

## 5. 构建与制品架构

```
DTCG JSON ──编译──▶ CSS 变量 + 静态 CSS
Locale JSON ───────▶ 包内文案 / 按需加载 chunk
Component TSX ──打包──▶ ESM 包（npm）+ 源码树（Registry）
contract 源 ──生成──▶ contract.json + 文档片段
themes/+rules ─────▶ 主题包 / Registry theme 类型
```

**制品类型**

| 制品 | 消费者 |
| :--- | :--- |
| `@chameleon-ui/components` 等 npm | 企业版本锁定 |
| Registry `registry:ui` / `theme` / `block` | CLI/MCP 拷贝 |
| `component-contract.schema.json` | 外部工具 / 校验 |
| Docs / Studio 静态或应用包 | 浏览器 |

---

## 6. 包与仓库架构

### 6.1 Monorepo（逻辑依赖）

```
apps/docs ──────────▶ components, themes, tokens
apps/theme-studio ──▶ tokens, themes, components(预览)
packages/cli ───────▶ registry, contract（安装内核）
packages/mcp-server ▶ 同安装内核
packages/components ▶ primitives, tokens, themes, i18n
packages/blocks ────▶ components
packages/primitives ▶ （Headless 封装）
packages/tokens / themes / i18n / contract  ◀── 无框架泄漏
```

**禁令**：`tokens` / `themes` / `i18n` / `contract` 不得依赖 `react` / `vue`。

### 6.2 框架适配

```
共享数据与契约（L1 + contract）
        ↓
primitives（尽量无关或双端）
        ↓
components-react (P0)    components-vue (P1，视 POC)
```

---

## 7. 关键链路（时序）

### 7.1 MCP/CLI 安装「组件 + 主题」

```
Agent/Dev → MCP/CLI → 解析意图/参数
        → 查 Registry 索引（A2）
        → 校验 contract / design-rules schema（A1/A3）
        → install 内核：写入约定目录（组件源码+主题+fonts 配置）
        → 可选：emit install 遥测（A6，可关）
        → 返回结果
```

### 7.2 主题编译与运行切换

```
设计/工作台 改 Token → 提交 DTCG
    → CI 编译 CSS 变量
    → 发布 themes 包 / Registry theme
App 运行时切换 data-theme / class → 变量作用域变更 → 组件外观更新
```

### 7.3 写码 AI vs 用界面 AI

```
写码 AI：读 contract + design-rules + Registry → 生成调用代码
用界面 AI：读 DOM data-ai-* → 理解角色/状态 → 操作/断言
```

---

## 8. 部署架构

### 8.1 开源 / 公网

```
GitHub (源码 MIT)
  ├── npmjs (@chameleon-ui/*)
  ├── Registry CDN / GitHost 静态
  ├── Docs 静态托管
  ├── MCP：用户本地或托管实例
  └── Telemetry（可选）→ Bench 发布站
```

### 8.2 企业私有

```
企业 VCS / 制品库
  ├── 私有 npm（可选）
  ├── 私有 Registry + IdP 鉴权 + 审计日志
  ├── 内网 Docs / Studio
  └── 遥测默认关或仅内网汇聚
```

公网与私有 **Registry JSON 同构**，差异仅在命名空间、鉴权、网络位置。

---

## 9. 数据与契约架构

### 9.1 核心数据对象

| 对象 | 权威存储 | 索引方 |
| :--- | :--- | :--- |
| Design Tokens | `packages/tokens`, `packages/themes` | 编译器、Studio |
| design-rules | **随 theme 文件** | L3 Schema 校验 |
| Locale 消息 | `packages/i18n` + 组件 locales | i18n 运行时 |
| Component contract | 由源生成的 `contract.json` | A1/A2、文档 |
| Registry item | `packages/registry` 导出 | CLI/MCP |
| Telemetry event | 可选管道 | A6 / Bench |

### 9.2 契约字段组（组件）

身份 · 意图 · API 面 · 组合/反模式 · a11y · threeEndBehavior · rtlBehavior  

### 9.3 回流事件（最小）

`install` · `intent_vs_adopt` · `generation_quality`（可选）· `opt_out`  

隐私：默认告知、可关；不采源码与密钥。

---

## 10. 安全与合规架构

| 域 | 控制 |
| :--- | :--- |
| 供应链 | 依赖/字体/图标 license CI；锁定文件 |
| 主题 IP | 禁商标/官方图标/专有字体；代号命名；法务门禁挡发版 |
| 安装安全 | 仅写约定目录；拷贝模式不执行远端脚本 |
| 遥测 | 最小化、匿名、opt-out；企业可关 |
| 私有 Registry | 鉴权、审计、网络隔离 |
| a11y | WCAG 2.1 AA 基元下沉；VPAT 发布阶段 |

---

## 11. 质量与观测架构

```
PR → lint(逻辑属性/ICU) → unit → contract漂移 → bundle预算
   → Playwright(三端/阶段RTL) → 伪本地化
合并 → 主干
发版 → 发版门禁（性能+RTL+法务节点）→ npm/Registry/Docs
可选 → 遥测聚合 → GenUI-Bench
```

性能预算（gzip）与运行时 LCP/INP/CLS 见概要 §8.1 / 可行 §9；本册不重复数字表，**数字变更须同步改概要与验收说明书**。

---

## 12. 演进与技术风险

### 12.1 能力演进（与 16 周日历对齐）

| 阶段 | 架构里程碑 |
| :--- | :--- |
| Phase 0 | 底座裁定；Token/i18n/RTL 骨架；schema v0.1 |
| MVP | 双轨安装闭环；回流 Day-1；ar RTL |
| 开源 | 契约公开；Bench；21L/8 主题/45–50 组件 |
| v1.0 | A3 完整；A4；Studio V0；私有 Registry；Vue 视 POC |
| v2.0 | 主题市场；MCP Apps；生态放大 |

### 12.2 开放架构决策（Phase 0）

| ID | 决策 | 状态 |
| :--- | :--- | :--- |
| O1 | Ark vs Base | **已裁定：Ark UI**；Base UI 仅保留 POC 证据，正式包禁止混用 |
| O2 | Style Dictionary vs Terrazzo | **已裁定：Style Dictionary 4.x**；DTCG 源 + 仓内确定性薄层 |
| O3 | Monorepo 工具链 | **已裁定：pnpm 9.15.0 + Turborepo**；沿用 workspace 与任务图 |
| O4 | 视觉回归托管 | **已裁定：Phase 1 先用本地/CI Playwright baseline + artifact**；2026-08-28（M1 计划验收日）前复审云托管，Phase 0 不接云 |

### 12.3 主要架构风险

| 风险 | 架构对策 |
| :--- | :--- |
| 双栈拖垮 | 单栈兜底；适配层隔离 |
| L3 复制 L1 | rules/契约权威在源包；CI 禁止双源 |
| Registry 与 npm 语义分叉 | 同一组件源生成双制品 |
| 回流做不成 | Day-1 埋点；可关但不删管道 |

---

## 13. 架构裁决与变更

### 13.1 已裁决

| 项 | 结论 |
| :--- | :--- |
| 四层 + A/B/V 编号 | 采纳 |
| 双轨分发 + MCP/CLI 共内核 | 采纳 |
| rules 随 theme 落盘、L3 索引 | 采纳 |
| React P0、Vue P1 视 POC | 采纳 |
| 零运行时 CSS 默认 | 采纳 |

### 13.2 变更控制

变更 **P1–P7**、L1–L4 边界或 A1–A6 顺序：须架构变更单 → 更新本说明书 → 同步概要 / 验收说明书 / 立项范围（若影响交付）。

---

## 附录 A · 文档地图

| 问题 | 文档 |
| :--- | :--- |
| 为什么这套架构 | 可行性报告 §4、§8、§10 |
| 模块设计要点 | 软件/平台设计概要 |
| 阶段任务与验收 | 详细设计与验收说明书 |
| **架构评审主册** | **本说明书** |

## 附录 B · 修订记录

| 版本 | 日期 | 说明 |
| :--- | :--- | :--- |
| v1.0 | 2026-08-12 | 首版：上下文/逻辑/运行/构建/包/时序/部署/数据/安全/质量/演进 |
