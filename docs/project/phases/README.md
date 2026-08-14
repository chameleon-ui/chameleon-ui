# 阶段目标文档（Phase 0–9）

每个 Phase 一份执行主卡。打开任一阶段文档即可看到：**前置要求、怎么做、代码设计、命名、任务、效果、讨论会、交付、验收、报告模板**。

勾选看板在 [`../../../chameleon-ui/PHASE0.md`](../../../chameleon-ui/PHASE0.md) … [`PHASE9.md`](../../../chameleon-ui/PHASE9.md)（2026-08-13 起 P0–P4 与 P5+ 同骨架）。本文目录只索引目标卡，不复制看板。

**全阶段必读**：[`../../engineering/工程约定与命名规范.md`](../../engineering/工程约定与命名规范.md)

**建设期（第一期，M0–M4）**

| 阶段 | 日历 | 里程碑 | 文档 |
| :--- | :--- | :--- | :--- |
| Phase 0 · 地基 | 第 1–5 日 | M0 | [Phase-0-地基.md](./Phase-0-地基.md) |
| Phase 1 · MVP | 第 2–3 周 | M1 | [Phase-1-MVP.md](./Phase-1-MVP.md) |
| Phase 2 · 开源发布 | 第 4–5 周 | M2 | [Phase-2-开源发布.md](./Phase-2-开源发布.md) |
| Phase 3 · v1.0 | 第 6–9 周 | M3 | [Phase-3-v1.0.md](./Phase-3-v1.0.md) |
| Phase 4 · v2.0 | 第 10–16 周 | M4 | [Phase-4-v2.0.md](./Phase-4-v2.0.md) |
| **AI 能力体系收口轨道（专项）** | 跨阶段，任务单评审排期 | A1–A6 + B1–B4 全收口 | **[AI能力体系-A1-A6-收口轨道.md](./AI能力体系-A1-A6-收口轨道.md)** |

**第二期（Phase 5–9，规划未开工；总览与缺口追溯：[Phase-2-Overview.md](./Phase-2-Overview.md)）**

| 阶段 | 日历 | 里程碑 | 文档 |
| :--- | :--- | :--- | :--- |
| Phase 5 · 三端内核 | 待指定 | M5 | [Phase-5-三端内核.md](./Phase-5-三端内核.md) |
| Phase 6 · 组件广度 | 待指定 | M6 | [Phase-6-组件广度.md](./Phase-6-组件广度.md) |
| Phase 7 · 场景 Blocks | 待指定 | M7 | [Phase-7-场景Blocks.md](./Phase-7-场景Blocks.md) |
| Phase 8 · AI 阶梯收口 | 待指定 | M8 | [Phase-8-AI阶梯收口.md](./Phase-8-AI阶梯收口.md)（AI 条目验收口径以专项轨道卡为准） |
| Phase 9 · 硬化与发布 | 待指定 | M9 | [Phase-9-硬化与发布.md](./Phase-9-硬化与发布.md) |

**统一章节（各 Phase）**

| 节 | 内容 |
| :--- | :--- |
| §0 | 本阶段前置要求（Checklist） |
| §1 | 阶段效果 |
| §2 | 工作任务 |
| §3 | **怎么做**（逐步） |
| §4 | **代码设计** |
| §5 | **命名规范（本阶段增量）** |
| **§5.5** | **功能点：预留 · 埋点 · 标记（矩阵）** |
| **§5.6** | **性能指标（本阶段门禁 / 预留）** |
| **§5.7** | **算法 · 复杂度 · 可用性** |
| … | 突破点、讨论会、交付、验收、报告、衔接 |

字典：[`../../engineering/工程约定与命名规范.md`](../../engineering/工程约定与命名规范.md) — §10 三件套 · §11 性能 · **§12 算法/复杂度/可用性（C* / U*）**。

报告目录：[`../reports/`](../reports/)。

---

## AI-Native 能力落在哪一阶段？

> **一等交付物**：A1–A6 六层 + B1–B4 四大突破点的**收口 DoD 以专项轨道卡为唯一权威**：[`AI能力体系-A1-A6-收口轨道.md`](./AI能力体系-A1-A6-收口轨道.md)。下表只回答「各阶段已铺什么基线」；是否收口、如何验收，看轨道卡。

产品定位是 **AI-Native 设计系统**（契约可喂模型 · Agent 可装 · 可回流）。阶段卡里**有**对应工作，但按能力阶梯 A1–A6 / 突破 B1–B4 拆开，而不是每篇都写「AI」二字。

| AI 能力（概要编号） | 含义 | 主要落点 | 阶段文档里看哪 |
| :--- | :--- | :--- | :--- |
| **A1** 组件语义契约 | 开放/可校验的 contract，供生成与检索 | schema → 组件 `contract.json` → **公开** | **P0** 播种 schema；**P1** 20 组件正文；**P2** 公开发布（B1） |
| **A2** Registry + MCP | Agent/人同一安装内核；搜/装组件+主题 | `registry` · `install-core` · `cli` · `mcp-server` | **P0 禁止做假**；**P1** MCP 联装门禁；**P2** 公网 |
| **A3** design-rules | 可机读设计纪律，喂给生成与校验 | `themes/*/design-rules.json` | **P1** 最小 rules；**P3** 完整化（B3 主战役） |
| **A4** 协议适配 | A2UI / AG-UI 等可信目录与绑定 | adapters · SchemaRenderer | **P1/P2 不做**；**P3** 至少一方可演示 |
| **A5** data-ai-* | DOM 上给 Agent 读的角色/状态 | `data-ai-role/state/intent` | **P0** 只注释预留；**P1** 鼓励；**P3** 门禁（U11） |
| **A6** 回流 + Bench | 安装/意图数据闭环；GenUI-Bench | telemetry 事件 · `genui-bench` | **P0 禁止埋点**；**P1** Day-1 `install` 等；**P2** Bench 首期（B4） |
| **MCP Apps** | 协议生态下一步 | 观察或适配 | **P3 预留**；**P4** 决策/适配 |
| **主题市场 × AI** | 上架检测含 rules/a11y；安装仍走内核 | 市场 + install-core | **P4** |

**一句话节奏**：P0 只为 AI 铺契约种子 → P1 做出「AI 可装」闭环 → P2 把标准与 Bench 公开 → P3 让 Agent 可读（data-ai）并接协议 → P4 放大生态。

与上位文档对齐：可行报告 B1–B4 / A1–A6；概要 §6；详细验收各 Phase 的 MCP/契约/回流条目。
