# Phase 9 · 硬化与发布看板（第二期收口）

> 完整目标卡见 [`../docs/project/phases/Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md)。  
> 第二期总览：[`../docs/project/phases/Phase-2-Overview.md`](../docs/project/phases/Phase-2-Overview.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 看板（据树同步 2026-08-15 · 0.1.9 honesty）

```
P9  [ ] T9.1 R1–R3 实测 — 本地 Lighthouse 13.4.1 已跑（demo :4175/?view=suite；Fast 4G 模拟 + 4×CPU；非真机、非云 LHCI）。
        LCP/CLS 见生成物；INP navigation 无 numericValue → LEGACY-2026-002 仍开。
        001/003 = measured-local-lab。禁止手写分数。owner 待指定。
    [ ] T9.2 VPAT：artifact 仍 status=draft；publicationScope=published-internal；
        状态页 docs/project/reports/Phase-9-VPAT-status.md + /compliance/VPAT-status.md；
        Not a third-party CAB；commercialClaimsAllowed=false；PDF 二进制仍 LEGACY-2026-006；
        非 A9.2 正式 status=published。owner 待指定
    [ ] T9.3 npm 首发：未执行 npm publish；仅 publish:check 干跑
    [ ] T9.4 文档 21 语去骨架：未做（LEGACY-2026-004/005/017）
    [ ] T9.5 主题盲测：A9.5 = PROTOCOL-READY（非 waive）。harness `/?view=blind`；
        协议 + A9.5-decision.json + 盲测结果.pending.json status=not_run rate=null。
        真人未跑，禁止宣称 ≥80%（LEGACY-2026-008）；看板保持未勾选
    [ ] T9.6 口号核对表逐行挂证据；M9 收口报告 — 未做
    [x] phase9:gates 含盲测 pending 诚实性 + VPAT status 页 + lhci / VPAT 文件 / 缺口表 / publish:check 干跑
    [ ] ci:phase9 完整本机绿（= ci:phase8 + phase9:gates）— 脚本已加；本切片只跑 phase9:gates，未复跑 ci:phase8
```

## 命令

```
corepack pnpm@9.15.0 perf:lhci        # 本地 Lighthouse；失败则写 unmeasured 生成物，禁止手写分数
corepack pnpm@9.15.0 publish:check    # 干跑；不执行 npm publish
corepack pnpm@9.15.0 phase9:gates     # 生成物诚实性 + 盲测 PROTOCOL-READY + VPAT status + 缺口表 + publish:check
corepack pnpm@9.15.0 ci:phase9        # = ci:phase8 + phase9:gates
```

生成物：`benchmarks/reports/lhci-latest.json` · `docs/project/reports/Phase-9-Lighthouse-R1-R3.md`  
诚实门禁：`docs/project/reports/A9.5-decision.json` · `Phase-9-VPAT-status.md`  
主题量化（Worker B，工程可测量 ≠ 认出率）：`docs/project/reports/2026-08-15-theme-quantification.md`（`recognition_rate=null`）

## 红线

- 禁止手写 Lighthouse 分数；报告一律为生成物（配置入库、口径可查）。
- VPAT 注明审计方身份；published-internal 草稿禁止暗示第三方认证或商用无障碍宣称。
- 缺口表未清前，README/站点不得宣称「21 语文档」。
- 「一眼认出 ≥80%」无真人盲测证据不得出现。A9.5 = PROTOCOL-READY ≠ 已测；禁止把 pending 的 `rate` 改成手写数字。

## 明确未做（禁止伪造）

- 新组件 / 新主题（本阶段只硬化）
- T1–T7 治理复核执行（运营期机制；本阶段只交接输入）
- chameleon-ui.dev 托管未决议前不得宣称站点上线
- npm publish / provenance / 三通道安装复跑取证
- VPAT A9.2 正式 status=published、第三方认证、法务签署
- 物理中端安卓 + 云 LHCI
- INP P75（本次 navigation 模式无 numericValue；未把 TBT 冒充 INP）
- 21 语文档去骨架、主题盲测真人聚合、书面放弃函、M9 收口报告

## 合入检查

- [ ] 每条对外宣称可点进生成物
- [ ] LEGACY 续期单含 owner + ETA
- [ ] 口号核对表每行：证据链接或「不宣称」
- [ ] 运营移交单更新（沿用 M4 框架）

## 其它阶段

| 阶段 | 文档 |
| :--- | :--- |
| Phase 0–4（建设期） | [`PHASE0.md`](./PHASE0.md) … [`PHASE4.md`](./PHASE4.md) |
| Phase 5 | [`Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md) |
| Phase 6 | [`Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md) |
| Phase 7 | [`Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md) |
| Phase 8 | [`Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md) |
| Phase 9 | [`Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md) |
