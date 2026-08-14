# @chameleon-ui/stylelint-config

Phase 0 的 RTL 方向属性门禁。配置使用 Stylelint 的语法树规则精确拒绝左右物理属性并引导到逻辑属性；`width` / `height` / `top` / `bottom` 等非左右方向属性不在本阶段误拦截。

当前阻止：

- `margin-left/right` → `margin-inline-start/end`
- `padding-left/right` → `padding-inline-start/end`
- `border-left/right*` → `border-inline-start/end*`
- `left/right` → `inset-inline-start/end`

## Phase 5：`chameleon/no-breakpoint-literal`

组件 CSS 禁止硬编码视口断点（Phase 5 A5.2）：

- `@media` 中出现宽度/高度尺寸查询（`min-width` / `max-width` / 区间语法 / 长度字面量）→ 拒绝，并提示改用 `@container` 或 tokens 的 `density.css`。
- `@container` 中出现冻结断点的 px 字面量（`768px` / `1280px`）→ 拒绝，提示用等值 rem（`48rem` / `80rem`）。
- `@media (prefers-reduced-motion …)`、`(hover: hover)` 等非尺寸查询不拦截。
- 规则经 `overrides` 仅作用于 `packages/components/**/*.css`、`packages/components-vue/**/*.css` 与本包 fixtures；tokens 包生成的 `density.css` 是断点字面量的唯一合法持有者。
- 逃逸口：`stylelint-disable` 注释 + `LEGACY-*` 单号。规范全文见 `docs/engineering/容器查询与三端规范.md`。

## 红绿验证

```bash
pnpm --filter @chameleon-ui/stylelint-config test
```

测试会断言 `fixtures/good.css` 通过、`fixtures/bad.css` 失败，而且错误包含文件、行列、物理属性及推荐逻辑属性。首次运行前需在 monorepo 根完成正常的 `pnpm install`。

每个 POC 的 `lint` 都直接扫描自身 `src/**/*.css`，根 `pnpm lint` / `pnpm check` 会编排这些任务。因此业务 CSS 变化会参与 Turbo 的输入哈希并让 Phase 0 CI 失败，而不只是在 fixtures 中演示。共享配置包自身只校验脚本与 fixtures，避免跨 workspace glob 沿 pnpm 链接重复扫回 bad fixture。

扫描复杂度为 O(c)，空间 O(e)，其中 c 是 CSS 字符数、e 是违规数；真正解析由 Stylelint 完成，不使用无界正则扫描源码。
