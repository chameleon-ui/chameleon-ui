# M1 · MVP 验收

> 报告日期：2026-08-13  
> 适用分支：`feat/phase0-poc`  
> 验收依据：[`../phases/Phase-1-MVP.md`](../phases/Phase-1-MVP.md)、[`Chameleon UI — 详细设计与验收说明书 v1.0.md`](../../../Chameleon%20UI%20—%20详细设计与验收说明书%20v1.0.md) §3.6、[`../../engineering/工程约定与命名规范.md`](../../engineering/工程约定与命名规范.md)  
> 内测 Demo：`chameleon-ui/apps/internal-demo` · `corepack pnpm@9.15.0 demo` → http://127.0.0.1:5175 ；preview http://127.0.0.1:4175  
> 结论：**工程侧 A1.1–A1.7 有本地证据，可以视为技术通过。不是无条件 M1 Go。** 云视觉回归未裁定、R1–R3 无 Lighthouse 分数、业务/预算签字不在本仓。8 套官方致敬主题已由项目所有者于 2026-08-13 确认无法律问题（非律所意见书），以免费官方主题出货。不得据此做公开 npm / 公网托管发布。

## 1. 摘要

Phase 1 冻结范围已落地：20 个正式组件（Ark 单底座，经 `@chameleon-ui/primitives`）、3 个致敬主题、zh-CN/en/de/ar（`ar` 由语言推导 `dir=rtl`）、registry 20+3、install-core 单核、CLI/MCP 薄壳、默认可关回流、S1/S3/S4 CI 硬门禁 + S5 抽检、内测 Demo、官方 Playwright 基线。

本次关闭的工程缺口：T1.10 内测 Demo、官方 VR 改指向该 Demo 的 AppShell+common-10、T1.12 主题走查（后由项目所有者于同日确认 8 套无法律问题）、本报告。`ci:phase1` 于 2026-08-13 在本机 Windows 通过（含 6 条 Playwright：3 官方 + 3 POC 对照）。

## 2. 范围回顾

| 项 | 结果 |
| :--- | :--- |
| 做 | 20 组件 / 3 主题 / 4 Locale / registry+CLI+MCP / 回流 / 内测 Demo / 官方 ar RTL 抽检 / M1 报告 / 主题走查 |
| 不做 | 45–50 组件、8 主题、21 语、`apps/docs`、Bench 公开发布、A2UI、工作台 |
| Headless | **未回退**：正式包仅 Ark；Base 只留 `poc/base-ui` |
| 测量口径 | `benchmarks/budgets.json`；peer（react 等）与 `@ark-ui/*` / `@zag-js/*` 外置；工具为自研 `perf:size`（esbuild + gzip） |

## 3. 20 组件矩阵

权威名单：[`chameleon-ui/packages/components/catalog.json`](../../../chameleon-ui/packages/components/catalog.json)。S5 常用 10 = button, icon, typography, input, select, checkbox, dialog, tabs, stack, spinner（不含 AppShell；测 S5 时与 AppShell 合计）。

| n | slug | 实现 | 契约 | 四语 | 内测 Demo | 官方 VR |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | button | complete | `src/button/contract.json` | zh-CN/en/de/ar | 是 | 抽检 |
| 2 | icon | complete | 有；mirror/preserve/localized | 四语 | 是 | 抽检 |
| 3 | typography | complete | 有 | 四语 | 是 | 抽检 |
| 4 | input | complete | 有 | 四语 | 是 | 抽检 |
| 5 | textarea | complete | 有 | 四语 | 是 | 画廊 |
| 6 | select | complete | 有 | 四语 | 是 | 抽检 |
| 7 | checkbox | complete | 有 | 四语 | 是 | 抽检 |
| 8 | radio | complete | 有 | 四语 | 是 | 画廊 |
| 9 | switch | complete | 有 | 四语 | 是 | 画廊 |
| 10 | form | complete | 有 | 四语 | 是 | 画廊 |
| 11 | dialog | complete | `responsive`：桌面 modal / 窄屏 bottom-sheet | 四语 | 是（关闭态 trigger） | 抽检 trigger |
| 12 | toast | complete | 有 | 四语 | 是 | 否 |
| 13 | alert | complete | 有 | 四语 | 是 | 否 |
| 14 | tooltip | complete | 有 | 四语 | 是 | 否 |
| 15 | popover | complete | 有 | 四语 | 是 | 否 |
| 16 | tabs | complete | 有 | 四语 | 是 | 抽检 |
| 17 | table | complete | 有 | 四语 | 是 | 否 |
| 18 | app-shell | complete | 有；三断点 chrome | 四语 | 是 | 抽检（外壳） |
| 19 | stack | complete | 有 | 四语 | 是 | 抽检 |
| 20 | spinner | complete | 有 | 四语 | 是 | 抽检 |

全量 20 的像素矩阵未做；A1.2 要求的是三断点**抽检**。

## 4. 证据

| 面 | 证据 |
| :--- | :--- |
| 内测 Demo | `@chameleon-ui/internal-demo`；只依赖正式 `@chameleon-ui/components` + `primitives` + `themes` + `i18n` + `tokens`。未复制 Base POC。`/?view=suite&locale=ar&theme=line` 为官方 VR 入口 |
| 主题切换 | `data-theme="line\|cupertino\|silver-arrow"`；官方 overlay CSS 按 `[data-theme]` 注入 |
| i18n | `@chameleon-ui/i18n` catalog + ICU；组件文案来自各 `locales/`；`directionForLocale('ar')` → `rtl` |
| 官方 VR | Playwright Chromium 对 :4175 截图 390/768/1280；文件 `toolings/visual-regression/tests/official-appshell-common10.spec.ts-snapshots/official-ar-rtl-*-chromium.png`（约 25–35 KB，实拍） |
| POC VR | 同包仍截 :4173 Ark preview 三档，**对照用** |
| S1 | 19 个 base 组件均 ≤8 KB gzip；最大 dialog **1.773 KB**；oversize 样例 **12.022 KB > 8** 被拒 |
| S3 | line 0.660 / cupertino 0.697 / silver-arrow 0.686 KB gzip（dist，限 20） |
| S4 | 每组件四语 JSON gzip 均远低于 6 KB |
| S5 | AppShell + common-10 **4.389 KB gzip / 100 KB**（peer 外置） |
| R1–R3 | `perf:lhci` **只打印预算**，无 Lighthouse 分数 |
| 安装 | `install-core` 8 个单测；MCP 工具 `search_components` / `get_component` / `install_component` / `list_themes` / `install_theme` / `install_bundle`；CLI `chameleon` |
| 回流 | 默认关；`CU_TELEMETRY=1` 才挂钩；事件 `install` / `intent_vs_adopt` / `opt_out` |
| CI | 本机 `corepack pnpm@9.15.0 ci:phase1` 通过（2026-08-13） |
| 主题 | [`Phase-1-主题法务走查.md`](./Phase-1-主题法务走查.md) 所有者于 2026-08-13 确认 8 套官方致敬主题无法律问题（非律所意见书）；以免费官方主题出货 |

## 5. A1 逐条

| # | 标准 | 结论 | 说明 |
| :--- | :--- | :--- | :--- |
| A1.1 POC | Phase 0 关闭且选型未回退 | **通过** | 正式包无 `@base-ui`；`import-boundary` 测试禁止组件直接引 Ark/Base |
| A1.2 组件 | 20 可演示；契约齐全；三断点快照抽检 | **通过（抽检）** | Demo 含 20；官方快照 = AppShell+common-10 × 3 宽，不是 20×3 全矩阵 |
| A1.3 主题 | 3 套可切换；最小 design-rules | **通过** | Demo 切换；各含 `design-rules.json` |
| A1.4 i18n | 四语齐全；ar RTL 视觉回归绿；德语膨胀抽检 | **通过** | 官方 ar 三档绿；`validate-german-expansion.mjs` 进 `phase1:gates` |
| A1.5 MCP | 联装组件+主题 | **通过** | 内核 + MCP/CLI 薄壳；registry 20+3 |
| A1.6 回流 | 可开关；测试可见 install | **通过** | 默认 off；测试/文档用 `CU_TELEMETRY=1` |
| A1.7 门禁 | 基础门禁启用；违规可拒有样例 | **通过** | S1/S3/S4 硬门禁；同命令内 oversize gzip 样例必须 >8KB。本仓无 GitHub remote，「违规 PR」以本地 fixture 为准 |

## 6. 缺陷与诚实缺口

| 缺口 | 是否阻断工程 A1 | 是否阻断公开 Phase 2 |
| :--- | :--- | :--- |
| R1 LCP / R2 INP / R3 CLS **未跑 Lighthouse**，无分数 | 否（阶段卡为应做抽检，未造假） | **是**（发版前应补真实采样） |
| 云 VR（Percy/Chromatic）未启用；O4 复审日 2026-08-28 | 否（已选本地/CI Playwright） | 待裁定，不把云对比写成已做 |
| 官方致敬主题：所有者已确认无法律问题（2026-08-13） | 否 | 否（主题不再阻断官方出货；npm/公网仍冻结） |
| 官方 VR 未覆盖其余 10 个组件与 cupertino/silver-arrow | 否（抽检口径） | 建议 Phase 2 扩矩阵 |
| Dialog/Toast/Tooltip/Popover 关闭态无 `data-ai-role` 节点 | 否 | 后续可把 role 放到 trigger/root |
| 项目所有者 / 预算签字 | 研发不管 | 业务流程自定 |
| 无 GitHub Actions 实跑记录（本地仓） | 否；workflow 已就位 | 有 remote 后复跑 |

## 7. Phase 2 输入

1. 不要把 `apps/internal-demo` 扩成公开文档站；公开站按阶段卡建 `apps/docs`。  
2. 官方 8 套致敬主题以免费 SKU 出货；社区市场上架可以免费或付费。不要把官方 id 当付费 SKU。  
3. 在内测 Demo preview（:4175）上补 R1–R3 真采样，口径中端安卓 / Fast 4G；禁止用 POC 整站 gzip 或编造分数。  
4. 2026-08-28 前书面裁定是否上云 VR。  
5. 扩组件/主题/Locale 时继续走 catalog 变更单，禁止空壳冒充。

## 8. 风险与 Go / No-Go

| 风险 | 处理 | 阻断工程 M1？ |
| :--- | :--- | :--- |
| 无 R1–R3 数字 | 保持 stub；本报告标明未测 | 否 |
| 官方致敬主题 | 所有者已确认（2026-08-13） | 否 |
| 云托管未决 | 本地基线已绿 | 否 |
| Icon `mode=mirror` 在 RTL 下恒 `scaleX(-1)` | 已知；未在本回合改组件 | 否 |

**技术 M1：有条件 Go（A1 工程项有证据）。公开 npm / 公网托管：No-Go**，直到 R1–R3 真采样（若作为发版门禁）、以及业务侧需要的签字。8 套官方致敬主题不再因「法务未签」阻断官方出货。

## 9. 签字栏

| 角色 | 签署 | 日期 | 说明 |
| :--- | :--- | :--- | :--- |
| 工程实现与本地技术复核 | 通过（有条件） | 2026-08-13 | `ci:phase1` 绿；官方 VR 实拍；S5 4.389 KB；R1–R3 无分数 |
| 项目所有者（8 套官方致敬主题） | **已确认无法律问题** | 2026-08-13 | 非律所意见书；免费官方主题 |
| 项目所有者 / 预算 | 不纳入本仓 | — | 与 M0 相同 |

## 10. 复现命令

```bash
cd chameleon-ui
# PATH 需含 corepack shims（本机 nvm v24.15.0）
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 ci:phase1
corepack pnpm@9.15.0 demo          # http://127.0.0.1:5175
corepack pnpm@9.15.0 --filter @chameleon-ui/internal-demo preview  # :4175
```
