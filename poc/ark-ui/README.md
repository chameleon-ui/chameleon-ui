# @chameleon-ui/poc-ark-ui

Phase 0 的 Ark UI 隔离沙箱，用同一组公开 API 验证 Button、Input 与 Dialog，并演示 ICU MessageFormat（插值、复数、选择）、按 ICU 字面节点自动补齐至少 40% 的 `en-XA`、LTR / RTL 和 390 / 768 / 1280 三端布局。

## 运行

先由工程负责人按仓库约定在 `chameleon-ui/` 安装依赖，然后运行：

```bash
corepack pnpm@9.15.0 poc:ark
```

固定地址：`http://127.0.0.1:4173/`（端口占用时直接失败，避免验收误连其它页面）。

独立校验：

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-ark-ui typecheck
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-ark-ui test
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-ark-ui build
```

专项测试会逐键校验 en/en-XA、ICU 参数与 plural/select 分支，并拒绝任何可见分支低于 140% 的伪本地化输出。

## Phase 0 边界

- `Dialog` 的焦点陷阱、Escape 关闭和焦点归还来自 Ark UI / Zag.js，不自研焦点算法。
- 样式消费 `@chameleon-ui/tokens/css` 的 `--cu-*` 变量；fallback 仅保证 POC 在 Token 构建异常时仍可诊断。
- 本包不发布、不发送遥测、不包含 `data-ai-*` 假能力。
- `// @phase-1 migrate → packages/components` 是迁移标记；正式组件将在 O1 裁定后重建于组件包。
- Phase 1 的 `perf:size` / `perf:lhci`、Locale 正式包路径与 `data-ai-*` 均只做文档预留，本阶段未实现。

## 手工焦点回归

1. 用 Tab 聚焦“打开对话框”，按 Enter。
2. 确认焦点进入对话框；Tab / Shift+Tab 不越出对话框。
3. 按 Escape 关闭，确认焦点返回原触发器。
4. 以 Space 再次打开，使用关闭按钮退出并再次确认焦点归还。

Ark UI 的 Dialog 遵循 WAI-ARIA Dialog 模式；上述步骤是 Phase 0 的 U2 / U3 演示级人工证据，不代表全量 WCAG 审计。
