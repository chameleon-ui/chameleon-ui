# Phase 4 · v2.0 看板（建设期）

> 完整目标卡见 [`../docs/project/phases/Phase-4-v2.0.md`](../docs/project/phases/Phase-4-v2.0.md)。  
> 收口报告：[`../docs/project/reports/M4-v2.0建设收口.md`](../docs/project/reports/M4-v2.0建设收口.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 同步说明 2026-08-13

看板此前已有运行说明 / 红线 / 明确未做 / 合入检查，但章节名与 PHASE5+ 不完全对齐（「本阶段工程物」「测试 / 门禁」而非「看板 / 命令」），且缺少其它阶段链接。本次按 P5+ 骨架重排，勾选仍以 M4 关闭时为准（P4 九条与合入检查全 `[x]`；R1–R3 / 盲测 / VPAT 认证等留在明确未做）。**这是文档同步，不是重新验收或重关 M4。** Owner 一律 **待指定**。未补缺件，未 git commit。

## 看板

```
P4  [x] 主题市场：浏览 / 详情 / 安装 / 上架申请（community- 前缀）
    [x] 纪律包：community-focus-first 可列出并经 install-core 安装（registry:rules）
    [x] 致敬 8 套免费上架（付费 SKU 拒绝 homage_paid_zone；市场可有社区付费条目）
    [x] MCP Apps：SEP-1865 Final → 独立 adapter POC + form-submit demo（不进 L1）
    [x] 文档 21 语 chrome 骨架（en/zh-CN 撰稿；其余英文 ICU `_cuSkeleton`）+ 缺口表
    [x] VPAT 草稿上文档站 status=draft（非 certified）
    [x] 全量性能/a11y 审计；R1–R3 未测 → LEGACY-2026-001…003
    [x] 北极星看板只读消费 bench.* / telemetry.*（空态合法）
    [x] 《建设期移交说明书》；运营接收人=待指定
    [x] ci:phase4 = ci:phase3 + phase4:gates（含 market-service + rules 测试）
```

## 命令

```
corepack pnpm@9.15.0 market           # UI http://127.0.0.1:5178 · API http://127.0.0.1:8788
corepack pnpm@9.15.0 docs             # http://127.0.0.1:5176  Docusaurus + MDX
corepack pnpm@9.15.0 studio           # http://127.0.0.1:5177
corepack pnpm@9.15.0 demo             # http://127.0.0.1:5175
corepack pnpm@9.15.0 phase4:gates
corepack pnpm@9.15.0 ci:phase4        # = ci:phase3 + phase4:gates；ci:phase3 定义未改
```

下列不是根别名，但是 P4 门禁复现命令且对应包 `scripts` 存在：

```
corepack pnpm@9.15.0 --filter @chameleon-ui/market-service test
corepack pnpm@9.15.0 --filter @chameleon-ui/market test
corepack pnpm@9.15.0 --filter @chameleon-ui/adapter-mcp-apps test
```

安装链路：`apps/market` → `POST /api/v1/listings/:id` → `packages/market-service` → `@chameleon-ui/install-core`（`createInstallKernel`）→ 磁盘写入。`source` 固定为 `market`。`CU_REGISTRY_URL` / `CU_REGISTRY_TOKEN` 仍可用于 CLI/MCP。目录 `GET /v1/listings?type=registry:rules` 列出纪律包；种子含 `community-focus-first`（写盘 `rules/community-focus-first/{design-rules,meta,tokens}.json`）。

检测流水线插件：`checkRules` · `checkRtl` · `checkLicense` · `checkA11y`。`human-review` 预留，默认关。

## 红线

- 社区上架 id 必须以 `community-` 开头。
- 官方 8 套致敬主题 id（`line` · `silver-arrow` · `stuttgart` · `corsa` · `cupertino` · `siren` · `wechat` · `ant-blue`）作为 **免费** 上架/出货，不得作为付费 SKU。市场本身允许社区付费条目。
- 写盘只经 `install-core`。市场服务不写项目文件。
- VPAT 草稿不得暗示 certified / 第三方认证。
- 缺口表未清前，README/站点不得宣称「21 语文档」。
- 北极星数值达标非 M4 硬门禁；空态合法。

## 明确未做（禁止伪造）

- 纪律包付费鉴权 SDK（核心库无；市场仅 `pricing` 标记；授权服务外置）
- R1–R3 Lighthouse 分数（→ P9 T9.1，LEGACY-2026-001…003）
- 盲测 / 「一眼认出 ≥80%」（→ P9 T9.5）
- VPAT 认证 / VPAT 法务签 / PDF 二进制（草稿已发布，status=draft；正式 published → P9 T9.2）
- 把官方 8 套致敬主题当作付费 SKU（它们是免费主题；市场仍可上架社区付费包）
- npm publish / chameleon-ui.dev
- 运营接收人指定与运营签收（接收人=待指定）
- MCP Apps 宿主认证 / 挂到 `mcp-server` 的 `ui://` / 双向 JSON-RPC（POC ≠ 生产宿主）
- 把营销页写成 21 语已完成（LEGACY-2026-005）

## 合入检查

- [x] 市场安装无旁路 `install-core`
- [x] 官方 8 套免费上架；付费 SKU 仅拒致敬 id；社区可付费
- [x] 社区上架 `community-` 前缀
- [x] `community-focus-first` 可浏览并安装
- [x] 检测流水线插件化
- [x] 根脚本 `pnpm market` + 本地 URL
- [x] `ci:phase4` 含 market-service + rules 门禁

## 其它阶段

| 阶段 | 文档 |
| :--- | :--- |
| Phase 0 | [`PHASE0.md`](./PHASE0.md) · [`Phase-0-地基.md`](../docs/project/phases/Phase-0-地基.md) |
| Phase 1 | [`PHASE1.md`](./PHASE1.md) · [`Phase-1-MVP.md`](../docs/project/phases/Phase-1-MVP.md) |
| Phase 2 | [`PHASE2.md`](./PHASE2.md) · [`Phase-2-开源发布.md`](../docs/project/phases/Phase-2-开源发布.md) |
| Phase 3 | [`PHASE3.md`](./PHASE3.md) · [`Phase-3-v1.0.md`](../docs/project/phases/Phase-3-v1.0.md) |
| Phase 4 | [`PHASE4.md`](./PHASE4.md) · [`Phase-4-v2.0.md`](../docs/project/phases/Phase-4-v2.0.md) |
| Phase 5 | [`PHASE5.md`](./PHASE5.md) · [`Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md) |
| Phase 6 | [`PHASE6.md`](./PHASE6.md) · [`Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md) |
| Phase 7 | [`PHASE7.md`](./PHASE7.md) · [`Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md) |
| Phase 8 | [`PHASE8.md`](./PHASE8.md) · [`Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md) |
| Phase 9 | [`PHASE9.md`](./PHASE9.md) · [`Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md) |
