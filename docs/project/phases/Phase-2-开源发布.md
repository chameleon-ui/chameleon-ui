# Phase 2 · 开源发布 — 阶段目标与验收

> **日历**：第 4–5 周 · **里程碑**：M2  
> **前提**：M1 已关闭  
> **一句话**：MIT 公开发布；差异可被外部看见；组件/主题/Locale 到建设包第一完整形态。  
> **必读**：[工程约定与命名规范](../../engineering/工程约定与命名规范.md) + 本文 §0–§5.7。

---

## 0. 本阶段前置要求

| # | 前置 | 完成标准 |
| :--- | :--- | :--- |
| 0.1 | M1 报告签字 | A1.* 全绿 |
| 0.2 | 安装内核稳定 | CLI/MCP 同调 `install-core`；无分叉 fs 写入 |
| 0.3 | 公开前法务清单 | 主题表述、许可证、遥测告知文案草稿就绪 |
| 0.4 | 发布清单会 | npm scope、仓库名、schema 公开 URL、版本号策略书面化 |
| 0.5 | 45–50 组件名单冻结 | 变更走变更单 |
| 0.6 | T0/+90 日历占位 | 开源日后 90 自然日复核日程可写入 |

---

## 1. 阶段效果

公开 MIT；schema 公网可访问；GenUI-Bench 首期可引用；45–50 组件 / 8 主题 / 21 Locale；文档站至少中英；发版门禁全绿；T0 起算。

---

## 2. 工作任务

T2.1–T2.12：扩组件、满 8 主题、21 语、公开 schema、Bench 首期、npm+公网 Registry、`apps/docs`、license/遥测、法务复核、门禁走查、盲测计划、回流初值说明。

---

## 3. 怎么做

### 3.1 开源与版本

1. 清理私密配置；确认无密钥进仓。  
2. 根与包 LICENSE = MIT；README 徽章与安装说明。  
3. 版本：首发 `0.1.0` 或 `1.0.0-beta`（发布会冻结）；changeset/手动 tag 二选一写进约定。  
4. `pnpm publish -r`（或 CI）仅发非 private 包。

### 3.2 公开 schema

1. 将 `component-contract.schema.json` 挂到稳定 URL（GitHub raw / docs 站 / 独立路径）。  
2. 文档写：版本策略、破坏性变更期。  
3. 验收：无登录可 GET。

### 3.3 扩组件到 45–50

1. 按 Phase 1 同一工序与 DoD；Locale 升为 **21** 文件。  
2. 仍禁止高级 DataGrid/Gantt/画布重型；用基础替代须在名单注明。  
3. 每合入过体积与 RTL/伪本地化门禁。

### 3.4 八主题

1. 目录：`themes/src/<id>/` × 8；每套 `tokens.json` + `design-rules.json` + `meta.json`。  
2. 注册到 Registry；`install_theme` 可装。  
3. 盲测：排期或出结果；未完成则 README **禁止**「一眼认出 ≥80%」表述。

### 3.5 GenUI-Bench 首期

1. 新建 `benchmarks/genui-bench`。  
2. 定义 ≥3 个可引用指标（如一次生成可装率、联装成功率）+ 复现步骤。  
3. 发布页面或 `reports/` 静态页，从文档站链接。

### 3.6 文档站

1. 新建 `apps/docs`（VitePress / Next / Astro 等，技术选型开会定）。  
2. dogfooding `@chameleon-ui/components`。  
3. 至少中英路由；组件页由 contract 驱动生成优先。

### 3.7 发版门禁走查

按清单人工点验：性能预算、RTL、伪本地化、license 扫描、法务节点；红灯不得宣传性发布。

---

## 4. 代码设计

| 域 | 设计 |
| :--- | :--- |
| 双轨分发 | Registry 文件树由 `registry` 包 **生成**自 components/themes，禁止手改发布副本 |
| docs | 只依赖正式包 export，不引用 `poc/` |
| Bench | 调用真实 install-core / MCP 测试客户端；指标写入 JSON 再渲染 |
| 版本 | 包间 peer/workspace 依赖在发布时转为版本号；CI 校验 |

---

## 5. 命名规范（增量）

| 对象 | 规范 |
| :--- | :--- |
| 公开 schema URL | 路径含版本：`/schemas/component-contract/v0.1.json` |
| 主题 id | 继续 kebab 代号；市场 slug 与 id 相同 |
| Bench 指标 id | `bench.install_success_rate` 等稳定 id |
| 文档路由 | `/zh-CN/components/button`、`/en/components/button` |
| Git tag | `v0.1.0` |
| npm 包 | 保持 `@chameleon-ui/*` |

---

## 5.5 功能点：预留 · 埋点 · 标记（本阶段矩阵）

> 字典见 [工程约定 §10](../../engineering/工程约定与命名规范.md)。  
> **Phase 2 总原则：公开面要有可引用指标；埋点支撑 Bench 初值；不把企业市场做进来。**

| 功能点 | 预留 | 埋点 | 标记 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| 扩面组件 45–50 | 重型组件缺口书面预留 | — | contract 21 语；**鼓励** data-ai | |
| 8 主题 | 盲测未完成则宣传口径预留「未测」 | — | theme `meta`；rules 版本 | |
| 21 Locale | 个别低质翻译 ETA 表预留 | — | 文件名 BCP 47；CI 缺文件失败 | |
| 公开 schema | 下一 breaking 版本策略文档预留 | — | URL 含 `/v0.1/`；`$id` | **必做**公开标记 |
| GenUI-Bench | 企业版指标 **预留**列 | **应做** 复用 install/intent 聚合 | 指标 id：`bench.*` | 禁止伪造数 |
| npm / 公网 Registry | 私有 registry 配置项文档预留 | install 来源可区分 `cli`/`mcp`/`docs` | package version tag | |
| `apps/docs` | 21 语文档页可分批 | **鼓励** 文档站安装 CTA 走同一内核并打 `install` | 路由 locale 前缀 | 禁止第三套安装 |
| 回流初值 | `generation_quality` 可仍预留 | **应做** 导出匿名聚合供 Bench | 无 PII | |
| 遥测告知 | — | **必做** 对外 README/站点告知 + opt_out | 文案版本号 | |
| 主题市场 / Studio Pro | **禁止** | **禁止** | — | Phase 3/4 |
| MCP Apps | **预留**观察笔记即可 | — | — | |

### 合入检查（Phase 2）

- [ ] 公开文档未宣称未做的回流/市场能力  
- [ ] Bench 数字可复现、可追溯到埋点或脚本  
- [ ] schema URL 稳定且版本可见  

---

## 5.6 性能指标（本阶段）

| 指标 | 本阶段要求 | 通过标准 |
| :--- | :--- | :--- |
| S1–S4 | **必做 · 发版门禁** | 全量已发布组件/主题/locale 抽检或全量 CI 绿 |
| **S5** | **必做 · 发版门禁** | ≤100KB gzip，报告入库 |
| **R1–R3** | **必做 · 发版门禁** | LCP/INP/CLS 达标证据（Lighthouse CI 或等价） |
| 文档站首屏 | **应做 · 抽检** | 另记一笔 R1；不替代组件库 S5 |
| Bench 页面 | **鼓励** | 体积不计入 S1；过重须优化 |
| 超标 | **禁止**无文档发布 | 须 `perf-waiver` + ETA 或砍范围 |

公开 MIT 宣传前：工程约定 §11 发版硬门禁全绿。

---

## 5.7 算法 · 复杂度 · 可用性（本阶段）

| 功能点 | 算法/逻辑 | 复杂度 | 可用性 | 要求 |
| :--- | :--- | :--- | :--- | :--- |
| 45–50 组件 | 同 P1 | C4/C5 保持 | **U1 发版** | 抽检+自动 |
| Registry 规模 | 搜索 | 触发则上 **C8** 索引 | 搜索延迟可感知则不达标 | 开会定方案 |
| GenUI-Bench 聚合 | 统计/抽样 | **O(n)** 可接受 | 指标可复现 | 禁止不可解释黑盒分 |
| 文档站检索 | 可静态索引 | 注明复杂度 | 中英可达 | |
| 公开 schema 生态 | 外部校验器 | C9 | U9 错误示例进文档 | |
| U10 降级 | — | — | **鼓励** | 关键组件标注 |

---

## 6–8. 开发 / 技术 / 突破

新建 `apps/docs`、`benchmarks/genui-bench`；满编主题与 Locale。  
B1 公开标准为本阶段主战役；B2 四 RTL；B3 八主题 rules；B4 Bench+回流初值。

---

## 9. 讨论会

开源叙事、组件终表、盲测、Bench 指标字典、npm 作用域、T0+90、法务未闭环主题处置。

---

## 10–12. 交付 · 验收 · 报告

交付：公开仓、schema URL、Bench、npm+Registry、文档站、发布说明、门禁记录、M2 报告、T0 日程。  
验收：A2.1–A2.8。  
报告：`docs/project/reports/M2-开源发布验收.md`。

---

## 13. 衔接

下一阶段：[Phase-3-v1.0.md](./Phase-3-v1.0.md)
