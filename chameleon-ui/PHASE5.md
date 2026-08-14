# Phase 5 · 三端内核看板（第二期）

> 完整目标卡见 [`../docs/project/phases/Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md)。  
> 第二期总览：[`../docs/project/phases/Phase-2-Overview.md`](../docs/project/phases/Phase-2-Overview.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 同步说明 2026-08-13（A5.4 / SAFE-AREA VR + S1）

本切片关闭 A5.4 剩余项：safe-area 进入既有 VR morph 矩阵，并补独立 Playwright 快照；四 P5 slug 走 `perf:size` 实测 gzip。PNG 由 Playwright `--update-snapshots=changed` 实拍入库，无假 hash。Chromium 桌面无刘海，`env(safe-area-inset-*, 0px)` 计算值为 **0px**（契约 fallback / large 路径），快照拍的是这条路径，不是模拟 notch。Owner 一律 **待指定**。未 git commit。未改 catalog.json。未发明 Lighthouse。

上一则「A5.3 / 白名单变形」同步仍有效。design-rules v1.1 迁移单仍未签字（LEGACY-2026-004）。

## 看板（据树同步）

```
P5  [x] T5.1 断点 Token（mobile <768 / tablet 768–1279 / desktop ≥1280）进 tokens 编译产物
    [x] T5.2 密度阶梯 compact/standard/comfortable — density.json + density.css 已接入 docs/internal-demo/theme-studio/market + poc + components test setup + adapter-a2ui demo；`--cu-density-active` / `--cu-control-size-active` 随断点与 [data-density] 切换。design-rules v1.1 迁移单未签字（owner 待指定；themes 仍 spacious vs standard）→ 合入检查仍开
    [x] T5.3 流体排版（clamp）Token — tokens/src/core/typography.json；variables.css 发 --cu-typography-size-* clamp() 与 line-height；compiler 单测绿
    [x] T5.4 容器查询基础设施 + 11 个硬编码媒体查询组件改造 — 规范 + @container 白名单 + stylelint；A5.3 成对测试已补
    [x] T5.5 变形规则矩阵写入 contract.responsive（附录 C 四行起）— dialog / sidebar+tab-bar / table 已写；DatePicker 行为 P6 组件在，契约未对齐附录 C「底部弹出」
    [x] T5.6 新组件 ×4：action-sheet / tab-bar / safe-area / sidebar — tsx + contract + 21 语 + 单测 + VR；safe-area 无断点变形，独立 VR 拍 wrapper + 0px fallback + ar RTL 文案
    [x] T5.7 输入模态：hover 门控在；`--cu-touch-target-min`=2.75rem→44px@16px 测量记录入库（清单 15/15）。新组件 tap 面过线。改造清单 checkbox/select/switch/radio 仍硬编码 2.25rem=36px，未改 P6，不宣称 100% ≥44px。虚拟键盘演示页保持。无 Lighthouse
    [x] T5.8 VR 矩阵扩展 — P5 白名单 app-shell/dialog/table/action-sheet/sidebar/tab-bar/safe-area × {390/768/1280} × {en ltr, ar rtl} 已进 visual-regression（p5-whitelist-morph.spec.ts + safe-area.spec.ts + 实拍 PNG）。POC Ark 对照仍保留
    [x] ci:phase5 = ci:phase4 + phase5:gates — 脚本已落地；A5.3/T5.8/A5.4 Playwright 走 phase1:gates 的 visual-regression；phase5:gates 校验点名 spec 文件存在（含 safe-area.spec.ts）
```

DoD A5.1–A5.7（目标卡 §10–12）：

```
    [x] A5.1 MET — dist/css/variables.css 含 --cu-breakpoint-* / --cu-density-* / --cu-typography-size-* clamp()；token 编译测试 expected.css
    [x] A5.2 MET — chameleon/no-breakpoint-literal 进 phase1:gates 且 phase5:gates 复跑组件 CSS 绿；§0.5 十一件无视口 width @media
    [x] A5.3 MET — container-driven.test.tsx（CSS 接线 + 成对 host）+ container-driven.spec.ts（窄容器+宽视口 / 宽容器+窄视口，容器胜出；实拍 PNG）
    [x] A5.4 MET — 四组件 contract/21语/单测在；390/768/1280 × en ltr + ar RTL VR（morph + safe-area 独立快照，Playwright 12/12 复跑绿）；S1 本切片重测四 slug 均 ≤8KB gzip：action-sheet 2.134 / tab-bar 1.470 / safe-area 0.336 / sidebar 1.341。SafeArea 无断点变形；桌面 Chromium inset 为 0px fallback，未宣称拍到刘海
    [x] A5.5 MET — 契约行已写；Dialog/Navigation/Table 在 390/768/1280 的 computed-style + 实拍 PNG 与 contract.responsive 一致（lab=native）
    [x] A5.6 MET — 测量记录入库且覆盖本期清单 15/15：docs/project/reports/Phase-5-触控目标测量.md（+ .json）。Token 地板 2.75rem=44px@16px。checkbox/select/switch/radio 记为 below-floor 36px，不宣称全清单 ≥44px
    [x] A5.7 MET — ci:phase5 = ci:phase4 + phase5:gates；容器/morph/safe-area 快照 Playwright 在 phase1:gates；phase5:gates 另检 A5.3/T5.8/A5.4 spec 文件
```

## 命令

```
corepack pnpm@9.15.0 --filter @chameleon-ui/components exec vitest run src/test/container-driven.test.tsx
corepack pnpm@9.15.0 --filter @chameleon-ui/internal-demo build
corepack pnpm@9.15.0 --filter @chameleon-ui/visual-regression exec playwright test tests/container-driven.spec.ts tests/p5-whitelist-morph.spec.ts tests/safe-area.spec.ts
corepack pnpm@9.15.0 --filter @chameleon-ui/visual-regression exec playwright test --update-snapshots=changed tests/safe-area.spec.ts tests/p5-whitelist-morph.spec.ts
corepack pnpm@9.15.0 perf:size
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens test
corepack pnpm@9.15.0 phase5:gates
corepack pnpm@9.15.0 ci:phase5          # = ci:phase4 + phase5:gates
corepack pnpm@9.15.0 measure:touch-targets
```

## 红线

- 三端能力只落 Token / 契约 / CSS，不进组件运行时 JS。
- 容器查询降级策略未验证前，禁止对外宣称「三端一体」。
- 密度枚举 v1.1 迁移单未签字，不得强推、禁止伪签。
- 触控 44px 与容器查询均限本期清单；checkbox/select/switch/radio 仍 36px，禁止宣称全库达标。
- R1–R3 仍 LEGACY 未测；本阶段性能话术仅限体积门禁，禁止发明 Lighthouse。
- SafeArea VR 不冒充 notch/home-indicator 像素；本机 Chromium 拍到的是 0px fallback。

## 明确未做（禁止伪造）

- F/G/H 族、Blocks、AG-UI、data-ai-intent 铺开（→ P6–P8）
- R1–R3 实测（LEGACY-2026-001…003 仍开，→ P9）
- 容器查询降级策略未验前，禁止宣称「三端一体」
- 触控 44px 限本期清单；checkbox/select/switch/radio 仍 36px，禁止宣称全库达标
- design-rules v1.1 未签字，禁止伪签
- DatePicker 附录 C「底部弹出」契约对齐仍待 P6
- 未模拟设备刘海；禁止把 0px fallback 快照说成 inset 实测

## 合入检查

- [x] 组件 CSS 无新增断点字面量（stylelint）— 规则在；当前 components CSS 无视口 width @media；phase5:gates 复跑绿
- [x] 容器查询改造有成对快照（容器驱动证据）— A5.3：`container-driven.spec.ts` 窄容器+宽视口 / 宽容器+窄视口实拍 PNG + 单元 CSS 接线
- [x] catalog `changeLog` 含本阶段 4 条记录
- [ ] 密度枚举迁移单已签字 — 草稿在规范 §3（LEGACY-2026-004），冻结会未签；owner 待指定

## 其它阶段

| 阶段 | 文档 |
| :--- | :--- |
| Phase 0–4（建设期） | [`PHASE0.md`](./PHASE0.md) … [`PHASE4.md`](./PHASE4.md) |
| Phase 5 | [`Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md) |
| Phase 6 | [`Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md) |
| Phase 7 | [`Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md) |
| Phase 8 | [`Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md) |
| Phase 9 | [`Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md) |
