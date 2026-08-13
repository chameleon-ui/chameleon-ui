# Chameleon UI — 工程目录与文件结构说明书

> **版本**：v1.1（Phase 0 瘦身）  
> **日期**：2026年8月13日  
> **依据**：《系统架构设计说明书 v1.0》《软件/平台设计概要 v1.0》《详细设计与验收说明书 v1.0》  
> **定位**：仓库「塔基」说明——目录树、包职责、命名约定、与 Phase 的对应关系  
> **完成时点**：进入 Phase 0 写代码前（本文件与脚手架一并就绪）  
> **v1.1**：workspace 仅保留 Phase 0 包；远期包延期创建；补 `install-core`；权威边界写入 §3

---

## 1. 为什么先有这份文档

**不能直接埋头写组件。** Phase 0 第 1 日要求先立 monorepo 脚手架；没有统一目录会导致：

- POC（Ark / Base）两套原型无处安放  
- Token / 契约 / 组件边界混乱，违反 L1 数据层禁框架泄漏  
- 后续 npm 与 Registry 双制品无法从同一源生成  

本说明书定义**目标树与当前落地**；**workspace 只含当前 Phase 所需包**，远期包延期创建（勿堆空壳）。变更目录须改本文件，并同步 `chameleon-ui/STRUCTURE.md`。

---

## 2. 仓库顶层一览

**原则：文档仓与工程塔分离；Phase 瘦身。** 工作区根只放项目文档与总控；monorepo 在 `chameleon-ui/`。

### 2.1 Phase 0 实际树（当前）

```
ChameleonUI/
├── README.md
├── chameleon-logo.png
├── Chameleon UI — *.md
├── docs/
└── chameleon-ui/                     # ★ 工程塔
    ├── package.json
    ├── pnpm-workspace.yaml           # packages/* · toolings/* · poc/*
    ├── turbo.json
    ├── tsconfig.base.json
    ├── README.md / STRUCTURE.md
    ├── poc/
    │   ├── ark-ui/
    │   └── base-ui/
    ├── packages/
    │   ├── tokens/
    │   ├── themes/
    │   ├── contract/                 # schema/工具，非契约正文副本
    │   ├── primitives/               # M0 后填
    │   ├── components/               # 可空壳
    │   └── install-core/             # CLI/MCP 共享安装内核（占位）
    └── toolings/
        ├── eslint-config/
        ├── stylelint-config/
        ├── tsconfig/
        └── visual-regression/
```

### 2.2 目标全量树（延期创建，勿提前空占）

```
chameleon-ui/packages/  += i18n, blocks, registry, cli, mcp-server, components-vue
chameleon-ui/apps/      += docs, theme-studio
chameleon-ui/benchmarks/+= genui-bench
```

> 安装与构建一律在 `chameleon-ui/` 下执行。仓内速查：`chameleon-ui/STRUCTURE.md`。

---

## 3. 包与目录职责

> 路径相对于 **`chameleon-ui/`**。标注 **P0** = Phase 0 已在 workspace；**延** = 阶段到了再创建。

| 路径 | npm 包名（建议） | 层 | 阶段 | 职责 | 允许依赖 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `packages/tokens` | `@chameleon-ui/tokens` | L1 | P0 | DTCG 源、编译脚本、CSS 变量产物 | 构建工具 only |
| `packages/themes` | `@chameleon-ui/themes` | L1 | P0 | 各主题 Token + **design-rules.json 权威** | tokens |
| `packages/contract` | `@chameleon-ui/contract` | L3 相关 | P0 | schema、从组件源**生成/校验**契约 | 无框架 |
| `packages/primitives` | `@chameleon-ui/primitives` | L1 | P0 | Headless/a11y；M0 选定后填实 | 选定基元库 |
| `packages/components` | `@chameleon-ui/components` | L2 | P0 | React 组件落点 | primitives, tokens, themes… |
| `packages/install-core` | `@chameleon-ui/install-core` | L4 | P0 | **安装内核**；cli/mcp 唯一实现处 | registry, contract（日后） |
| `poc/ark-ui` | （私有） | — | P0 | Ark 对比沙箱 | ark |
| `poc/base-ui` | （私有） | — | P0 | Base 对比沙箱 | base |
| `packages/i18n` | `@chameleon-ui/i18n` | L1 | 延·P1 | 共享 Locale / ICU | 无框架 |
| `packages/registry` | `@chameleon-ui/registry` | L4 | 延·P1–2 | Registry 导出 | contract, components… |
| `packages/cli` | `@chameleon-ui/cli` | L4 | 延·P1 | 人类入口（薄壳） | **install-core** |
| `packages/mcp-server` | `@chameleon-ui/mcp-server` | L4 | 延·P1 | MCP（薄壳） | **install-core** |
| `packages/blocks` | `@chameleon-ui/blocks` | L2 | 延 | 场景 Blocks | components |
| `packages/components-vue` | `@chameleon-ui/components-vue` | L2 | 延·P3 | Vue 适配 | 同数据层 |
| `apps/docs` | `@chameleon-ui/docs` | L4 | 延·P2 | 文档站 | components, themes |
| `apps/theme-studio` | `@chameleon-ui/theme-studio` | L4 | 延·P3 | 主题工作台 | tokens, themes, components |

**硬禁令**  
- `tokens` / `themes` / `i18n` / `contract` **不得**依赖 `react` / `vue` / `svelte`。  
- 组件契约**正文**在组件源目录；`contract` 包不做第二份手写正文。  
- 安装逻辑**只**在 `install-core`；禁止 cli / mcp 各写一套。

---

## 4. 单包内部文件结构（约定）

### 4.1 通用库包

```
packages/<name>/
  package.json
  tsconfig.json
  README.md
  src/
    index.ts
  dist/                 # 构建产物（gitignore）
```

### 4.2 组件包（`packages/components`）

```
packages/components/
  src/
    button/
      index.ts
      Button.tsx
      Button.module.css   # 或 styles.css（零运行时）
      contract.ts         # 或 contract.json 的生成源
      locales/
        zh-CN.json
        en.json
        de.json
        ar.json
      Button.test.tsx
    ...
    index.ts              # 总导出
```

与《详细设计与验收说明书》组件 DoD 对齐：实现 + 样式 + 契约 + locales + 测试。

### 4.3 主题包

```
packages/themes/
  src/
    line/
      tokens.json           # DTCG
      design-rules.json     # 权威
      meta.json             # 代号、预览色等
    cupertino/
    silver-arrow/
    ...
  src/index.ts
```

### 4.4 Registry 导出

```
packages/registry/
  registry/
    r/
      styles/
      button.json           # shadcn 兼容条目（示例名）
      themes/
        line.json
  src/
    build-registry.ts       # 从 components/themes 生成
```

---

## 5. 与 Phase 的对应（先建什么）

| 阶段 | 必须已存在的目录/包 | 说明 |
| :--- | :--- | :--- |
| **开工前 / D1** | Phase 0 瘦身树 + `install-core` 占位 + STRUCTURE | 本说明书 + 脚手架 |
| Phase 0 | `poc/*` 可跑；`tokens`/`contract` 草案；M0 选定 Headless | **不做**远期空包 |
| Phase 1 | **创建** `i18n`·`registry`·`cli`·`mcp-server`；`components`×20；themes×3；安装走 `install-core` | M1 |
| Phase 2 | **创建** `apps/docs`；registry 公网；组件 45–50；themes×8；i18n×21 | M2 |
| Phase 3 | **创建** `theme-studio`·`components-vue`（视情况） | M3 |
| Phase 4 | 主题市场相关（届时增补） | M4 |

---

## 6. 命名与路径约定

| 类别 | 约定 |
| :--- | :--- |
| 包名 | 一律 `@chameleon-ui/<short-name>` |
| 组件目录 | kebab-case 文件夹；导出 PascalCase 组件名 |
| 主题目录 | 与代号一致：`line`、`cupertino`、`silver-arrow`… |
| Locale 文件 | BCP 47：`zh-CN.json`、`en.json`… |
| 分支 | `main`；功能 `feat/*`；POC `poc/*` |
| 提交 | 约定式：`feat(components): …` / `chore(repo): …` |

---

## 7. 项目文档存放

| 文档 | 当前路径 | 目标路径（可选迁移） |
| :--- | :--- | :--- |
| 综合可行性研究报告 | 仓库根 | `docs/project/` |
| 立项项目书 | 仓库根 | `docs/project/` |
| 软件平台设计概要 | 仓库根 | `docs/project/` |
| 系统架构设计说明书 | 仓库根 | `docs/project/` |
| 详细设计与验收说明书 | 仓库根 | `docs/project/` |
| 建设期资源预算表 | 仓库根 | `docs/project/` |
| **本说明书** | 仓库根 | `docs/engineering/` |

迁移时更新各文档「配套文档」表中的路径即可，不改内容效力。

---

## 8. 脚手架验收（进 Phase 0 编码前）

- [x] 在 **`chameleon-ui/`** 下 `pnpm install` 成功  
- [x] workspace **仅有** Phase 0 包：`tokens`·`themes`·`contract`·`primitives`·`components`·`install-core`·`poc/*`·`toolings/*`  
- [x] **无**空壳：`apps/`、`benchmarks/`、`i18n`、`cli`、`mcp-server`、`registry`、`blocks`、`components-vue`  
- [x] `tokens` / `themes` / `contract` 的 package.json **未**声明 react/vue 依赖  
- [x] `install-core` 已占位且 README 写明「cli/mcp 唯一内核」  
- [x] `chameleon-ui/STRUCTURE.md` 与本说明书一致；工作区根无 monorepo  

全部勾选后，开始 Phase 0 编码：`poc/ark-ui` 与 `poc/base-ui` 的 Button/Input/Dialog。

---

## 9. 修订记录

| 版本 | 日期 | 说明 |
| :--- | :--- | :--- |
| v1.0 | 2026-08-12 | 首版：顶层树、包职责、单包结构、Phase 对应、脚手架验收 |
| v1.1 | 2026-08-13 | Phase 0 瘦身：延期远期目录、补 install-core 与权威边界；回填脚手架复验状态（文件名保留以维持既有链接） |
