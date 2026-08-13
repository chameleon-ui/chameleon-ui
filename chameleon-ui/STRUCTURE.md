# 工程目录与文件注解（Phase 0）

> 路径相对于 `chameleon-ui/`。  
> **原则：workspace 只含当前阶段包；远期包写在「延期创建」，不建空目录。**

---

## 根文件

| 文件 | 注解 |
| :--- | :--- |
| `README.md` | 工程介绍（Phase 0） |
| `STRUCTURE.md` | 目录与文件注解 |
| `PHASE0.md` | 五日看板速查；完整目标卡在 `docs/project/phases/` |
| `package.json` | 根脚本：`build` / `poc:ark` / `poc:base` … |
| `pnpm-workspace.yaml` | 成员：`packages/*` · `toolings/*` · `poc/*`（**无** apps / benchmarks） |
| `turbo.json` | 任务编排 |
| `tsconfig.base.json` | 共享 TS 基配置 |
| `.npmrc` / `.gitignore` | pnpm 与忽略规则 |
| `../.github/workflows/phase0-ci.yml` | Git 仓库根的 Phase 0 PR/推送门禁：冻结安装后执行 `ci:phase0` |
| `../docs/project/reports/M0-基元POC与地基验收.md` | M0 选型、A0 全检证据、技术退出记录 |
| `../docs/project/reports/Phase-1-开工检查.md` | M0 关闭后进入 Phase 1 的一页复现清单 |
| `../docs/engineering/RTL与图标镜像工程规范.md` | M0 RTL 纪律：逻辑属性、图标矩阵、bidi 与分阶段 CI 范围 |

---

## 当前 `packages/`（Phase 0）

| 路径 | npm 名 | 注解 |
| :--- | :--- | :--- |
| `tokens` | `@chameleon-ui/tokens` | DTCG 权威源与确定性 CSS 编译；无框架依赖 |
| `themes` | `@chameleon-ui/themes` | 主题 Token + **design-rules 权威**；可极薄 |
| `contract` | `@chameleon-ui/contract` | **schema + 生成/校验工具**；不在此维护组件契约正文副本 |
| `primitives` | `@chameleon-ui/primitives` | Headless 封装；**M0 选定后再填** |
| `components` | `@chameleon-ui/components` | React 主包落点；Phase 0 可空壳 |
| `install-core` | `@chameleon-ui/install-core` | **CLI/MCP 共享安装内核占位**；禁止日后在 cli/mcp 内分叉逻辑 |

### 权威边界（易踩坑）

| 数据 | 权威位置 | 非权威 |
| :--- | :--- | :--- |
| 组件契约字段 | 各组件源目录（日后 `components/.../contract`） | 禁止在 `contract` 包手写第二份正文 |
| design-rules | `themes/<name>/design-rules.json` | L3/索引只校验不复制 |
| 组件文案 | 组件 `locales/`（日后） | 共享词表/ICU 进未来的 `i18n` 包 |
| 安装写入 | **仅** `install-core` | cli / mcp 不得各写一套 |

### 依赖方向

```
tokens / themes / contract
        ↑
   primitives   ←—— M0 后由 poc 结论填入
        ↑
   components
        ↑
 install-core   ←—— Phase 1+ 被 cli / mcp-server 依赖
        ↑
   （延期）registry / cli / mcp / apps
```

---

## `poc/`（Phase 0 主战场）

| 路径 | npm 名 | 注解 |
| :--- | :--- | :--- |
| `poc/ark-ui` | `@chameleon-ui/poc-ark-ui` | Ark：Button / Input / Dialog |
| `poc/base-ui` | `@chameleon-ui/poc-base-ui` | Base：同上；对比后写 M0 |
| `poc/e2e` | `@chameleon-ui/poc-e2e` | Playwright 真浏览器全矩阵；替代人工抽检 |

不发布。结论进 `primitives`，沙箱可归档。

---

## `toolings/`

| 路径 | 注解 |
| :--- | :--- |
| `eslint-config` | 共享 ESLint |
| `stylelint-config` | 共享 Stylelint |
| `tsconfig` | TS 片段；与根 `tsconfig.base.json` 配合（包内 extends 根 base） |
| `visual-regression` | 视觉回归配置占位 |

---

## 延期创建（Phase 到了再 `mkdir` 并进 workspace）

| 路径 | 建议阶段 | 备注 |
| :--- | :--- | :--- |
| `packages/i18n` | Phase 1 | 共享 Locale / ICU；与组件 locales 分工见上表 |
| `packages/registry` | Phase 1–2 | Registry 导出 |
| `packages/cli` | Phase 1 | 薄壳 → 依赖 `install-core` |
| `packages/mcp-server` | Phase 1 | 薄壳 → 依赖 `install-core` |
| `packages/blocks` | Phase 1+ | 场景组合 |
| `packages/components-vue` | Phase 3 | Vue 适配 |
| `apps/docs` | Phase 2 | 文档站 |
| `apps/theme-studio` | Phase 3 | 主题工作台 |
| `benchmarks/genui-bench` | Phase 2+ | 评测 |

创建时：补 `package.json` + README，确认已在 `pnpm-workspace` 的 glob 下（或显式加入），并更新本文件「当前 packages」表。

---

## Phase 对照

| 阶段 | workspace 重点 |
| :--- | :--- |
| **Phase 0（今）** | `poc/*` 可跑；`tokens` / `contract` 草案；`install-core` 占位；选定 Headless |
| Phase 1 | 建 `i18n` · `registry` · `cli` · `mcp-server`；填 `components`×20、`themes`×3 |
| Phase 2 | 建 `apps/docs`；扩组件 / 主题 / 语言 |
| Phase 3 | 建 `theme-studio` · `components-vue`（视情况） |
| Phase 4 | 主题市场相关（届时增补） |
