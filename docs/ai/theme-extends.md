# DTCG `$extends` 主题继承（Phase 8 §3.7）

> 编译期解析，产物仍是静态 CSS（零运行时不破）。Owner：待指定。

## 用法

派生主题在 `tokens.json` 声明 `$extends`（字符串或数组），只存差量：

```json
{
  "$extends": "../../src/line/tokens.json",
  "radius": { "md": { "$value": { "value": 2, "unit": "px" } } }
}
```

- 引用相对当前主题目录解析，**禁止逃逸** `packages/themes` 根（编译器报错）。
- 合并语义：父级按数组顺序依次应用，派生文档最后覆盖；叶子覆盖、组深合并；叶子↔组 形状不兼容报错。
- 环引用报错并打印链路：`start -> a.json -> b.json -> a.json`。
- 继承链深度上限 16；解析 O(n)。

## 演示

`packages/themes/examples/line-dense/` 派生自 `line`，仅覆盖 3 个 radius 变量：

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/themes test
# → $extends demo: line-dense derives from line with 3 overridden variables
```

`meta.json` 用 `extends` 字段标注派生链。

## 回归与可 diff / 可回滚

- `scripts/test-themes-regression.mjs`：8 套官方主题产物（variables.css + tokens.resolved.json）对 2026-08-13 基线**逐字节**校验，进 `phase8:gates`；管线行为变更必须显式 `--write-baseline` 并过评审。
- 差量存储天然可 diff：`diffTokenTrees(base, derived)`（`apps/theme-studio/src/tokenDelta.ts`）计算叶子级差集。
- 可回滚：派生主题删除 `$extends` 并回填全量 tokens 即回到自包含形态；官方 8 主题仍保持自包含（默认未切换）。

## theme-studio 导出

导出 payload 改为 `$extends: <baseThemeId>` + `tokens: <delta>` + `removedTokenPaths`（`$extends` 语义不能表达删除，删除路径单列）。未被编辑时 delta 为空对象。

## 诚实边界

- 官方 8 主题**尚未**继承化改造（保持自包含 + 字节回归）；`$extends` 能力、派生演示、studio 差量导出已就绪，默认切换留待后续阶段评审。
