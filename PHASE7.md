# Phase 7 · 场景 Blocks 看板（第二期）

> 完整目标卡见 [`../docs/project/phases/Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md)。  
> 第二期总览：[`../docs/project/phases/Phase-2-Overview.md`](../docs/project/phases/Phase-2-Overview.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 看板（规划，未开工）

```
P7  [ ] 建 packages/blocks（@chameleon-ui/blocks；manifest + 生成管线进 Registry）
    [ ] Registry 类型 registry:block；install-core 依赖图扩「组件+主题+Block」
    [ ] Blocks ×12：login / register / crud-page / kanban / gantt / ticket-flow /
        approval-flow / im-chat / data-screen / trading-terminal / iot-panel / marketing-site
    [ ] 愿景 §7.4 场景矩阵 17/17 行有映射（未交付行标 LEGACY-*）
    [ ] Block 规范：Token-only 样式 + ar RTL + 390/768/1280 快照 + en/zh-CN 撰稿文案
    [ ] bench.block_install_success_rate 指标（harness 生成）
    [ ] ci:phase7 = ci:phase6 + phase7:gates（manifest 校验 + Block 安装 + 矩阵覆盖）
```

## 命令

```
corepack pnpm@9.15.0 ci:phase4        # 既有门禁回归
# phase7:gates 脚本待落地后追加
```

## 红线

- Block 安装写盘仅经 `install-core`；禁止第二套 fs 逻辑。
- Block 体积预算未进 `budgets.json` 前只测不门禁，且禁止性能宣称。
- 19 语 Block 文案为骨架（`_cuSkeleton` + 缺口表），禁止宣称「21 语 Blocks」。

## 明确未做（禁止伪造）

- Blocks 市场交易（运营期）
- 看板拖拽引擎自研 / 甘特绘制基元不足部分（缺口书面化）
- 「集成层」场景行依赖 P8 SchemaRenderer 的，未交付前标 LEGACY 不冒充覆盖

## 合入检查

- [ ] manifest 依赖与实际 import 一致（CI 漂移检查）
- [ ] 每个 Block 二次安装幂等（written=0 / skipped>0）
- [ ] 矩阵表无伪造覆盖行
- [ ] 骨架文案进缺口表

## 其它阶段

| 阶段 | 文档 |
| :--- | :--- |
| Phase 0–4（建设期） | [`PHASE0.md`](./PHASE0.md) … [`PHASE4.md`](./PHASE4.md) |
| Phase 5 | [`Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md) |
| Phase 6 | [`Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md) |
| Phase 7 | [`Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md) |
| Phase 8 | [`Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md) |
| Phase 9 | [`Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md) |
