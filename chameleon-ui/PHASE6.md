# Phase 6 · 组件广度看板（第二期）

> 完整目标卡见 [`../docs/project/phases/Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md)。  
> 第二期总览：[`../docs/project/phases/Phase-2-Overview.md`](../docs/project/phases/Phase-2-Overview.md)。  
> 目录注解：[`STRUCTURE.md`](./STRUCTURE.md)。

## 同步说明 2026-08-14

本切片关闭 **code-closable** 余项：`ci:phase6` / `phase6:gates` 落地；`budgets.json` 增 F/G 行并用 `check-size` **实测 gzip**（未发明限额，门限沿用 S1 8KB / S2 60KB）；catalog 101 slug 均从 `packages/components/src/index.ts` 导出；internal-demo gallery 按 catalog 八族渲染（含 DataGrid 1 万行与 Canvas 2D 小地图/吸附）；Vue 子集 **22** SFC，S1 同口径写入 `docs/project/reports/Phase-6-Vue-S1.json`；F/G/H 各抽 1 slug（chart / canvas-base / editor）拍 390/768/1280 × en/ar 实拍 PNG。Owner 一律 **待指定**。未 git commit。未 npm publish。未签冻结会/预算会/Vue 范围单。未把 19 语骨架冒充译完。

上一则「据树同步 2026-08-13」已过期：A/B 六件与 Vue≥20 当时未勾，树里其实已在。

## 看板（据树同步 2026-08-14）

```
P6  [x] F 可视化 ×6：chart / kpi-dashboard / ticker / sparkline / heatmap / gauge — tsx+test+contract+21语；catalog v2.0
    [x] G 画布 ×7：canvas-base（导出 Canvas，非 slug `canvas`）/ flow-node / edge / mind-map / graph-view / pipeline-view / canvas-toolbar
    [x] H 内容协作 ×7：editor / markdown-renderer / comment-thread / chat-bubble / code-block / article-card / share-panel
    [x] A 补 ×3：space / container / masonry — src 目录+contract v0.2+21语+单测+index 导出+catalog n=97/98/100
    [x] B 补 ×3：navbar / steps / command-palette — 同上；catalog n=96/99/101
    [x] C 补 ×10：password-input / otp-input / multi-select / rating / date-picker / time-picker / calendar / color-picker / search-bar / upload
    [x] D 补 ×7：data-grid / tag / statistic / timeline / tree / image / carousel — S2 含 data-grid；gallery 万行演示
    [x] E 补 ×4：notification / confirm-dialog / result / loading-bar
    [x] catalog v2.0 写入 — schemaVersion 2.0，101 unique slug（50+P5×4+P6×47）；冻结会未签（owner 待指定）
    [x] Vue 子集 ≥20 — 22 SFC（alert/avatar/badge/button/card/checkbox/dialog/form/grid/input/popover/progress/radio/select/spinner/stack/switch/table/tabs/textarea/toast/tooltip）；非 101 Vue 端口
    [x] ci:phase6 = ci:phase5 + phase6:gates — 脚本已落地；本机 `phase6:gates` 绿
```

DoD A6.1–A6.7（目标卡 §10–12；工程可测 vs 会议签字分开）：

```
    [x] A6.1 工程侧 MET — 愿景点名 slug 均在 catalog（G 基座为 canvas-base）；changeLog 有 P6 两批 add；冻结会未签
    [ ] A6.2 全 47 过标准工序 — contract+21语+单测+S1/S2+data-ai 在；47 件全量三断点快照未铺（仅 F/G/H 各 1 件样本 VR）
    [x] A6.3 MET — gallery `[data-demo=data-grid-10k]` 1 万行；S2 data-grid 1.146 KB gzip ≤60；CI 经 perf:size / phase6:gates
    [x] A6.4 MET — chart/styles.css 只消费 --cu-color-* / color-mix，无硬编码 hex 系列色
    [x] A6.5 MET — gallery canvas-base：Canvas 2D + showMinimap + snapToGrid + toolbar；禁止宣称 WebGL
    [x] A6.6 工程侧 MET — Vue 22≥20；S1 gzip 全 ≤8KB，记录入库；范围单未签
    [x] A6.7 工程侧 MET — ci:phase6 = ci:phase5 + phase6:gates（catalog 101 + v0.2 + 族映射 + S2/F/G gzip + Vue≥20 + Vue S1 + lint）
```

## 命令

```
corepack pnpm@9.15.0 phase6:gates
corepack pnpm@9.15.0 ci:phase6          # = ci:phase5 + phase6:gates
corepack pnpm@9.15.0 --filter @chameleon-ui/internal-demo test
corepack pnpm@9.15.0 --filter @chameleon-ui/docs test
corepack pnpm@9.15.0 --filter @chameleon-ui/visual-regression exec playwright test tests/p6-family-sample.spec.ts
node ./benchmarks/scripts/check-size.mjs "--only=S2,F,G"   # PowerShell 必须给 --only= 加引号
node ./benchmarks/scripts/check-vue-size.mjs
```

## 红线

- DataGrid / F / G 预算条目未进 `benchmarks/budgets.json` 前不得合入 — **条目已进**；修订会仍未签，禁止把 recordedKbGzip 说成会签限额。
- 每个新组件走标准工序全量。47 件的三断点快照未铺满，禁止宣称 A6.2 全绿。
- 21 语文件齐；除 zh-CN / en / de / ar 外，大量 locale JSON 与 `en.json` 字节相同（骨架）。禁止宣称 21 语译完。

## 明确未做（禁止伪造）

- catalog v2.0 / 预算修订 / Vue 范围 / 砍单顺序 / Chart·Editor 选型 **冻结会签字**（owner 待指定）
- 47 新组件全量 390/768/1280 快照（仅 chart、canvas-base、editor 样本 18 张 PNG）
- 19 语翻译质量（phase6:gates 计 1309 个文件与 en 字节相同；zh-HK/ja/ko 等各 77）
- Vue 101 端口（目标卡只要 ≥20）
- Blocks（→ P7）；G 族 WebGL / Worker / LOD（本期 Canvas 2D）
- R1–R3 实测（→ P9）
- `docs/project/reports/M6-组件广度验收.md` 作为里程碑关闭函（未写、未签）
- npm publish

## 合入检查

- [x] 新组件均有 catalog `changeLog` — P6 41 + A/B 6 两批 add；冻结会未签
- [x] F/G/H 每族至少一个组件过全工序 — chart / canvas-base / editor：contract+21语+单测+`p6-family-sample.spec.ts` 实拍 390/768/1280 × en/ar（6/6 复跑绿）。不是 47 件全铺
- [x] Vue 与 React 无第二份 Token 权威 — `components-vue` 只依赖 `@chameleon-ui/tokens` + `primitives-vue`
- [x] Chart 主题无硬编码色值（抽检）— `chart/styles.css` 只消费 `--cu-color-*`

## 其它阶段

| 阶段 | 文档 |
| :--- | :--- |
| Phase 0–4（建设期） | [`PHASE0.md`](./PHASE0.md) … [`PHASE4.md`](./PHASE4.md) |
| Phase 5 | [`Phase-5-三端内核.md`](../docs/project/phases/Phase-5-三端内核.md) |
| Phase 6 | [`Phase-6-组件广度.md`](../docs/project/phases/Phase-6-组件广度.md) |
| Phase 7 | [`Phase-7-场景Blocks.md`](../docs/project/phases/Phase-7-场景Blocks.md) |
| Phase 8 | [`Phase-8-AI阶梯收口.md`](../docs/project/phases/Phase-8-AI阶梯收口.md) |
| Phase 9 | [`Phase-9-硬化与发布.md`](../docs/project/phases/Phase-9-硬化与发布.md) |
