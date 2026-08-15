# Phase 9 · 口号核对表（A9.6 · 2026-08-15）

> 依据 [`../phases/Phase-9-硬化与发布.md`](../phases/Phase-9-硬化与发布.md) §3.6。  
> 每行：**证据链接**或明示「**不宣称**」。禁止用骨架/未测分数/未跑盲测冒充口号。

| 口号成分 | 可宣称？ | 证据或「不宣称」 |
| :--- | :--- | :--- |
| 二十一语言（含四种 RTL） | **部分 · 组件是 / 文档站否** | **宣称（组件）：** catalog ICU 21 语 + RTL `ar`/`ug`/`ur`/`fa`（`@chameleon-ui/i18n` `directionForLocale`）。**不宣称（文档）：** docs chrome 仍有英文骨架 — [`Phase-4-文档21语缺口表.md`](./Phase-4-文档21语缺口表.md) · LEGACY-2026-004/005/017 · ETA 2026-09-30 · owner 待指定。禁止整站「21 语文档」。 |
| 八大致敬主题 | **存在可宣称；认出率不宣称** | **宣称：** 8 官方主题 + design-rules / S3 gzip — [`2026-08-15-theme-quantification.md`](./2026-08-15-theme-quantification.md)（`recognition_rate=null`）。**不宣称：** 「一眼认出 ≥80%」— [`A9.5-decision.json`](./A9.5-decision.json) `PROTOCOL-READY` · [`盲测结果.pending.json`](./盲测结果.pending.json) `rate=null` · LEGACY-2026-008。 |
| 三端一体 | **降级表述** | **可写：** 断点 Token + 密度阶梯 + 容器查询白名单 + Navigation 变形 + 触控清单测量 — [`PHASE5.md`](../../chameleon-ui/PHASE5.md) · [`Phase-5-触控目标测量.md`](./Phase-5-触控目标测量.md)。**不宣称完整「三端一体」：** 容器查询降级策略未验；密度 v1.1 迁移未签；checkbox/select/switch/radio 仍 36px。对外用「三端支持（降级策略验证中）」。 |
| AI-Native | **部分** | **证据：** A1–A5 工程轨 — [`PHASE8.md`](../../chameleon-ui/PHASE8.md)（contract v0.2、MCP、validate-rules、SchemaRenderer 10-slug default、adapters）。**不宣称：** `bench.generation_quality` 实测分（诚实 `null`）；AG-UI 非认证（POC）；全 catalog SchemaRenderer。 |
| 性能 | **部分 · 体积是 / Web Vitals 慎称** | **宣称（体积）：** S1–S5 / S3 gzip 门禁生成物。**局部实测：** R1 LCP / R3 CLS 本地 lab — [`Phase-9-Lighthouse-R1-R3.md`](./Phase-9-Lighthouse-R1-R3.md)（非真机、非云 LHCI）。**不宣称：** R2 INP P75（navigation 无 numericValue）· LEGACY-2026-002；真机 4×A76+4GB；云 LHCI。禁止手写分数。 |

## 商业叙事一票否决

| 宣称 | 状态 |
| :--- | :--- |
| npm 已上架 | **不宣称** — [`A9.3-npm-deferred.md`](./A9.3-npm-deferred.md) |
| VPAT / WCAG AA 认证 | **不宣称** — [`Phase-9-VPAT-status.md`](./Phase-9-VPAT-status.md) `commercialClaimsAllowed=false` |
| chameleon-ui.dev 已上线 | **不宣称** |
| 一眼认出 ≥80% | **不宣称** — A9.5 PROTOCOL-READY |

## 合入

本表满足 A9.6（每行有证据或「不宣称」）。口号总览旧表见 [`../phases/Phase-2-Overview.md`](../phases/Phase-2-Overview.md) §4（以本表 2026-08-15 为准）。
