# M7 · 场景 Blocks 验收报告

> 阶段：Phase 7 · 场景 Blocks  
> 日期：2026-08-15  
> Owner：待指定  
> npm publish：**未做**（用户明确 npm 先不上架）

## 交付摘要

| 项 | 状态 |
| :--- | :--- |
| `packages/blocks` ×12 | 已交付；`registry:block` manifest + contract + Token-only CSS + 21 locale 文件 |
| Registry 生成管线 | `packages/registry/scripts/sync-catalog.mjs` 写入 `registry/b/*.json` |
| install-core | 依赖图支持 Block → 组件；二次安装 `written=0 / skipped>0` |
| CLI / MCP | `chameleon add-block` · MCP `install_block`（写盘仅经 install-core） |
| §7.4 矩阵 17/17 | `packages/blocks/scenario-matrix.json` + docs 页；未交付行标 LEGACY |
| `bench.block_install_success_rate` | GenUI-Bench 指标字典 + harness 生成 |
| `ci:phase7` | `ci:phase6` + `phase7:gates` |

## 诚实边界（未勾 / LEGACY）

| ID | 说明 |
| :--- | :--- |
| LEGACY-2026-018 | 数字孪生：仅有 2D `canvas-base`，无 3D 场景嵌入层 |
| LEGACY-2026-019 | 产品原型「设备框 Block」不在 §7.3 十二场景内，禁止伪造覆盖 |
| — | 看板指针拖拽引擎未自研（键盘按钮移动，见 `GAPS.md`） |
| — | 甘特非专用绘制基元；大任务量未虚拟化 |
| — | 19 语 Block 文案为 `_cuSkeleton`；禁止宣称「21 语 Blocks」 |
| — | Blocks 市场交易 → 运营期 |
| — | npm 上架 → 未做 |

## 门禁

```
corepack pnpm@9.15.0 phase7:gates
corepack pnpm@9.15.0 bench:genui
```

A7.1–A7.5 工程可测部分：见 `PHASE7.md` 看板勾选。冻结会 / 预算会未签（owner 待指定）。
