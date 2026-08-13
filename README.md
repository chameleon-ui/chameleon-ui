# Chameleon UI · 工程塔（Phase 0 瘦身）

> 本目录是 **pnpm + Turborepo monorepo 根**。  
> 上一级工作区只放项目文档；**勿在工作区根执行 `pnpm install`。**

## 这是什么

Chameleon UI 可运行工程。当前 **只保留 Phase 0 所需包**，远期目录见 [STRUCTURE.md](./STRUCTURE.md)「延期创建」，避免空壳干扰。

**Phase 0 目标**：见 [PHASE0.md](./PHASE0.md) 五日看板；完整阶段卡见 [`docs/project/phases/Phase-0-地基.md`](../docs/project/phases/Phase-0-地基.md)。

## 当前 workspace 成员

```
chameleon-ui/
├── packages/
│   ├── tokens/          # DTCG 权威源与确定性 CSS 编译
│   ├── themes/          # 主题 / rules（可极薄）
│   ├── contract/        # schema 草案（工具，非第二份组件正文）
│   ├── primitives/      # POC 后填实
│   ├── components/      # POC 后承接 React 组件
│   └── install-core/    # CLI/MCP 共享安装内核（占位，防分叉）
├── poc/
│   ├── ark-ui/
│   ├── base-ui/
│   └── e2e/             # Playwright 真浏览器全矩阵
├── toolings/            # eslint / stylelint / tsconfig / 视觉回归
├── README.md
├── STRUCTURE.md
└── PHASE0.md            # 五日作战单
```

**本阶段不在仓内**：`i18n` · `blocks` · `components-vue` · `registry` · `cli` · `mcp-server` · `apps/*` · `benchmarks/*`（Phase 到了再建）。

## 分层硬规则（仍适用）

| 层 | 包 | 规则 |
| :--- | :--- | :--- |
| L1 | tokens · themes · contract · primitives | **禁止** react / vue / svelte |
| L2 | components | 依赖 L1 |
| 安装 | install-core | 日后 cli / mcp **只依赖本包**，禁止各写一套 |

## 命令

```bash
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 ci:phase0
corepack pnpm@9.15.0 poc:ark  # http://127.0.0.1:4173
corepack pnpm@9.15.0 poc:base # http://127.0.0.1:4174
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-e2e test
```

Node 版本须为 `>=20.19.0`（Vite 8 的实际下限），pnpm 须为 `9.15.0`。M0 裁定、对比数据和 A0 证据见 [`../docs/project/reports/M0-基元POC与地基验收.md`](../docs/project/reports/M0-基元POC与地基验收.md)，下一阶段复现顺序见 [`../docs/project/reports/Phase-1-开工检查.md`](../docs/project/reports/Phase-1-开工检查.md)。

## 权威文档

- 五日目标与验收：[PHASE0.md](./PHASE0.md)  
- 仓内地图：[STRUCTURE.md](./STRUCTURE.md)  
- 工作区：《工程目录与文件结构说明书》
