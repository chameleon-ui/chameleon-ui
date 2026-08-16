# ADR-0001：包管理器选 pnpm，编排层用 Turborepo

- 状态：已接受
- 日期：2026-08-16

## 背景

仓库是 22 个内部包的 monorepo，React 和 Vue 双框架并行，包间用 `workspace:*` 互引。npm 发布前靠 umbrella tarball（`scripts/pack-external.mjs`）和 `npm link` 分发给消费者。现状：corepack 钉死 `pnpm@9.15.0`，Turborepo 2.10 负责任务编排，Node ≥ 20.19。

候选工具：pnpm、npm workspaces、Yarn Berry (PnP)、Bun、Deno。

## 决策

包管理器用 pnpm，任务编排用 Turborepo。两者职责不重叠：pnpm 管依赖图和安装，Turbo 管构建缓存和并行。

选 pnpm 的四个原因：

1. `workspace:*` 的 pack 语义。`pnpm pack` 会把 `workspace:*` 改写成真实版本号，tarball 分发链路依赖这个行为。
2. 严格的依赖隔离。非扁平 `node_modules` 会暴露幽灵依赖。22 个包每个都可能被消费者单独安装，隔离性是质量保险；双框架仓库里"React 包误引 Vue 侧依赖"这类问题会被直接挡住。
3. 生态现状。Vue、Vite、Element Plus、Radix、Turborepo 自身都用 pnpm，消费者侧 `npm install <tarball>` 的兼容性也最好。
4. corepack 钉版已经在用，可复现性没有问题。

## 已否决的备选

| 工具 | 否决理由 |
| :--- | :--- |
| npm workspaces | 不支持 `workspace:*` 及其 pack 改写；依赖提升不可控，幽灵依赖多 |
| Yarn Berry (PnP) | 与 Vite / TS 有部分生态摩擦；相对 pnpm 没有迁移收益 |
| Bun | 安装速度快一个量级，但三个风险：pack/publish 语义与 npm 有边界差异，而 tarball 是本库的主分发渠道；peer 解析差异可能掩盖版本冲突；CI 生态和招聘面。可以做实验分支，不进主链路 |
| Deno | 面向非 npm 生态，和 UI 组件库的消费场景（Vite + npm 包）不匹配 |

## 后果

正面：依赖图可信，tarball 分发可用，与消费者工具链没有摩擦。

代价：pnpm 的严格性会让"能跑但依赖未声明"的代码直接失败。这是预期行为，不要用 `shamefully-hoist` 之类的选项绕过。

## 重估条件

演进方向在 pnpm 之上，不是替换 pnpm：

- Changesets：22 包联动的版本和 changelog 管理，上 npm 前需要。
- pnpm catalogs + syncpack：peer 版本（`@ark-ui/*`、`intl-messageformat` 等）目前靠文档维持一致，应改成机器可校验。
- Turbo 远程缓存：多人和 CI 场景收益明显。
- pnpm 10：观察中，不急；迁移时注意 lockfile 升级。
- Bun 若解决了 pack 语义和 peer 解析的边界问题，可以重新做 spike。
