# Chameleon UI

<p align="center">
  <img src="./brand/chameleon-logo.png" alt="Chameleon UI logo" width="200" />
</p>

> **简体中文 · [English](README.en.md) · [繁體中文（香港）](README.zh-HK.md) · [العربية](README.ar.md)**

**AI 原生 · headless 优先 · 三端一体（390/768/1280）· React 与 Vue 双框架的设计系统。**

Chameleon UI 在同一套 token、契约与架构之上，为 React 19 和 Vue 3.5 提供逐组件对齐的两套实现，并让 AI 代理能直接读懂组件：每个组件自带机器可读的契约，不需要从 README 和示例里猜用法。

- 组件：116 个，React / Vue 两侧逐一对齐（`116/116`）
- 三端一体：手机 390 / 平板 768 / 桌面 1280，密度、控件、排版随端变化
- 主题：8 套官方（`linear` / `apple` 双视觉旗舰 + 6 套致敬覆盖层），另有社区纪律包机制
- 语言：21 个 locale（ICU MessageFormat），含 RTL（`ar` `ug` `ur` `fa`）
- Headless 地基：Ark UI / Zag，经 `primitives` / `primitives-vue` 薄封装隔离
- 许可证：MIT。遥测默认关闭（`telemetry-notice.v1`）

> 当前版本 `0.4.0`，尚未发布 npm。在此之前用 tarball、`npm link` 或官方 Vite 模板接入，见下文。

---

## 为什么是 Chameleon UI

- 三端一体，不是三套代码。同一套组件靠容器查询和密度 token 在三档视口自适应；桌面侧栏、平板护栏、手机底部 Tab 由同一个 `Navigation` 变形而来。
- 跨框架一致。同一套设计 token、同一套组件契约，React 与 Vue 两个实现逐 slug 对齐。选一个伞包（`@chameleon-ui/react` 或 `@chameleon-ui/vue`）即可。
- AI 原生。每个组件带 `contract.json`（含 `dataAi.role` / `states` / `intents`）；`AGENTS.md` 是 AI 消费的唯一事实来源；MCP server 让代理直接查契约、装组件。
- 契约驱动。组件清单、契约、设计规则、词表各有唯一权威来源，由 CI 门禁防止文档与实现漂移。
- Headless 内核。样式与行为分离，想完全掌控渲染可以直接用 `primitives` 层。
- 版本化主题与 i18n。DTCG token 编译为标准 CSS 变量，主题和语言都是可组合的独立包。

---

## 快速开始

### 环境要求

- Node `>= 20.19.0`
- pnpm `9.15.0`（推荐 Corepack：`corepack enable`）

### 在本仓库内构建

```bash
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 check      # lint + typecheck + test + build
```

常用命令（根 `package.json`）：

| 命令 | 作用 |
| :--- | :--- |
| `pnpm build` | Turborepo 全量构建所有包 |
| `pnpm check` | lint + typecheck + test + build 一站式验证 |
| `pnpm clean` | 清理 `.turbo` / `dist` / 构建缓存 |
| `pnpm publish:check` | 发布前干跑检查（只检查，不推送） |
| `pnpm ai:check` | 校验 AGENTS / 契约 / 安装文档一致性 |
| `pnpm verify:external` | 校验官方外部模板可被消费 |

### 在你的应用里使用（npm 发布前）

两种方式任选，都不需要 `workspace:*`：

```bash
# 1. 打包 tarball，再在应用里安装
node ./scripts/pack-external.mjs           # React 伞包
node ./scripts/pack-external.mjs --vue     # Vue 伞包
npm install <path-to>/dist-tarballs/chameleon-ui-react-0.4.0.tgz

# 2. 或 npm link
node ./scripts/link-external.mjs --vue --apply
```

官方入门模板：[`templates/external-vite-react`](./templates/external-vite-react) · [`templates/external-vite-vue`](./templates/external-vite-vue)

---

## 软件包（Workspace）

pnpm + Turborepo monorepo，22 个 `@chameleon-ui/*` 包按分层组织。

### 分层规则

| 层 | 包含 | 规则 |
| :--- | :--- | :--- |
| L1 基础 | `tokens` · `themes` · `i18n` · `contract` | 框架无关，禁止依赖 `react` / `vue` |
| L1 原语 | `primitives` · `primitives-vue` | 仅薄封装 `@ark-ui/*` / Zag；peer 对应框架 |
| L2 组件 | `components` · `components-vue` | 仅依赖 L1；禁止直接 `import '@ark-ui/*'` |
| L3/L4 适配 | `adapter-*` · `schema-renderer` | 协议映射；写盘仅经 `install-core` |
| 安装内核 | `install-core` | 唯一写盘入口 |
| 目录 | `registry` · `registry-private` | 只读 / 私有服务，不写盘 |
| 外壳/服务 | `cli` · `mcp-server` · `market-service` | 薄外壳，写盘均收敛到 `install-core` |
| 消费伞包 | `react` · `vue` | 面向最终消费者，一包即可 |

### 包速览

| 包 | 说明 |
| :--- | :--- |
| `@chameleon-ui/tokens` | DTCG 设计 token 权威源 + 确定性 CSS 变量编译 |
| `@chameleon-ui/themes` | 主题覆盖层与 `design-rules`（`linear` 旗舰 + 7 套致敬） |
| `@chameleon-ui/contract` | 组件与设计规则的 JSON Schema + 校验 |
| `@chameleon-ui/i18n` | ICU MessageFormat 运行时、C3 Map 查找、伪本地化工具 |
| `@chameleon-ui/primitives` · `primitives-vue` | Ark UI / Zag 薄封装（headless 内核） |
| `@chameleon-ui/components-react` | React 组件实现（116 slugs + 契约文件） |
| `@chameleon-ui/components-vue` | Vue 组件（116/116 slugs + ThemeProvider） |
| `@chameleon-ui/react` · `@chameleon-ui/vue` | 消费伞包（统一入口） |
| `@chameleon-ui/install-core` | 唯一写盘内核：依赖图、冲突检测、幂等拷贝 |
| `@chameleon-ui/registry` · `registry-private` | 组件/主题目录；本地内网私有目录服务器 |
| `@chameleon-ui/cli` | `chameleon` CLI，薄壳指向 `install-core` |
| `@chameleon-ui/mcp-server` | MCP server（代理可查契约、装组件） |
| `@chameleon-ui/schema-renderer` | JSON Schema → 组件树渲染（默认映射 10 slugs） |
| `@chameleon-ui/blocks` | 可组合业务场景块 |
| `@chameleon-ui/adapter-a2ui` | A2UI 协议适配 |
| `@chameleon-ui/adapter-ag-ui` | AG-UI 协议适配（POC，仅仓库内试验） |
| `@chameleon-ui/adapter-mcp-apps` | MCP Apps（SEP-1865）协议适配（已支持，非主机认证） |
| `@chameleon-ui/market-service` | 主题市场 / 社区纪律包服务 |
| `@chameleon-ui/utils` | 通用工具（PNG/图像基本操作，纯 JS 零原生依赖） |

---

## 三端一体（手机 / 平板 / 桌面）

核心体验：一套组件自动适配三档视口（390 手机、768 平板、1280 桌面），不需要每个形态各写一套。

| 维度 | 三档 | 说明 |
| :--- | :--- | :--- |
| 断点 | `<768` / `768–1279` / `≥1280` | Token `--cu-breakpoint-{mobile,tablet,desktop}` |
| 密度 | `comfortable` / `standard` / `compact` | 随端默认（手机舒适 / 平板标准 / 桌面紧凑），可用 `[data-density]` 覆盖 |
| 控件 | 36 / 40 / 44px | `--cu-control-size-{compact,standard,comfortable}` |
| 排版 | `clamp()` 流体 | 随 `20rem → 80rem` 缩放 |

使用时有三点要注意：

- 宽度响应走 `@container` 容器查询，不直接用 `@media` 宽度断点（stylelint 会拦截）。
- 消费 `@chameleon-ui/tokens/css` 时必须同时引入 `@chameleon-ui/tokens/density.css`，否则密度和控件尺寸不随断点切换。
- 应用外壳用 `AppShell`（三档骨架）+ `Navigation`（同一 `items` API 在侧栏、可折叠护栏、底部 Tab 之间变形）+ `SafeArea`（刘海与手势条）。

三档相关组件：`AppShell` · `Navigation` · `NavigationTitle` · `Sidebar` · `TabBar` · `ActionSheet` · `SafeArea`。

完整工作原理（断点 token、容器查询与 `@media` 的关系、随端密度、Navigation 变形、为什么分 React/Vue）：[三端一体工作原理](./docs/theming/three-end-system.md)。

---

## 组件与主题

### 组件（116）

完整清单的唯一权威来源是 [`packages/components-react/catalog.json`](./packages/components-react/catalog.json)。每个组件自带：

- `contract.json`（含 `dataAi.role` / `states` / `intents`）
- 21 个 locale 的文案表
- 样式、类型、测试

### 主题（8 套官方 + 社区纪律包）

| 主题 | 说明 |
| :--- | :--- |
| `linear` | 视觉旗舰（深色优先，Linear 值级复刻），产品默认外观 |
| `apple` | 视觉旗舰（浅色优先，HIG / iOS 系统色板值级复刻），支持手动切深色 |
| `mercedes` `porsche` `ferrari` `tiktok` `wechat` `alipay` | 6 套致敬覆盖层 |
| `community-focus-first` | 社区纪律包（`registry:rules`）种子，不是主题 |

状态说明：`linear` 与 `apple` 是经过完整断言验证的双旗舰，生产环境默认用 `linear`。两套旗舰的色值、动效、字级、圆角都由测试锁定；「像不像原品」的观感验收仍以浏览器人眼实测为准。6 套致敬覆盖层仍在打磨，适合探索和参考。

- Token 系统如何工作（DTCG 权威源到 `--cu-*` 的编译、引用解析、环检测、overlay 与 `$extends` 继承）：[Token 工作原理](./docs/theming/token-system.md)。
- 主题是 overlay，只覆盖 core token 的子集。分步教程：[创建自定义主题](./docs/theming/creating-a-theme.md)。

### 语言与 RTL

- 21 个 locale（见 `catalog.json`）
- RTL 语言：`ar` `ug` `ur` `fa`
- 用 `directionForLocale`（`@chameleon-ui/i18n`）决定方向，不要自行猜测 `dir`

---

## AI 使用（首选入口）

`AGENTS.md` 是本库对 AI 消费的唯一事实来源。模型、代理、或者想让 AI 帮忙组装界面的开发者，都从它开始。

- [`AGENTS.md`](./AGENTS.md)：AI 消费完整规则（CSS、JS 引入、安装、MCP、禁止项）
- [`docs/ai/`](./docs/ai/)：附加说明（消费流程、SchemaRenderer、词表、主题扩展、社区包）
- [AI 工作原理](./docs/ai/how-ai-works.md)：契约驱动、意图词表、MCP 链路、映射/渲染/安装三层的端到端机制

挂载 MCP 后的标准工具顺序：

`get_started` → `get_import_specifiers`（写 import 前）→ `get_contract`（发组件前）→ `get_design_rules`（处理密度/RTL 前）

一切磁盘写入都必须经过 `install-core`（`chameleon add` 或 MCP `install_*`），没有第二个写盘入口。

---

## 目录结构

```
.
├── packages/                # 全部 @chameleon-ui/*
├── scripts/                 # lib 构建 / pack / link / publish:check / ai:check
├── templates/               # 官方外部 Vite 工程（React / Vue）
├── docs/ai/                 # AI 消费说明（SSOT 为 AGENTS.md）
├── docs/decisions/          # 架构决策记录（ADR）
├── brand/                   # Logo / 品牌资产
├── AGENTS.md                # AI 消费 SSOT
├── STRUCTURE.md             # 详细目录地图
└── LICENSE · CONTRIBUTING.md · SECURITY.md · CHANGELOG.md
```

> 维护者的 lint / 构建配置、体积预算等不在本仓库内（位于仓库外部），与消费者无关。

---

## 参考文档

| 主题 | 位置 |
| :--- | :--- |
| 目录地图 | [`STRUCTURE.md`](./STRUCTURE.md) |
| AI 消费规则 | [`AGENTS.md`](./AGENTS.md) |
| 架构决策（ADR） | [`docs/decisions/`](./docs/decisions/README.md) |
| 版本变更 | [`CHANGELOG.md`](./CHANGELOG.md) |
| 贡献指南 | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| 安全策略 | [`SECURITY.md`](./SECURITY.md) |

---

## License

[MIT](./LICENSE)
