# Phase 7 · 场景 Blocks 看板（第二期）

> 完整目标卡见 [`../docs/project/phases/Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md)。  
> 第二期总览：[`../docs/project/phases/Phase-2-Overview.md`](../docs/project/phases/Phase-2-Overview.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。  
> 验收报告：[`../docs/project/reports/M7-场景Blocks验收.md`](../docs/project/reports/M7-场景Blocks验收.md)。

## 同步说明 2026-08-15

本切片关闭 **code-closable** P7 余项：`packages/blocks` ×12 已在树；Registry `registry/b` 生成管线；install-core Block→组件图；CLI `add-block` / MCP `install_block`；§7.4 矩阵 17/17（LEGACY-2026-018/019）；`bench.block_install_success_rate`；`ci:phase7` / `phase7:gates`；demo `view=blocks` + VR spec；骨架进 `locale-gap-table.json` + `GAPS.md`。未 npm publish。未签冻结/预算会。未宣称 21 语 Blocks / 设备框 / 3D 孪生。

## 看板（据树同步 2026-08-15）

```
P7  [x] 建 packages/blocks（@chameleon-ui/blocks；manifest + 生成管线进 Registry）
    [x] Registry 类型 registry:block；install-core 依赖图扩「组件+主题+Block」
    [x] Blocks ×12：login / register / crud-page / kanban / gantt / ticket-flow /
        approval-flow / im-chat / data-screen / trading-terminal / iot-panel / marketing-site
    [x] 愿景 §7.4 场景矩阵 17/17 行有映射（未交付行标 LEGACY-*）
    [x] Block 规范：Token-only 样式 + ar RTL + 390/768/1280 实拍 PNG（en/ar）+ en/zh-CN 撰稿文案
    [x] bench.block_install_success_rate 指标（harness 生成）
    [x] ci:phase7 = ci:phase6 + phase7:gates（manifest 校验 + Block 安装 + 矩阵覆盖）
```

DoD A7.1–A7.5（目标卡 §10–12；工程可测 vs 会议签字分开）：

```
    [x] A7.1 工程侧 MET — 12 Block 经 CLI add-block / MCP install_block → install-core；二次安装幂等
    [x] A7.2 工程侧 MET — manifest+Token-only lint+RTL 声明+en/zh-CN；`p7-blocks.spec.ts` 实拍 12×3×2 PNG（390/768/1280 × en/ar）
    [x] A7.3 MET — 矩阵 17/17；LEGACY-2026-018/019 诚实标注
    [x] A7.4 MET — bench.block_install_success_rate 进字典并由 harness 生成
    [x] A7.5 工程侧 MET — ci:phase7 = ci:phase6 + phase7:gates
```

## 命令

```
corepack pnpm@9.15.0 phase7:gates
corepack pnpm@9.15.0 ci:phase7          # = ci:phase6 + phase7:gates
corepack pnpm@9.15.0 bench:genui
corepack pnpm@9.15.0 --filter @chameleon-ui/blocks test
corepack pnpm@9.15.0 --filter @chameleon-ui/visual-regression exec playwright test tests/p7-blocks.spec.ts
```

## 红线

- Block 安装写盘仅经 `install-core`；禁止第二套 fs 逻辑。
- Block 体积预算未进 `budgets.json` 前只测不门禁，且禁止性能宣称。
- 19 语 Block 文案为骨架（`_cuSkeleton` + 缺口表），禁止宣称「21 语 Blocks」。

## 明确未做（禁止伪造）

- Blocks 市场交易（运营期）
- 看板拖拽引擎自研 / 甘特绘制基元不足部分（缺口书面化 → `packages/blocks/GAPS.md`）
- 「集成层」场景行：数字孪生 3D（LEGACY-2026-018）；产品原型设备框 Block（LEGACY-2026-019）
- npm publish（用户：npm 先不上架）
- 冻结会 / 预算会签字（owner 待指定）

## 合入检查

- [x] manifest 依赖与实际 import 一致（CI 漂移检查）
- [x] 每个 Block 二次安装幂等（written=0 / skipped>0）
- [x] 矩阵表无伪造覆盖行
- [x] 骨架文案进缺口表

## 其它阶段

| 阶段 | 文档 |
| :--- | :--- |
| Phase 0–4（建设期） | [`PHASE0.md`](./PHASE0.md) … [`PHASE4.md`](./PHASE4.md) |
| Phase 5 | [`Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md) |
| Phase 6 | [`Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md) |
| Phase 7 | [`Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md) |
| Phase 8 | [`Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md) |
| Phase 9 | [`Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md) |
