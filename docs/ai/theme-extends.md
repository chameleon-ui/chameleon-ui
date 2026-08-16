# 主题 `$extends`（编译期）

派生主题可以在 `tokens.json` 里声明 DTCG `$extends`。解析发生在构建期，产物仍是静态 CSS，没有运行时继承。

## 用法

只存增量。`$extends` 是字符串或路径数组，相对主题目录解析：

```json
{
  "$extends": "../../src/linear/tokens.json",
  "radius": { "md": { "$value": { "value": 2, "unit": "px" } } }
}
```

规则：

- 路径相对当前主题目录解析，逃逸出 `packages/themes` 是编译错误。
- 父级按数组顺序应用，派生文档最后生效。叶子覆盖，组深合并，叶子和组形状不匹配直接报错。
- 循环引用报错并打印链条（`start -> a.json -> b.json -> a.json`）。
- 最大继承深度 16。

`meta.json` 可以用 `extends` 字段记录继承链。

## 示例

`packages/themes/examples/linear-dense/` 派生自 `linear`，覆盖三个 radius 变量：

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/themes test
# 期望输出：$extends demo: linear-dense derives from line with 3 overridden variables
```

## 官方主题

八套官方主题（`linear`、`mercedes`、`porsche`、`ferrari`、`apple`、`tiktok`、`wechat`、`alipay`）保持自包含。`$extends` 面向派生和社区主题开放，官方集默认不切换为继承。

字节回归门禁：`scripts/test-themes-regression.mjs`（variables.css 和 tokens.resolved.json 对比基线）。会改变字节的管线改动需要显式 `--write-baseline` 并经过评审。

## theme-studio 导出

导出载荷形状：`$extends: <baseThemeId>` + `tokens: <增量>` + `removedTokenPaths`（删除操作无法仅靠 `$extends` 表达）。未编辑的导出是空增量对象。

## 回滚

移除 `$extends` 并补全完整 tokens，即回到自包含主题。
