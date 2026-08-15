# Phase 2 · 开源发布看板（建设期）

> 完整目标卡见 [`../docs/project/phases/Phase-2-开源发布.md`](../docs/project/phases/Phase-2-开源发布.md)。  
> 收口报告：[`../docs/project/reports/M2-开源发布验收.md`](../docs/project/reports/M2-开源发布验收.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 同步说明 2026-08-15（合入检查 ci:phase2 工程链）

本切片复跑 `phase2:gates`（bench + docs:build + publish:check）绿。完整 `ci:phase2`(=ci:phase1+gates) **未整链绿**：`phase1:gates` 卡在官方 VR Playwright（截图/超时）；`phase2:gates` 本身可独立绿。本地 Lighthouse lab 已复跑入库（R1/R3 measured-local-lab；R2 INP 仍 unmeasured）— **不是**真机/云 LHCI。公网 npm / 盲测 / 真机 LHCI 仍 blocked。

## 同步说明 2026-08-15b（工程 CI 稳定化）

Windows 长链补了 CRLF 归一、docs ContractDoc cast、German expansion、stylelint 排除 `apps/docs/dist`、turbo test concurrency=1 等；`phase2:gates` + `phase9:gates` + `perf:lhci` lab 绿。完整 `ci:phase1`/`ci:phase9` 仍被 VR 全量窗口挡住。

## 同步说明 2026-08-14

对照树做诚实勾选：文档站 UI **有意**收成 **zh-CN / zh-HK / en** 三语（不再假装 21 语文档站；产品 ICU 仍 21）。catalog 已扩到 **101**（Phase 2 带曾为 45–50）。本切片补了 P6 六枚 A/B slug 的 registry 同步、`docs:build`、Bench 报告拷入 `static/bench/` 并从侧栏/MDX 链接、`phase2:gates` 改为先 `bench:genui` 再 docs build。未 npm publish、未托管 chameleon-ui.dev、未伪造 Lighthouse、未签署 VPAT、未做盲测。Owner 一律 **待指定**。未 git commit。

## 同步说明 2026-08-13

看板此前已有工程本地勾选与命令，但仍缺红线 / 明确未做 / 合入检查，且其它阶段未链到 PHASE5–9，相对 PHASE5+ 偏薄。本次按 P5+ 骨架补齐章节，勾选仍以 M2 关闭时为准（公网 npm / R1–R3 / 盲测三条保持 `[ ]`）。**这是文档同步，不是重新验收或重关 M2。** Owner 一律 **待指定**。未补缺件，未 git commit。

## 看板

```
P2  [x] apps/docs（Docusaurus 3 + MDX；文档站 UI = zh-CN / zh-HK / en，有意取代 21 语文档站；产品 ICU 仍 21；8 主题）
    [x] apps/internal-demo（选择器 21 Locale + 8 主题）
    [x] catalog.json 101（Phase 2 带 45–50 已满足后扩面）+ registry 101×8（install-core 唯一写盘）
    [x] benchmarks/genui-bench（真实 install-core；本机跑通；generation_quality 诚实 null）
    [x] LICENSE MIT + CONTRIBUTING + SECURITY
    [x] publishConfig / publish:check（不执行 npm publish）
    [x] 公开 schema 本地路径 /schemas/component-contract/v0.1.json（v0.2 亦拷贝；公网未部署）
    [x] phase2:gates 本切片绿（2026-08-15 复跑：bench + docs 3 语 build + publish:check）；完整 ci:phase2=ci:phase1+gates 仍 **blocked by** phase1 VR Playwright 全量窗口
    [ ] 公网 npm / chameleon-ui.dev 托管 — **blocked by** owner「先不上架」+ npm E403 2FA；见 A9.3-npm-deferred.md（本仓只 publish:check）
    [ ] R1–R3 Lighthouse（禁止伪造）— **partial**：本地 lab 已入库（→ P9 T9.1；R1/R3 measured-local-lab；R2 INP open）；**blocked by** 真机/云 LHCI + INP navigation 口径（禁止宣称真机）
    [x] 主题致敬：项目所有者 2026-08-13 确认无法律问题（免费官方主题；非律所意见书）
    [ ] 盲测 / 「一眼认出 ≥80%」（禁止宣称）— **blocked by** ≥5 真人盲测聚合；harness `/?view=blind` + pending `rate=null`；禁止手写 %。Owner 待指定。
```

## 命令

```
corepack pnpm@9.15.0 docs             # http://127.0.0.1:5176  Docusaurus + MDX（默认 zh-CN）
corepack pnpm@9.15.0 docs:build       # collect + generate MDX + docusaurus build → dist/
corepack pnpm@9.15.0 demo             # http://127.0.0.1:5175 内测 Demo
corepack pnpm@9.15.0 bench:genui      # generation_quality 无模型时保持诚实 null
corepack pnpm@9.15.0 ci:phase1
corepack pnpm@9.15.0 ci:phase2        # = ci:phase1 + phase2:gates
corepack pnpm@9.15.0 phase2:gates     # bench:genui → docs:build → publish:check
corepack pnpm@9.15.0 publish:check    # 只打印计划，不执行 npm publish
```

## 红线

- Bench 数字由 harness 生成；禁止手写分数。`generation_quality` 无模型预算则保持 `null`。
- 未完成真人盲测，README/站点 **禁止**「一眼认出 ≥80%」。Harness（`/?view=blind`）存在 ≠ 已测；`盲测结果.pending.json` 的 `rate` 必须保持 `null`。
- 公开文档未宣称未做的回流/市场/Studio 能力（市场/Studio → P3/P4）。
- 写盘只经 `install-core`；docs CTA 不得第三套安装。
- `ci:phase2` 红灯不得宣传性发布；npm / 公网仍冻结。
- 不得把所有者主题确认写成律所意见书。
- 不得把文档站三语 UI 写成「21 语文档站」。
- 不得把 VPAT 草稿写成已认证 / 已签署。

## 明确未做（禁止伪造）

- 公网 npm / 公网 Registry / chameleon-ui.dev 托管（配置已齐，不代发、未托管）→ P9 T9.3
- R1–R3 Lighthouse 分数（`perf:lhci` 只打预算；→ P9 T9.1）
- 盲测 / 「一眼认出 ≥80%」（→ P9 T9.5；harness 已落地，真人结果 pending）
- 文档站 21 语 UI（**有意取代**：站点仅 zh-CN / zh-HK / en；产品 ICU 仍 21；→ P9 T9.4 若仍要营销 21 语）
- VPAT 仍 `status=draft`，Not certified / Not legally signed（→ P9 T9.2）
- 云 VR（待 2026-08-28 裁定；官方 VR 仍以 Demo AppShell+common-10 为准）
- Demo 画廊铺满 101 个交互预览（选择器 21×8；画廊仍是常用套）
- 文档站全部 slug 的 live preview（部分 preview-pending；金标 8 有 live）
- 若干非德/阿语 Locale 仍接近英文占位（文件齐，质量不宣称完成）
- 主题市场 / Studio Pro / MCP Apps（→ P3/P4）

## 合入检查

- [x] `phase2:gates` 本切片绿（2026-08-14 `pnpm phase2:gates` exit 0）：harness 101×8 全 rate=1、`generation_quality=null`（`generatedAt=2026-08-14T01:48:12.430Z`）；Docusaurus 三语 `docs:build` 成功；`publish:check` 干跑 `npmPublish: false`
- [x] schema 本地路径稳定且版本可见（`/schemas/component-contract/v0.1.json` + v0.2 已进 `dist/`）；公网 `chameleon-ui.dev` 未部署
- [x] Bench 数字可复现、由 harness 生成（`generation_quality` 诚实 `null`）；文档站链接 `pathname:///bench/latest.json` · `latest.md` · `report.html`（侧栏同 JSON）
- [x] 公开文档未宣称未做的回流/市场能力；未宣称 21 语文档站
- [ ] 公网 npm / chameleon-ui.dev — **blocked by** 先不上架 / E403；不挡工程本地 M2
- [ ] R1–R3 真采样 — **blocked by** 真机/云 LHCI；本地 lab ≠ 真机；不挡工程本地 M2
- [x] 完整 `phase2:gates`（bench + docs:build + publish:check）— 2026-08-15 复跑绿；完整 `ci:phase2`(=ci:phase1+gates) 仍 **blocked by** phase1 VR Playwright（非脚本缺失）

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
| **AI 能力体系收口轨道（A1–A6 + B1–B4）** | [`AI能力体系-A1-A6-收口轨道.md`](../docs/project/phases/AI能力体系-A1-A6-收口轨道.md) |
