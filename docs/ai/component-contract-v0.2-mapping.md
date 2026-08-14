# 组件语义契约 v0.2 · 键位决议与映射表

> **决议（轨道卡 A1 任务 1，选项 b）**：把项目现行键位登记为 **canonical v0.2**，并发布与综合可行性研究报告 v3.0 §8.2 字段规范的逐项映射表。  
> 决议日期：2026-08-13 · Owner：待指定 · 状态：已登记（本文件即书面记录）

## 为什么不改名（选项 a）而选登记（选项 b）

1. 50/50 组件契约、Registry 全量条目、docs 站公开拷贝、A2 意图搜索均已消费现行键位；改名是全库返工且零信息增益。
2. 报告 §8.2 是**字段规范建议**而非已发布标准；本项目先行落地，键位差异属命名层而非语义层。
3. 映射表保证外部校验器可以独立实现到报告字段的机械转换（B1 开放标准要求）。

## canonical v0.2 ↔ 报告 §8.2 映射表

| canonical v0.2 键位 | 报告 §8.2 字段 | 语义说明 | 转换规则 |
| :--- | :--- | :--- | :--- |
| `purpose` | `purpose` | 一句话语义定位 | 直等 |
| `scenarios` | `scenarios` | 典型使用场景 | 直等 |
| `props` | `props` | 属性表（类型/必填/枚举值） | 直等 |
| `variants` | `variants` | 变体轴与默认值 | 直等 |
| `states` | `states` | 状态机状态名册 | 直等 |
| `composition` | `compositionRules` | allowedParents/allowedChildren/requiredContext | 键改名，子键直等 |
| `antiPatterns` | `antiPatterns` | 反模式禁令清单 | 直等 |
| `a11y` | `a11y` | role/键盘/焦点/标注/WCAG | 直等 |
| `responsive` | `threeEndBehavior` 的 web 端断面 | 断点策略（compact/medium/large） | 键改名；三端差异由 `platforms` 补充表达 |
| `platforms` | `threeEndBehavior` 的平台矩阵 | web/react/vue 支持级别 | 键改名 |
| `rtl` | `rtlBehavior` | supported/strategy/mirroredValues | 键改名 |
| `dataAi` | （报告 §8.1 运行时标注的契约侧声明） | role/states/intents 词表 | 报告无独立字段；v0.2 起必填 |
| `telemetry` | （预留） | 埋点 hook 名占位，默认不发送 | 报告无独立字段 |
| `mechanics` | （可选） | 工作原理：morph、状态、配对 | 报告无独立字段；缺省时文档从 purpose + responsive 合成 |
| `usage` | （可选） | 有序使用步骤 | 报告无独立字段；缺省时文档从 required props / events / scenarios 合成 |
| `exports` | （可选） | 包导出：component / hook / function / type | 报告无独立字段；缺省时文档合成组件名 |
| `props.*.payload` | （可选） | 事件回调签名 | 仅 `type=event` 有意义 |

v0.2 增补（非破坏）：`mechanics` / `usage` / `exports` / `props.payload` 均为 optional。现有契约不写这些键仍然合法。

## v0.1 → v0.2 破坏性变更清单

1. `schemaVersion` 常量：`0.1` → `0.2`。
2. 顶层 `required` 新增 `dataAi`。
3. `dataAi.required`：`["role"]` → `["role","states","intents"]`（`intents` 至少 1 项，且必须登记于 [data-ai 值域文档](./data-ai-vocabulary.md)）。
4. 键位**未**改名、未删除；v0.1 文档如需复验，用归档 schema `schemas/component-contract.v0.1.json`。

## 外部校验器实现指引

任一 JSON Schema 2020-12 实现加载 `https://chameleon-ui.dev/schemas/component-contract/v0.2.json`（文档站镜像 `/schemas/component-contract/v0.2.json`）即可独立校验；如需对齐报告 §8.2 术语，按上映射表做键名重写，无语义损失。
