# Chameleon UI

AI-Native 设计系统（二十一语言 / 致敬主题 / 三端一体）。

## 布局

| 位置 | 内容 |
| :--- | :--- |
| **工作区根** `ChameleonUI/` | 项目文档、总控 README、logo |
| **工程塔** [`chameleon-ui/`](./chameleon-ui/) | Phase 0 瘦身 monorepo：`packages` · `poc` · `toolings` |

工程入口：[README](./chameleon-ui/README.md) · [STRUCTURE](./chameleon-ui/STRUCTURE.md)

## 文档

| 类型 | 文档 |
| :--- | :--- |
| **阶段目标（执行主卡）** | [docs/project/phases](./docs/project/phases/) — Phase 0–4 |
| **工程约定 / 命名** | [工程约定与命名规范](./docs/engineering/工程约定与命名规范.md) |
| **RTL / 图标镜像** | [RTL 与图标镜像工程规范](./docs/engineering/RTL与图标镜像工程规范.md) |
| **M0 技术验收** | [M0 基元 POC 与地基验收](./docs/project/reports/M0-基元POC与地基验收.md) |
| 工程目录（塔基） | [工程目录与文件结构说明书](./Chameleon%20UI%20—%20工程目录与文件结构说明书%20v1.0.md) |
| 架构 | [系统架构设计说明书 v1.0](./Chameleon%20UI%20—%20系统架构设计说明书%20v1.0.md) |
| 执行与验收（长文） | [详细设计与验收说明书 v1.0](./Chameleon%20UI%20—%20详细设计与验收说明书%20v1.0.md) |
| 立项 | [立项项目书 v1.0](./Chameleon%20UI%20—%20立项项目书%20v1.0.md) |

进当前阶段时优先打开对应 `Phase-N-*.md`，不必先通读全部上位书。

## 起步

需要 **Node ≥ 20.19** 与 **pnpm 9.15**（`packageManager` / `engines` 已声明；Node 18 会编译失败）。

```bash
cd chameleon-ui
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 ci:phase0
corepack pnpm@9.15.0 poc:ark
corepack pnpm@9.15.0 poc:base
```

## 当前阶段

**Phase 0**：技术 M0 已通过，选定 Ark UI；本地全检（含真浏览器矩阵）作为退出证据。预算与业务签字不纳入研发开工门禁。远期包延期创建，见 STRUCTURE「延期创建」。
