# Chameleon UI · 工程塔（Phase 4）

> 本目录是 **pnpm + Turborepo monorepo 根**。  
> 上一级工作区只放项目文档；**勿在工作区根执行 `pnpm install`。**  
> LICENSE：MIT。遥测默认关（`telemetry-notice.v1`）。

## 这是什么

Chameleon UI 可运行工程。Headless **已锁定 Ark UI / Zag**。Base UI 只留在 `poc/base-ui`。

**Phase 4**：主题市场（官方 8 套免费致敬主题 + 社区主题 + `community-focus-first` 纪律包，安装只经 `install-core`；社区包可免费或付费）；MCP Apps 独立 adapter POC；文档站 3 语（zh-CN 默认 / zh-HK / en；**产品仍为 21 Locale**）+ 缺口表；VPAT **status=draft**；北极星看板；建设移交。完整目标卡见 [`docs/project/phases/Phase-4-v2.0.md`](../docs/project/phases/Phase-4-v2.0.md)。库存仍是 **50 组件 / 8 主题 / 21 Locale**。8 套官方致敬主题已由项目所有者于 2026-08-13 确认无法律问题（非律所意见书），以免费官方主题出货。禁止「一眼认出 ≥80%」、VPAT certified、编造 Lighthouse。本仓 **不执行 npm publish**。

组件清单：[`packages/components/catalog.json`](./packages/components/catalog.json)。目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。外部工程 / 编码 Agent 先读 [`AGENTS.md`](./AGENTS.md)。

## 当前 workspace 成员

```
chameleon-ui/
├── packages/            # @chameleon-ui/* （registry-private 为 private）
├── apps/
│   ├── internal-demo/   # 内测 Demo :5175 / :4175
│   ├── docs/            # 公开文档站 Docusaurus+MDX :5176 / :4176
│   ├── theme-studio/    # 主题工作台 :5177 / :4177
│   └── market/          # 主题市场 :5178 / API :8788
├── poc/                 # M0 证据（冻结）
├── toolings/
├── benchmarks/
│   ├── budgets.json     # S1/S3/S4/S5
│   └── genui-bench/     # install-core harness
├── PHASE3.md
├── PHASE4.md
└── LICENSE
```

## 分层硬规则

| 层 | 包 | 规则 |
| :--- | :--- | :--- |
| L1 | tokens · themes · i18n · contract | **禁止** react / vue / svelte |
| L1 | primitives / primitives-vue | 可 peer 对应框架；只依赖 `@ark-ui/*` / Zag |
| L2 | components / components-vue | 只依赖 L1；**禁止**直接 import `@ark-ui/*` / `@base-ui/react` |
| L3/L4 | adapter-a2ui / adapter-mcp-apps | 协议映射只在适配器包；写盘仍只走 install-core；**不进 L1** |
| 目录 | registry | 只提供条目；不写盘 |
| 安装 | install-core | cli / mcp / adapters / docs CTA **只依赖本包写盘** |

## 命令

```
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 ci:phase1
corepack pnpm@9.15.0 ci:phase2
corepack pnpm@9.15.0 ci:phase3
corepack pnpm@9.15.0 ci:phase4
corepack pnpm@9.15.0 demo          # http://127.0.0.1:5175 内测 Demo
corepack pnpm@9.15.0 docs          # http://127.0.0.1:5176 公开文档
corepack pnpm@9.15.0 studio        # http://127.0.0.1:5177 主题工作台
corepack pnpm@9.15.0 market        # http://127.0.0.1:5178 UI · :8788 API
corepack pnpm@9.15.0 bench:genui
corepack pnpm@9.15.0 publish:check
corepack pnpm@9.15.0 link:external   # 打印外部工程 npm link 全量命令（workspace:* 不能只 link 一个包）
corepack pnpm@9.15.0 ai:check        # 契约 + MCP 工具名 + AGENTS.md + 安装文档 import 防漂移
corepack pnpm@9.15.0 perf:size
```

Node `>=20.19.0`，pnpm `9.15.0`。各 `@chameleon-ui/*` 可发包的 `engines.node` 同此下限（Node 18 会编译失败）。本机若 `turbo` 找不到 `pnpm`，把 corepack shims 放进 `PATH`。

## 遥测

默认关闭。`CU_TELEMETRY=1` 才启用 hook。`chameleon telemetry-off` 发 `opt_out`。不采集源码。告知文案版本：`telemetry-notice.v1`。
