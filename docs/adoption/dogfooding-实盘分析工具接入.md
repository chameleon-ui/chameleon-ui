# ChameleonUI 第三方实战接入审计 —— 实盘分析工具（stock-analyzer）

> 这份报告是给 **ChameleonUI** 的迭代输入：记录首个**外部独立工程**用真实业务接入
> `@chameleon-ui/*` 时的体验、兼容性与问题清单。
> 报告方：stock-analyzer 工程（基于 akshare + FastAPI + React 19）。
> 日期：2026-08-14　第一轮（功能性验证完成）
>
> **定位**：ChameleonUI 第三方 adoption / dogfooding 审计，非实盘工具自述。

---

## 0. 结论速览

- 核心组件在**真实业务 + TypeScript strict** 下**开箱可用、类型契约良好**（正面）。
- 暴露 **2 个 P1 真问题**（主题 CSS exports、npm link 的 `workspace:*` 依赖）+ **1 个 P2**（环境门槛未声明）。
- 附带 1 条数据源兼容性教训（与 ChameleonUI 无关，同类工程可借鉴）。
- **2026-08-14 处理**：P1-1 / P2-1 已在本仓闭环；P1-2 文档 + 全量 link 脚本已落地，发布前仍须全量 link（见 §处理记录）。
- **2026-08-14 AI 层**：编码 Agent 从文档抄错 CSS / `workspace:*` 的 DX 缺口已补 SSOT（`chameleon-ui/AGENTS.md`）+ MCP `get_import_specifiers` / `get_contract` / `get_design_rules` + 安装页「外部工程」可编译片段。**未**测一次生成成功率，**未**编造 `generation_quality`。

---

## 1. 接入范围与方法

| 项 | 值 |
| :-- | :-- |
| 前端 | React 19.2 + Vite 5 + TypeScript（strict） |
| 接入方式 | `npm link` 本地 monorepo 子包 |
| ChameleonUI 子包 | `@chameleon-ui/components` / `themes` / `tokens` / `i18n` / `primitives` |
| 实际使用组件 | `Tabs · Table · Card · KpiDashboard · Grid · Badge · Alert · Button · Spinner · Gauge · Chart · SearchBar`（12 种） |
| 页面 | 仪表盘 / 板块监控 / 板块预测 / K线分析 / 风险预警 |

## 2. 验证结果

| 项 | 结论 |
| :-- | :-- |
| `tsc --noEmit`（strict） | ✅ 零错误 |
| Vite dev 全页面 transform | ✅ 无报错 |
| 生产构建 | ✅ 1826 模块 / JS 414kB / CSS 86kB / 30s |
| 前端→后端代理 | ✅ Vite proxy → FastAPI 全链路通 |
| 组件 CSS 注入 | ✅ 样式随包正常打进 bundle |

---

## 3. 发现的问题（ChameleonUI 侧待办）

### P1-1 主题 CSS 子路径导出不直观 / 文档缺失
- **现象**：`import "@chameleon-ui/themes/dist/cupertino/variables.css"` →
  `Missing "./dist/cupertino/variables.css" specifier`。
- **正确用法**：`import "@chameleon-ui/themes/cupertino/css"`（走的包 `exports` 别名）。
- **建议**：在 `.d.ts` / 包 README 显式注释 CSS 正确入口，覆盖 `dist/` 直觉误区。
- **状态（2026-08-14）**：已修。见处理记录。

### P1-2 外部工程 `npm link` 时 `workspace:*` 依赖解析失败
- **现象**：`@chameleon-ui/components` 依赖 `primitives|i18n|tokens` 版本为
  `workspace:*`；普通（非 pnpm-workspace）工程 `npm link` 单个 `components` 报找不到子包。
- **规避**：把 5 个子包**全部** link；或依赖 monorepo 内 `<子包>/node_modules` 预解析。
- **建议**：提供对外**聚合入口**或明确“本地链接须全量”的说明；确认发布预案
  （当前 `publishConfig.access:public` 但版本 `0.1.0`、未发布）。
- **状态（2026-08-14）**：文档 + `link-external` 脚本已落地。未新建聚合 npm 包。发布前全量 link **仍是正确用法**。npm 首发 owner **待指定**。

### P2-1 环境门槛未在 `engines` 声明
- **现象**：需 Node ≥ 20.19，但未在 `engines` / 根 README 提示；Node 18 下首次编译失败。
- **建议**：各包补 `engines.node >= 20.19`，根 README 明示 `Node≥20.19 / pnpm 9.15`。
- **状态（2026-08-14）**：已修。见处理记录。

---

## 4. 接入经验（非 ChameleonUI 问题，供同类工程借鉴）

- 后端 `akshare` 在 `pandas>=3.0` 下 `stock_zh_a_hist_tx` 崩溃；锁定 `pandas<2.3` 后恢复。
  → 真实工程需为第三方 LL 库锁版本。

---

## 5. 复现与复测

```bash
cd <接入工程>/frontend
for p in components themes tokens i18n primitives; do
  npm link <CHAMELEON>/packages/$p
done
npm install && npm run dev      # Vite 5173，proxy /api -> :8000
```

本仓侧打印同等命令：

```bash
cd chameleon-ui
node ./scripts/link-external.mjs
```

---

## 6. 后续动作

- 待接入工程复跑：P1-1 可用直觉 `dist/` CSS 路径；P1-2 **发布前不能**去掉全量 link（除非改用 pnpm workspace 或等 v0.1.0 上 registry）。
- npm 首发 `v0.1.0`：owner **待指定**。本仓不执行 npm publish，不编造安装量。

---

## 处理记录 2026-08-14

主仓 `D:\ChameleonUI`。未 git commit。未发明产品分析后端。无假指标。

### 本仓已修（代码可闭环）

| ID | 处理 |
| :-- | :-- |
| **P1-1** | `@chameleon-ui/themes` / `@chameleon-ui/tokens` 增加 `exports["./dist/*"]`，`dist/cupertino/variables.css` 与 canonical `cupertino/css`（及 `tokens/css`）指向同一文件。`themeCssSpecifier` / `themeCssDistSpecifier` 与 `tokensCssSpecifier` 写入 `.d.ts`。包 README、文档站「安装 / 主题」（zh-CN / zh-HK / en）写明入口。文档站 `theme.ts` 改为走包 exports 而非相对 `dist/` 文件。`publish:check` 与 themes/tokens 测试锁定该 `exports`。 |
| **P1-2（文档/DX）** | 保持 `workspace:*`（pnpm 发布时改写；`catalog.test.ts` 仍断言该协议）。新增 `chameleon-ui/scripts/link-external.mjs`（`pnpm link:external`），默认打印、`--apply` 按 tokens → i18n → primitives → themes → components 执行 `npm link`。components README、两份 CONTRIBUTING、文档站安装页写明：**发布前必须全量 link，只 link components 会失败**。发布预案仍是首发 tag `v0.1.0`、`publishConfig.access=public`、版本 `0.1.0`、本仓不 npm publish。 |
| **P2-1** | 各 workspace 包（及原已声明的根 `chameleon-ui/package.json`、docs、poc-base-ui）补 `engines.node: >=20.19.0`。工作区根 README 与工程塔 README 明示 Node≥20.19 / pnpm 9.15。`publish:check` 对可发包强制该 `engines`。 |
| **AI-copy DX** | Agent 从文档抄错 specifier 的根因：缺少消费方 SSOT。新增 `chameleon-ui/AGENTS.md`、`docs/ai/agent-consume.md`、`.cursor/rules/chameleon-ui-consume.mdc`。MCP 增加 `get_contract` / `get_design_rules` / `get_import_specifiers`（首选 CSS 为 `@chameleon-ui/themes/cupertino/css`，明确 `workspace:*` 为 never）。安装 MDX 三语增加「外部工程」可复制 `App.tsx`。`pnpm ai:check` 在文档/MCP/契约漂移时变红。SchemaRenderer 一页纸写明默认 10 slug；AG-UI 仍标 POC。`generation_quality` 保持诚实 null。 |

本轮报告**没有**列出 DataGrid / Ticker / Chart / RTL / 主题切换 / i18n 文案 / blocks 的 UI 缺陷；12 个已用组件在接入方 `tsc` + Vite 下为绿。未改这些组件实现，也未编造性能或业务数字。

### 仍开放（人工 / 运维，owner 待指定）

| 项 | 原因 |
| :-- | :-- |
| npm 首发 `v0.1.0` / 公网 registry | 本仓禁止代发；`workspace:*` 要等 pnpm publish 才变成版本号。发布后外部工程才可以只装 `@chameleon-ui/components` 而不全量 link。 |
| 独立聚合包（例如 `@chameleon-ui/react`） | 未新建包，避免扩面与第二套安装路径（写盘仍只走 `install-core`）。发布前全量 link 即报告所写规避。 |
| stock-analyzer 复测 | 需接入工程去掉「禁用 dist/ 路径」workaround，并确认 Node≥20.19；**不能**在未发布时去掉全量 link。复测时应把 `chameleon-ui/AGENTS.md` 与 MCP 配进该仓 Agent，验证不再抄 `workspace:*` / 未导出 CSS。 |
| AI 一次生成成功率 | 无模型预算；`bench.generation_quality` 保持 null。禁止手写。 |
| akshare / pandas 锁版本 | 接入工程后端，非本仓。 |
| 产品分析 / 实盘指标后端 | 不在范围；未实现、未编造。 |
| 运营接收人 / 发布冻结人 | 待指定。 |
