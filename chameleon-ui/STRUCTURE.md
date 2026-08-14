# 工程目录与文件注解（Phase 4 · 含第二期规划）

> 路径相对于 `chameleon-ui/`。  
> **原则：workspace 只含当前阶段包；远期包写在「第二期计划创建」，不建空目录。**  
> 第二期（Phase 5–9）总览：`../docs/project/phases/Phase-2-Overview.md`。

---

## 根文件

| 文件 | 注解 |
| :--- | :--- |
| `README.md` | 工程介绍（Phase 4：市场 / 纪律包 / MCP Apps / 文档站 3 语 / VPAT 草稿；产品仍为 21 Locale） |
| `AGENTS.md` | **AI 消费方 SSOT**（外部工程 / 编码 Agent 必须遵守的 import、link、MCP 工具名） |
| `STRUCTURE.md` | 目录与文件注解 |
| `PHASE0.md` | Phase 0 五日看板（已关闭；2026-08-13 对齐 P5+ 骨架） |
| `PHASE1.md` | Phase 1 两周看板（已关闭；2026-08-13 对齐 P5+ 骨架） |
| `PHASE2.md` | Phase 2 开源切片看板（2026-08-13 对齐 P5+ 骨架）；完整目标卡在 `docs/project/phases/` |
| `PHASE3.md` | Phase 3 看板（工程本地 M3；2026-08-13 对齐 P5+ 骨架） |
| `PHASE4.md` | Phase 4 看板（市场 + 纪律包 + MCP Apps / 21 语骨架 / VPAT 草稿 / 移交 / ci:phase4；2026-08-13 对齐 P5+ 骨架） |
| `PHASE5.md` | Phase 5 看板（三端内核：断点/密度 Token、容器查询、变形矩阵、ActionSheet/TabBar/SafeArea/Sidebar） |
| `PHASE6.md` | Phase 6 看板（组件广度：F/G/H 族 + 缺口名单 → catalog v2.0；Vue 扩面） |
| `PHASE7.md` | Phase 7 看板（`packages/blocks` + §7.3 十二场景 + §7.4 矩阵） |
| `PHASE8.md` | Phase 8 看板（AG-UI / SchemaRenderer / data-ai 全量 / generation_quality / DTCG `$extends`） |
| `PHASE9.md` | Phase 9 看板（R1–R3 实测 / VPAT 正式 / npm 首发 / 文档 21 语去骨架） |
| `package.json` | 根脚本：`build` / `ci:phase1` … `ci:phase4` / `ci:phase8` / `ci:phase9` / `docs` / `studio` / `market` / `bench:genui` / `publish:check` / `link:external` / `perf:lhci` |
| `LICENSE` | MIT（可发包另有副本） |
| `CONTRIBUTING.md` / `SECURITY.md` | 贡献与安全；遥测告知 |
| `pnpm-workspace.yaml` | 成员：`packages/*` · `toolings/*` · `poc/*` · `apps/*` · `benchmarks/genui-bench` |
| `turbo.json` | 任务编排 |
| `tsconfig.base.json` | 共享 TS 基配置 |
| `.npmrc` / `.gitignore` | pnpm 与忽略规则 |
| `benchmarks/budgets.json` | S1/S3/S4 硬门禁 + S5 抽检数字（来自工程约定 §11.1，禁止自造） |
| `benchmarks/scripts/check-size.mjs` | `perf:size` 实现；测量 S1/S3/S4/S5；POC 整站 gzip **不是** S1 |
| `benchmarks/genui-bench` | Phase 2 GenUI-Bench harness（真实 install-core） |
| `scripts/phase3-gates.mjs` | `phase3:gates`：validate-rules · Vue · adapter-a2ui · studio · registry-private · MVP20 data-ai · Vue S1 |
| `scripts/phase4-gates.mjs` | `phase4:gates`：21 语骨架 · adapter-mcp-apps · market-service · rules packs · VPAT draft · 缺口表 · 看板/移交/审计/L1 边界 |
| `scripts/phase5-gates.mjs` | `phase5:gates`：三端内核门禁 |
| `scripts/phase8-gates.mjs` | `phase8:gates`：A1–A6 AI 阶梯门禁 |
| `scripts/ai-check.mjs` | `ai:check`：契约 + MCP 工具名 + AGENTS.md + 安装文档 import 示例防漂移 |
| `scripts/phase9-gates.mjs` | `phase9:gates`：lhci 生成物（实测或显式未测）· VPAT 文件存在 · 缺口表存在 · `publish:check` 干跑（不 npm publish） |
| `scripts/perf-lhci.mjs` | `perf:lhci`：本地 Lighthouse 测 demo `:4175/?view=suite`；失败则写 unmeasured 生成物，禁止手写分数 |
| `scripts/check-publish-ready.mjs` | `publish:check` 干跑：可发包 MIT/`engines.node`/`exports` CSS 别名；不 npm publish |
| `scripts/link-external.mjs` | 外部 npm 工程须全量 `npm link`（`workspace:*` 不能只 link `components`） |
| `../.github/workflows/phase0-ci.yml` | PR/推送门禁：冻结安装后执行 `ci:phase4`（含 `ci:phase3`） |
| `../docs/project/phases/Phase-4-v2.0.md` | Phase 4 目标卡 |
| `../docs/project/phases/Phase-2-Overview.md` | 第二期（Phase 5–9）总览与缺口追溯；Phase-5…9 目标卡索引 |
| `../docs/project/phases/AI能力体系-A1-A6-收口轨道.md` | **AI 能力体系专项轨道（一等交付物）**：A1–A6 六层 + B1–B4 四大突破点的收口 DoD 唯一权威；含 A1 schema v0.2 键位决议、A4 补 AG-UI/SchemaRenderer、A5 data-ai 全量化、A6 `generation_quality` 实测化 |
| `../docs/project/reports/M4-v2.0建设收口.md` | M4 living 报告 |
| `../docs/project/handover/建设期移交说明书.md` | 建设期移交；运营接收人=待指定 |
| `../docs/engineering/RTL与图标镜像工程规范.md` | 逻辑属性、图标矩阵、bidi |

---

## 当前 `packages/`

| 路径 | npm 名 | 注解 |
| :--- | :--- | :--- |
| `tokens` | `@chameleon-ui/tokens` | DTCG 权威源与确定性 CSS 编译；无框架依赖 |
| `themes` | `@chameleon-ui/themes` | overlay + design-rules 权威（Phase 3 v1.0 完整字段）；`validate-rules` CLI |
| `contract` | `@chameleon-ui/contract` | **schema + 生成/校验工具**；`component-contract` + `design-rules` schema |
| `i18n` | `@chameleon-ui/i18n` | ICU MessageFormat、C3 Map 查找、en-XA ≥140% 字面膨胀；无框架 |
| `primitives` | `@chameleon-ui/primitives` | **仅** Ark UI / Zag 薄封装；禁止 `@base-ui/react` |
| `primitives-vue` | `@chameleon-ui/primitives-vue` | Vue Ark/Zag 薄封装；`components-vue` 禁止直接依赖 `@ark-ui/*` |
| `components` | `@chameleon-ui/components` | React 主包；权威契约在 `src/<kebab>/contract.json`；冻结清单 `catalog.json` |
| `components-vue` | `@chameleon-ui/components-vue` | Phase 3 Vue 子集（Button + Input）；包装 `primitives-vue` 与 `tokens` |
| `install-core` | `@chameleon-ui/install-core` | **唯一写盘内核**：C6 依赖图 / 冲突检测 / 幂等写入；遥测默认关；`source` = `cli` \| `mcp` \| `docs` \| `market` |
| `registry` | `@chameleon-ui/registry` | 目录；CLI/MCP/Bench 只读；不写盘。无 `CU_REGISTRY_URL` 时用 bundled；有 URL 则 HTTP 客户端 |
| `registry-private` | `@chameleon-ui/registry-private` | 私有 Registry **服务**（`private: true`）：同 `RegistryItem` schema；Bearer Token；namespace + semver。默认 `127.0.0.1`。不写盘 |
| `adapter-a2ui` | `@chameleon-ui/adapter-a2ui` | A2UI 协议适配；映射 → slug → install-core；协议逻辑只在 L3/L4 |
| `adapter-mcp-apps` | `@chameleon-ui/adapter-mcp-apps` | MCP Apps（SEP-1865）适配 **POC**；`ui://` + HTML 模板 → slug → install-core；**不进 L1**；非宿主认证 |
| `cli` | `@chameleon-ui/cli` | 薄壳 `chameleon`；只调 `install-core`；可选 `CU_REGISTRY_URL` / `CU_REGISTRY_TOKEN` |
| `mcp-server` | `@chameleon-ui/mcp-server` | 薄壳 MCP；工具名 snake_case；只调 `install-core`；同一套 `CU_REGISTRY_*`；只读工具 `get_contract` / `get_design_rules` / `get_import_specifiers` |
| `market-service` | `@chameleon-ui/market-service` | Phase 4 市场服务：官方 8 套免费致敬主题 + 社区主题 + `registry:rules` 纪律包（种子 `community-focus-first`）；检测流水线；官方致敬 id 不得作为付费 SKU（市场可有社区付费条目）；只调 `install-core`；不写盘 |

### 权威边界（易踩坑）

| 数据 | 权威位置 | 非权威 |
| :--- | :--- | :--- |
| 组件 + S5 常用 10 | `packages/components/catalog.json` | 阶段卡只引用，不另维护第二份名单 |
| 组件契约字段 | `components/src/<slug>/contract.json` | 禁止在 `contract` 包手写第二份正文 |
| design-rules | `themes/<name>/design-rules.json` | L3/索引只校验不复制 |
| 组件文案 | 组件 `locales/` | 共享 ICU/查找进 `i18n` |
| 安装写入 | **仅** `install-core` | cli / mcp / adapters / docs CTA 不得各写一套 |
| 性能预算数字 | `benchmarks/budgets.json` ← 工程约定 §11.1 | 禁止用 POC gzip 冒充 S1 |
| Bench 数字 | `pnpm bench:genui` 生成的 JSON | 禁止手写分数 |

### 依赖方向

```
tokens / themes / i18n / contract / primitives
        ↑
   components
        ↑
   registry          ← 目录（从 components/themes 源同步）+ 可选 HTTP 客户端
   registry-private  ← 本机/内网 HTTP 服务（依赖 registry 种子；Token 鉴权；不写盘）
        ↑
 install-core        ←—— 唯一写盘；被 cli / mcp-server / adapters / genui-bench 依赖
        ↑
   cli / mcp-server / adapters / apps/docs / market-service（CTA 只复制 CLI 命令；市场安装只调 `install-core`）

tokens / themes / i18n / contract / primitives-vue
        ↑
   components-vue
        ↑
   adapter-a2ui demo（Vue 表单样例；安装计划仍交 install-core）
```

---

## `apps/`

| 路径 | npm 名 | 注解 |
| :--- | :--- | :--- |
| `apps/internal-demo` | `@chameleon-ui/internal-demo` | T1.10 内测 Demo。**不是**公开文档站。选择器：21 Locale + 8 主题。三端一体：`/?view=three-end`（390/768/1280 iframe）。盲测：`/?view=blind`（协议在 `docs/project/reports/盲测协议.md`；结果 pending，禁止手写认出率） |
| `apps/docs` | `@chameleon-ui/docs` | 公开文档站（Docusaurus 3 + MDX）：**3 语界面**（`zh-CN` 默认无前缀 / `zh-HK` / `en`）；产品 ICU 仍为 21 Locale；8 主题、contract 驱动 API 表、北极星看板、VPAT 草稿。端口 5176 / 4176 |
| `apps/theme-studio` | `@chameleon-ui/theme-studio` | Phase 3 主题工作台 Beta：`/editor` · `/export`；端口 5177 / 4177；导出物 `generator=theme-studio` |
| `apps/market` | `@chameleon-ui/market` | Phase 4 市场 UI：浏览/详情/安装/上架（主题与纪律包）；端口 5178 / 4178；安装经 `market-service` → `install-core` |

---

## `poc/`（Phase 0 证据，冻结）

| 路径 | npm 名 | 注解 |
| :--- | :--- | :--- |
| `poc/ark-ui` | `@chameleon-ui/poc-ark-ui` | 正式迁入源。Button / Input / Dialog |
| `poc/base-ui` | `@chameleon-ui/poc-base-ui` | **仅** M0 对比证据；正式包禁止依赖 |
| `poc/e2e` | `@chameleon-ui/poc-e2e` | Playwright 真浏览器全矩阵 |

---

## `toolings/`

| 路径 | 注解 |
| :--- | :--- |
| `eslint-config` | 共享 ESLint |
| `stylelint-config` | 共享 Stylelint（物理方向 CSS 拒绝） |
| `tsconfig` | TS 片段；与根 `tsconfig.base.json` 配合 |
| `visual-regression` | Playwright ar/RTL 390/768/1280 + CI artifacts。**官方目标**是 `apps/internal-demo` 的 AppShell+common-10（:4175）；POC Ark（:4173）仅对照 |

---

## `benchmarks/`

| 路径 | 注解 |
| :--- | :--- |
| `budgets.json` + `scripts/check-size.mjs` | Phase 1 体积门禁（React 主包 S1） |
| `genui-bench` | Phase 2 评测包；调用 install-core；报告写入 `reports/`（生成物，不手写） |

---

## 第二期计划创建（Phase 到了再 `mkdir`；禁止空包冒充）

> 以下包已排入 Phase 5–9 目标卡（`../docs/project/phases/`），未开工前不建目录。

| 路径 | npm 名 | 阶段 | 备注 |
| :--- | :--- | :--- | :--- |
| `packages/blocks` | `@chameleon-ui/blocks` | Phase 7 | 场景组合（愿景 §7.3 十二 Block）；`registry:block`；安装仅经 install-core |
| `packages/schema-renderer` | `@chameleon-ui/schema-renderer` | Phase 8 | 运行时 JSON→组件树（A4 / 低代码集成层）；协议分支只在 L3/L4；DoD 另见 `../docs/project/phases/AI能力体系-A1-A6-收口轨道.md` |
| `packages/adapter-ag-ui` | `@chameleon-ui/adapter-ag-ui` | Phase 8 | AG-UI 决策树先行（适配 POC 或观察报告）；DoD 见 `../docs/project/phases/AI能力体系-A1-A6-收口轨道.md`；未达 DoD 前禁止空包冒充 |

---

## Phase 对照

| 阶段 | workspace 重点 |
| :--- | :--- |
| Phase 0 | `poc/*` 可跑；`tokens` / `contract` 草案；选定 Headless |
| Phase 1 | 建 `i18n` / `registry` / `cli` / `mcp-server` / `apps/internal-demo`；填 `primitives` 与 20 组件；官方 VR；`catalog.json`；`perf:size` |
| Phase 2 | `apps/docs`；`benchmarks/genui-bench`；MIT/publish 脚手架；50 组件 / 8 主题 / 21 Locale |
| Phase 3 | `design-rules` v1.0；`theme-studio`；`registry-private`；Vue 子集；`adapter-a2ui`；`ci:phase3` |
| **Phase 4（今）** | `adapter-mcp-apps` POC；docs 21 语骨架 + VPAT draft + 北极星看板 + 移交 + `ci:phase4`；纪律包 `registry:rules`（`community-focus-first` 经市场列出/安装）；主题市场 `apps/market` + `market-service` |
| Phase 5（规划） | 断点/密度/排版 Token；容器查询基础设施；变形矩阵；`action-sheet` / `tab-bar` / `safe-area` / `sidebar` |
| Phase 6（规划） | F/G/H 族 + 缺口名单（catalog v2.0，约 101 slug 冻结会定准）；Vue 子集 ≥20 |
| Phase 7（规划） | `packages/blocks`；§7.3 十二场景；§7.4 矩阵 17/17 |
| Phase 8（规划） | `adapter-ag-ui`（或观察报告）；`schema-renderer`；data-ai 全量；`bench.generation_quality`；DTCG `$extends` |
| Phase 9（规划） | R1–R3 实测；VPAT published；npm 首发；文档 21 语去骨架 |

### 纪律包清单（`registry:rules`）

| id | 源路径 | 安装写盘路径 | 付费 |
| :--- | :--- | :--- | :--- |
| `community-focus-first` | `packages/themes/src/community-focus-first/` | `rules/community-focus-first/{design-rules,meta,tokens}.json` | 否（`meta.pricing.paid=false`） |

致敬/官方 8 主题 id 作为 **免费** 上架（`install-core` 策略校验 + `market-service` 申请/安装：付费 SKU 拒绝致敬 id）。市场允许社区付费条目。市场种子经 `seedMarketCatalog()` 列出 8 套官方免费主题 + `community-focus-first`。


