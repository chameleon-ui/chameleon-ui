# Phase 3 · v1.0 — 阶段目标与验收

> **日历**：第 6–9 周 · **里程碑**：M3  
> **前提**：M2 已关闭（已开源）  
> **一句话**：纪律体系与协议卡位；工作台与私有分发可演示；Vue 按 M0 结论推进。  
> **必读**：[工程约定与命名规范](../../engineering/工程约定与命名规范.md) + 本文 §0–§5.7。  
> **工程看板（勾选状态）**：[`../../../chameleon-ui/PHASE3.md`](../../../chameleon-ui/PHASE3.md)。本文是目标卡，不重复看板章节。

---

## 0. 本阶段前置要求

| # | 前置 | 完成标准 |
| :--- | :--- | :--- |
| 0.1 | M2 签字 | 公开 schema URL 有效 |
| 0.2 | design-rules 字段草案 | 完整字段草案已开会一版（可在 M2 末预热） |
| 0.3 | 协议优先级会 | A2UI vs AG-UI 谁先通已书面 |
| 0.4 | Vue 决策回看 M0 | 「做子集」或「推迟」预结论，本阶段正式签字 |
| 0.5 | 工作台 V0 范围单 | 明确砍掉的 Pro 能力列表 |
| 0.6 | 私有 Registry 拓扑草图 | 单机 Docker / K8s 等选定演示形态 |

---

## 1. 阶段效果

8 主题 rules 统一校验过；A2UI 或 AG-UI 可演示；MVP20 挂 `data-ai-*`；工作台约 10 分钟导出合规 Token+rules；私有 Registry 同协议可装；Vue 交付或推迟函。

---

## 2. 工作任务

T3.1–T3.10：rules 完整化、协议适配、data-ai、theme-studio Beta、私有 Registry、Vue 子集或推迟、盲测、VPAT 草稿、企业差异仅鉴权、接口说明书补齐。

---

## 3. 怎么做

### 3.1 design-rules 完整化

1. 冻结 `design-rules.schema.json`（可放 `packages/contract/schemas/`）。  
2. 字段分组建议：`typography`、`spacing`、`colorBoundaries`、`forbiddenPatterns`、`composition`、`rtl`。  
3. 写校验 CLI：`pnpm --filter @chameleon-ui/themes validate-rules`。  
4. 8 套主题全部过检；失败主题不得进工作台导出默认列表。

### 3.2 协议适配（A4）

1. 建适配包或目录：`packages/adapters-a2ui`（名称开会定，遵守 `@chameleon-ui/`）。  
2. `SchemaRenderer`：输入协议目录 → 映射到本库组件 slug。  
3. 演示：最小「表单+提交」或官方样例绑定；录像归档。  
4. **禁止**在 L1/L2 写死某一协议 if 分支；适配只在 L3/L4。

### 3.3 data-ai-*（A5）

1. 在 MVP20 根节点挂 `data-ai-role`、`data-ai-state`（按需 `data-ai-intent`）。  
2. 值域写入契约/文档；与 contract 字段交叉引用。  
3. 单测：断言属性存在。

### 3.4 主题工作台 Beta

1. 新建 `apps/theme-studio`。  
2. 流程：选基线 → 改 Token → 编辑 rules → 校验 → 导出 zip/目录（Token+rules+meta）。  
3. 计时验收：生手脚本目标 ≤10 分钟（可预置向导）。  
4. 导出物必须跑通 validate-rules。

### 3.5 私有 Registry

1. 同一 registry item schema；增加鉴权中间层（Token / mTLS 等）。  
2. 演示剧本：内网安装 `button` 成功；与公网条目兼容。  
3. 安装仍走 `install-core`。

### 3.6 Vue

若做：`packages/components-vue`，包装同一 primitives/tokens；目录 `src/button/Button.vue`。  
若不做：一页推迟函（原因、重估里程碑、签字）。

---

## 4. 代码设计

| 域 | 设计 |
| :--- | :--- |
| rules | 权威仍在 `themes/<id>/design-rules.json`；L3 只校验/索引 |
| 适配器 | `adapt(protocolDoc) -> InstallPlan[]` 再交 install-core |
| studio | 不直接改 npm 包源；导出为用户工程或 PR 产物 |
| data-ai | 仅 DOM 标注；不在标注中塞 PII |
| Vue | 禁止复制 Token JSON 第二份权威 |

---

## 5. 命名规范（增量）

| 对象 | 规范 |
| :--- | :--- |
| rules schema | `design-rules.schema.json` |
| data-ai | `data-ai-role`、`data-ai-state`、`data-ai-intent` |
| 适配包 | `@chameleon-ui/adapter-a2ui` / `adapter-ag-ui` |
| studio 路由 | `/editor`、`/export` |
| 私有 registry 环境变量 | `CU_REGISTRY_URL`、`CU_REGISTRY_TOKEN` |
| Vue 包 | `@chameleon-ui/components-vue`；组件文件 PascalCase `.vue` |

---

## 5.5 功能点：预留 · 埋点 · 标记（本阶段矩阵）

> 字典见 [工程约定 §10](../../engineering/工程约定与命名规范.md)。  
> **Phase 3 总原则：`data-ai-*` 升为门禁；企业场景埋点必须可关；市场仍预留。**

| 功能点 | 预留 | 埋点 | 标记 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| design-rules 完整化 | 市场交易字段可预留 | — | rules schema `$id`；主题过检徽章 | |
| A2UI / AG-UI 适配 | 未选协议方 **预留** adapter 空包或文档 | **鼓励** 适配安装走内核 → `install` | 协议名写在 InstallPlan.source | 禁止写进 L1 |
| SchemaRenderer | 高级绑定预留 | — | — | |
| MVP20 `data-ai-*` | intent 个别可空 | — | **必做** `data-ai-role` + `data-ai-state`；**应做** `data-ai-intent` | A3.6 |
| theme-studio Beta | Pro 能力列表预留 | **鼓励** 导出成功本地事件（可不上报）；若上报须 opt_out | 导出物 meta.`generator=theme-studio` | |
| 私有 Registry | 多租户预留 | **必做** 与公网同事件名；企业默认策略可关 | `CU_REGISTRY_*`；来源=`mcp`\|`cli` | 字段兼容 B4 |
| Vue 子集 | 未做组件清单预留或推迟函 | — | 包名 `@chameleon-ui/components-vue` | |
| VPAT 草稿 | 正式发布预留到 P4 | — | 文档状态=`draft` | |
| 主题市场 / 付费纪律包 | **预留**政策与检测插件接口 | **禁止** 市场成交埋点 | 检测器接口名稳定 | Phase 4 接 |
| MCP Apps | **预留** | — | — | P4 决策 |

### 合入检查（Phase 3）

- [x] MVP20 根节点 data-ai 抽检通过 — `phase3:gates` / M3 报告（2026-08-13）  
- [x] 企业演示可演示「关闭遥测」 — 默认关；`CU_TELEMETRY=1` 才挂钩；`chameleon telemetry-off`  
- [x] 无市场假页面 — P3 未做假市场；真市场在 P4 `apps/market`  

---

## 5.6 性能指标（本阶段）

| 指标 | 本阶段要求 | 通过标准 |
| :--- | :--- | :--- |
| S1–S5 / R1–R3 | **应做 · 回归** | 主库不放宽；PR 仍走 CI |
| theme-studio | **应做 · 抽检** | 编辑器首屏 R1 记入 M3；**不计入**组件 S1 |
| 导出物 Token/rules | — | JSON 大小另限（建议单主题 rules+tokens ≤ S3 量级）；超标警告 |
| 私有 Registry 演示 | **禁止**用「企业场景」豁免 S* | 协议同公网 |
| Vue 子集 | **必做 S1**（若交付） | 同 React 基础组件口径或书面说明差异 |
| data-ai 属性 | — | 不得引入可测量的运行时税（仅 DOM 标注） |

---

## 5.7 算法 · 复杂度 · 可用性（本阶段）

| 功能点 | 算法/逻辑 | 复杂度 | 可用性 | 要求 |
| :--- | :--- | :--- | :--- | :--- |
| design-rules 全量校验 | 规则匹配/冲突 | **C9** | **U9** 定位到字段 | 8 套过检 |
| 协议适配映射 | catalog → slug | 查找 **O(1)/O(log m)** | 映射失败可读 | 禁止 L1 写死协议 |
| SchemaRenderer | 绑定/渲染计划 | 注明；禁指数展开 | 错误可恢复 | |
| data-ai 标记 | — | — | **U11 必做** | 与契约一致 |
| theme-studio | 校验+导出 | 大 JSON 解析 O(n) | U9；10 分钟任务 U 键程友好 | |
| 私有 Registry | 同安装算法 C6 | 不放宽 | 企业可关遥测 U12 | |

---

## 6–8. 开发 / 技术 / 突破

**B3 · 设计纪律包**完整化为主战役；**B1 · 开放标准**协议卡位；**B4 · 数据回流**私有分发保持回流字段兼容。  
**收口口径**：A3（rules 校验 CI 强制 + 社区包通路）、A4（AG-UI adapter + SchemaRenderer 补齐、A2UI/MCP Apps 从 POC 升 supported）、A5（data-ai 三件套全量化）的最终 DoD 见 [`AI能力体系-A1-A6-收口轨道.md`](./AI能力体系-A1-A6-收口轨道.md)。

---

## 9. 讨论会

协议优先级、rules 字段冻结、Studio V0 范围、私有部署形态、Vue 签字、盲测是否挡 M3、VPAT owner。

---

## 10–12. 交付 · 验收 · 报告

交付：rules 过检记录、协议演示、studio、私有 Registry 证据、Vue 或推迟函、data-ai 矩阵、盲测/VPAT、M3 报告。  
验收：A3.1–A3.6。  
报告：`docs/project/reports/M3-v1.0验收.md`。

---

## 13. 衔接

下一阶段：[Phase-4-v2.0.md](./Phase-4-v2.0.md)
