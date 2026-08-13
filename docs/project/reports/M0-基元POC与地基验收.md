# M0 · 基元 POC 与地基验收

> 报告日期：2026-08-13  
> 适用分支：`feat/phase0-poc`  
> 验收依据：[`../phases/Phase-0-地基.md`](../phases/Phase-0-地基.md) 与 [`../../engineering/工程约定与命名规范.md`](../../engineering/工程约定与命名规范.md)  
> 结论：**技术 M0 通过。正式 Headless 底座选定 Ark UI。A0.1–A0.6 均以本地全检为证据。本仓库是研发本地仓，预算批复、项目所有者签字和 GitHub Actions 不作为技术退出条件。Phase 1 可以开工。**

## 1. 摘要

Ark UI 与 Base UI 两条隔离 POC 均完成 Button、Input、Dialog、键盘路径、真实 ICU MessageFormat plural/select、自动至少 40% 的 `en-XA` 字面膨胀、LTR / RTL 与 390 / 768 / 1280 三端演示。综合跨框架路线、正式包单底座纪律和本次整包构建数据，O1 选定 Ark UI；Base UI 只保留为 M0 对比证据，不进入 `packages/primitives` 或 `packages/components`。

## 2. 前置与范围回顾

| 项 | 结果 | 证据 |
| :--- | :--- | :--- |
| 工程位置与工具链 | 通过 | `chameleon-ui/` 为 pnpm workspace；Node 要求 `>=20.19.0`；`packageManager=pnpm@9.15.0`；冻结锁文件安装通过 |
| 分支 | 通过 | `feat/phase0-poc` 从 `main` 建立 |
| POC 隔离 | 通过 | 双轨只在 `poc/ark-ui`、`poc/base-ui`；正式组件包仍为空壳 |
| L1 无框架 | 通过 | tokens / themes / contract / primitives manifest 未声明 React、Vue 或 Svelte |
| 范围冻结 | 通过 | 未实现 Registry、CLI、MCP、20 组件、八主题、21 Locale、文档站、生产遥测或正式性能红线 |
| 三件套 | 通过 | POC 使用 `cu-*` 与 `@phase-1` 迁移标记；components/primitives 为 `status: pending-M0`；install-core 仅 `TelemetryHook` 类型预留；无运行时遥测 |
| RTL 工程规范 | 通过 | `docs/engineering/RTL与图标镜像工程规范.md` 已覆盖逻辑属性、图标镜像矩阵、bidi 与 Phase 0–4 CI 范围 |
| 资源预算治理 | **研发不管** | 金额与批复不纳入本仓库技术门禁；研发只对 A0 与代码证据负责 |

`packages/themes`、`packages/components`、`packages/primitives` 与部分 tooling 的 echo 脚本是阶段卡允许的极薄/空壳，不等同于正式能力。Phase 0 不填实这些远期实现。

## 3. 双轨 POC 对比

计时以本次自动化辅助实现记录计，按阶段卡要求向上取 0.5h；它是 POC 对比记录，不是未来人工排期估算。

| 维度 | Ark UI | Base UI |
| :--- | :--- | :--- |
| 完成度 | Button / Input / Dialog 全部完成 | Button / Input / Dialog 全部完成 |
| 实施计时 | 0.5h | 0.5h |
| 核心 API | Button `variant`/`size`；Input 受控/disabled/invalid/label；Dialog 受控与非受控入口 | 同构核心 API |
| 键盘 a11y | Button Tab + Enter + Space；Dialog Enter 打开、Tab/Shift+Tab 留在模态内、Esc 关闭、焦点归还，自动测试通过 | 同一套路径自动测试通过 |
| 焦点/键序算法来源 | Ark UI / Zag.js 内置；未自研 | Base UI 内置；未自研 |
| 复杂度风险 | 低；业务代码未做每键全 DOM 扫描，C4 交给已选基元实现 | 低；同左 |
| U5 键程预感 | 主路径 Tab→Enter→Esc，共 3 次有意义键击，低于 Phase 1 默认 ≤8 | 同左 |
| RTL 成本 | 低；`dir` 切换 + 逻辑属性 | 低；同左 |
| Vue 成本 | 低；Ark 官方提供 Vue 适配，可复用同一 Zag 行为模型 | 高；本次依赖为 React 库，既定 Vue 路线需另做适配/行为对齐 |
| 直接运行依赖 | 6 个：headless、tokens、React、React DOM、Intl MessageFormat、ICU parser | 6 个：同口径 |
| 构建处理模块 | 1489 | 211 |
| POC 产物 gzip | Vite 分项：HTML 0.31 + CSS 2.03 + JS 95.64 kB | Vite 分项：HTML 0.32 + CSS 2.16 + JS 96.09 kB |
| 性能体感 | 本地交互无可见卡顿；页面无 Vite 错误覆盖层 | 同左 |

体积直接记录 Vite 8.2.1 构建日志的 gzip 分项（其 kB 显示为四舍五入观察值），包含 React 与整个演示站；它**不是** S1 单组件测量值，也不是 Phase 0 红线。Ark 的模块处理数较大，是 Phase 1 tree-shaking 与组件级 `perf:size` 需要继续关注的风险；不能用本表证明正式组件体积达标。

A0.4 不再抽检。Vitest 对两线覆盖 `en`/`en-XA` × `ltr`/`rtl` 的 Button / Input / Dialog / 三端 / 无 `data-ai-*` 全矩阵；`@chameleon-ui/poc-e2e` 用 Chromium 对同一矩阵再跑一遍真浏览器，包括每一档宽度、Dialog 键盘开关、焦点归还，以及 Portal 弹层的计算方向。

## 4. 代码落点与迁移计划

| 当前落点 | M0 作用 | Phase 1 动作 |
| :--- | :--- | :--- |
| `poc/ark-ui/src/components/*` | 选中路线证据 | 按正式 contract 迁入 `packages/components/src/<component>/`，通过 primitives 统一封装 Ark/Zag |
| `poc/base-ui/src/components/*` | 未选路线对照 | 只归档证据；禁止复制到正式包 |
| `packages/tokens/src/core/*.json` | DTCG 权威源 | 建主题 overlay，但不得复制 core 单源 |
| `packages/contract/schemas/component-contract.schema.json` | v0.1 schema 种子 | 正文只放组件目录；contract 包继续做校验/codegen |
| `packages/install-core` | 类型级遥测挂点 | Phase 1 才实现安装规划、冲突检测、幂等写入和可关闭遥测 |

## 5. O1–O4 裁定

| ID | 裁定 | 状态与边界 |
| :--- | :--- | :--- |
| O1 | 采用 Ark UI | 已裁定；Base UI 仅留 POC，正式包禁止混用，禁止自研焦点陷阱替代 |
| O2 | Style Dictionary 4.x + 仓内确定性薄层 | 已裁定；DTCG 源、稳定排序、引用解析与可读失败由 tokens 包约束 |
| O3 | pnpm 9.15.0 + Turborepo | 已裁定；版本固定，workspace 与任务图保留 |
| O4 | Phase 1 先采用本地/CI Playwright baseline + artifact | 已裁定；Phase 0 不接云；云托管在 **2026-08-28（M1 计划验收日）前**复审并记录是否启用 |

结论已同步回写《系统架构设计说明书》开放决策表、《软件平台设计概要》开放问题与设计裁定记录，以及 `packages/primitives/README.md` / `packages/tokens/README.md`。

## 6. A0 验收证据

| 门禁 | 结论 | 可复现证据 |
| :--- | :--- | :--- |
| A0.1 书面选型 | 通过 | 本报告 §3/§5；primitives README 明确 Ark 唯一路线与禁止混用 |
| A0.2 Token | 通过 | 将 `color.palette.brand` 从 `#2563eb` 改为 `#7c3aed` 后，构建把 CSS 从 `--cu-color-palette-brand: #2563eb` 改为 `#7c3aed`；CSS SHA-256 从 `4E7281…3722` 变为 `768DA5…60E`。还原源码后 source/CSS hash 均逐字节恢复；构建输出 12 个变量 |
| A0.3 方向纪律 | 通过 | bad fixture exit 1、good fixture exit 0；POC 业务 CSS 走同一规则。本仓为本地 git，不以 GitHub Actions 为退出条件；workflow 已就位，有 remote 后自动复跑 |
| A0.4 i18n/RTL/三端 | 通过（全检） | ICU 单测 + App 全矩阵（`en`/`en-XA` × `ltr`/`rtl` × Button/Input/Dialog/三端）+ Playwright Chromium 真浏览器全矩阵，含每一档宽度、Esc/焦点归还、Portal 计算方向、无 `data-ai-*` |
| A0.5 schema | 通过 | Draft 2020-12 schema 存在；Ajv strict 元校验、有效 sample 校验与缺 `slug` 的无效 sample 拒绝全部通过，错误格式含路径/原因/下一步 |
| A0.6 性能文档 | 通过 | 本报告 §7 完整引用 S1–S5、R1–R3，并明确 Phase 1 起控 |

CI 由仓库根 `.github/workflows/phase0-ci.yml` 定义。技术退出以本地 `pnpm ci:phase0` 全检为准（含 `@chameleon-ui/poc-e2e`）。2026-08-13 强制全检（`--force`，0 cache）通过：lint 17/17、test 17/17（其中 Playwright 真浏览器矩阵 8/8）、build 13/13；两线 Vitest 各 13 项。有 remote 后同一命令会在 Actions 复跑，不是本阶段阻断项。

## 7. 性能预算与 Phase 1 起控

| ID | 预算 | M0 状态 | 起控 |
| :--- | :--- | :--- | :--- |
| S1 | 单基础组件（含样式）≤8KB gzip，不含 react 等 peer | 仅引用，不设红线 | Phase 1 合入起 CI 硬门禁 |
| S2 | DataGrid 类 ≤60KB gzip | 本阶段无 | 引入该类组件起 |
| S3 | 单主题包 ≤20KB gzip | 仅引用 | Phase 1 主题合入起 CI 硬门禁 |
| S4 | 单 Locale 包 ≤6KB gzip | 仅引用 | Phase 1 起 CI 硬门禁 |
| S5 | AppShell + 常用 10 组件 ≤100KB gzip | 仅引用 | Phase 1 抽检；M1 前冻结常用 10 清单 |
| R1 | LCP ≤2.5s，中端安卓 / Fast 4G | 未跑正式 LHCI | Phase 1 抽检，Phase 2+ 发版门禁 |
| R2 | INP ≤200ms（P75），同基线 | 未跑正式采样 | 同上 |
| R3 | CLS ≤0.1，同基线 | 未跑正式采样 | 同上 |

Phase 0 只提供根挂点 `perf:size`、`perf:lhci`，两者会明确输出“Phase 1 起控”，不会制造假红灯或假测量。Phase 1 创建 `benchmarks/budgets.json`，将 S1/S3/S4 接入 CI 硬门禁，并按 S5/R1–R3 抽检。

## 8. 算法与可用性结论

| 要求 | 证据与结论 |
| :--- | :--- |
| C1/C2 Token | 文件/键稳定排序，完整编译 O(n log n)、空间 O(n)；memo 引用摊还 O(d)、d≤32；同输入字节一致；环引用链与未知引用可读失败 |
| C3 i18n | 字典键查找期望 O(1)；Intl MessageFormat 首次解析 O(m)，缓存后按值格式化 O(v)，支持 ICU plural/select/interpolation |
| C4 Dialog | 焦点算法来自 Ark/Zag 或 Base，不在业务层自研；Tab/Shift+Tab、Esc 与焦点归还有测试 |
| C9 schema | Ajv 校验按文档节点与适用规则 O(n·r)，错误定位到实例路径 |
| C10 伪本地化 | 只遍历 ICU AST 字面节点，O(n+c)、空间 O(n)；参数、selector 与分支键不变；CI 逐消息/逐分支验证可见长度 ≥140% 且输出确定 |
| C12 | Token 编译只在构建期执行，浏览器不跑全量编译 |
| U2/U3/U5 | 键盘主路径 3 次有意义键击；无逃逸焦点；Esc 可出；关闭归还触发器 |
| U6 | CSS 使用逻辑属性，`dir` 切换与 RTL 演示通过；无运行时整树镜像 |
| U9 | Token、lint、schema 失败均给出路径、原因与下一步；环引用不会死循环 |

这是 P0 演示级证据，不冒充 WCAG 2.1 AA 全量审计；U1/U4/U7/U8 等正式门禁按 Phase 1 目标卡执行。

## 9. 命名与命令速查

在 `chameleon-ui/` 执行：

```bash
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 ci:phase0
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens build
corepack pnpm@9.15.0 --filter @chameleon-ui/stylelint-config test
corepack pnpm@9.15.0 --filter @chameleon-ui/contract test
corepack pnpm@9.15.0 poc:ark   # http://127.0.0.1:4173
corepack pnpm@9.15.0 poc:base  # http://127.0.0.1:4174
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-e2e test
```

包名统一 `@chameleon-ui/*`；组件目录 kebab-case、实现 PascalCase；CSS 使用 `cu-*` / `--cu-*`；伪本地化固定 `en-XA`。

## 10. 风险与 Go / No-Go

| 风险 | 处理 | 是否阻断 M0 |
| :--- | :--- | :--- |
| Ark 构建处理模块多 | Phase 1 做组件级 tree-shaking 与 S1 测量 | 否；P0 无体积红线 |
| 当前只有 POC 级 a11y | Phase 1 对正式组件执行 U1–U9 与关键路径人工抽检 | 否；与 P0 范围一致 |
| POC 已是真实 ICU 骨架，但不是正式共享 i18n 产品层 | Phase 1 迁入共享包，接 i18next/vue-i18n、完整 CLDR、4 Locale 与真实 `ar`；不得退回对象替换 | 否；P0 plural/select/40% 门禁已兑现，未冒充 P1 能力 |
| 本地仓没有 GitHub remote | 保留 workflow；有 remote 后自动跑。A0.3 以本地 fixture + `ci:phase0` 为证据 | 否 |
| O4 云托管未启用 | 2026-08-28 前按书面期限复审 | 否；O4 已明确本地/CI 方案与期限 |
| 空壳包无产物 | `status: pending-M0` 明示，Phase 1 按开工卡填实 | 否；避免 Phase 0 scope 膨胀 |
| 资源预算金额未填 | 研发不管；不纳入技术门禁 | 否 |
| 项目所有者未签 | 研发不管；技术复核见 §11 | 否 |

**技术 M0 Go。** 按 [`Phase-1-开工检查.md`](./Phase-1-开工检查.md) 进入 Phase 1。不得把 POC 代码直接冒充正式组件。

## 11. 签字栏

| 角色 | 签署 | 日期 | 说明 |
| :--- | :--- | :--- | :--- |
| 工程实现与本地技术复核 | 通过 | 2026-08-13 | 本地全检：`ci:phase0`（含 Playwright 真浏览器矩阵）、A0.1–A0.6 证据齐。自动化不代替业务验收，但研发开工以此栏为准 |
| 架构决策记录 | O1–O4 已回写权威设计文档 | 2026-08-12 | 决策状态已落档 |
| 项目所有者 / 预算 | 不纳入本仓 | — | 研发本地仓不阻塞；业务侧若另有流程，与 Phase 1 技术编码解耦 |

## 12. 参考

- Ark UI About：<https://ark-ui.com/docs/overview/about>
- Base UI About：<https://base-ui.com/react/overview/about>
- Style Dictionary DTCG：<https://styledictionary.com/info/dtcg/>
- FormatJS ICU Message syntax：<https://formatjs.github.io/docs/core-concepts/icu-syntax/>
- Playwright Visual Comparisons：<https://playwright.dev/docs/test-snapshots>
- RTL 与图标镜像工程规范：[`../../engineering/RTL与图标镜像工程规范.md`](../../engineering/RTL与图标镜像工程规范.md)
