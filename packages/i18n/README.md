# @chameleon-ui/i18n

**L1 · 共享 locale 标识、ICU MessageFormat、目录查找。不依赖任何 UI 框架。**

`i18n` 处理所有 `@chameleon-ui/*` 组件文案的**格式化与查找**。组件本身的文案位于各组件 `locales/` 目录，本包负责加载和格式化——它不是 Button/Input/Dialog 字串的第二份拷贝。

## API

| Export | 角色 |
| :--- | :--- |
| `PHASE_1_LOCALES` | 冻结 BCP 47 列表（4） |
| `PHASE_2_LOCALES` | 出片 BCP 47 列表（**21**，见 `src/locales.ts`） |
| `PSEUDO_LOCALE` | `en-XA` |
| `directionForLocale` | 由语言返回 `ltr` \| `rtl` |
| `createCatalog` / `getMessage` | 将嵌套 JSON 展平为 `Map` |
| `formatMessage` | ICU plural / select / 插值 |
| `expandPseudoMessages` / `validatePseudoExpansion` | 仅字面量 ≥140% 门禁 |
| `measureLiteralExpansion` | C10 扩展比（德语 / pseudo） |

## 关键约定

- **热路径是 `Map`（C3，期望 O(1)）**。不要在格式化时线性扫描语言包。
- 伪本地化 `en-XA` 仅扩展 **ICU 字面量节点**到 ≥140%。不要对整个 message 对象做 `replaceAll`。
- **语言与方向**由 locale 决定：文档 `lang` + `dir` 来自 locale；RTL 语言包括 `ar`、`ug`、`ur`、`fa`。用 `directionForLocale`，不要自行猜测 `dir`。

## 测试

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/i18n test
```
