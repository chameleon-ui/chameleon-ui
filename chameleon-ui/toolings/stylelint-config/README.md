# @chameleon-ui/stylelint-config

Phase 0 的 RTL 方向属性门禁。配置使用 Stylelint 的语法树规则精确拒绝左右物理属性并引导到逻辑属性；`width` / `height` / `top` / `bottom` 等非左右方向属性不在本阶段误拦截。

当前阻止：

- `margin-left/right` → `margin-inline-start/end`
- `padding-left/right` → `padding-inline-start/end`
- `border-left/right*` → `border-inline-start/end*`
- `left/right` → `inset-inline-start/end`

## 红绿验证

```bash
pnpm --filter @chameleon-ui/stylelint-config test
```

测试会断言 `fixtures/good.css` 通过、`fixtures/bad.css` 失败，而且错误包含文件、行列、物理属性及推荐逻辑属性。首次运行前需在 monorepo 根完成正常的 `pnpm install`。

每个 POC 的 `lint` 都直接扫描自身 `src/**/*.css`，根 `pnpm lint` / `pnpm check` 会编排这些任务。因此业务 CSS 变化会参与 Turbo 的输入哈希并让 Phase 0 CI 失败，而不只是在 fixtures 中演示。共享配置包自身只校验脚本与 fixtures，避免跨 workspace glob 沿 pnpm 链接重复扫回 bad fixture。

扫描复杂度为 O(c)，空间 O(e)，其中 c 是 CSS 字符数、e 是违规数；真正解析由 Stylelint 完成，不使用无界正则扫描源码。
