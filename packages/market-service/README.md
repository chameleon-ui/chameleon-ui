# @chameleon-ui/market-service

**Phase 4 主题市场服务 · 社区主题与 `registry:rules` 纪律包。私有包，不发布 npm。**

`market-service` 是主题市场的后端服务：托管官方致敬主题与社区主题、纪律包，并做上架前校验。**它不直接写工程文件**——市场安装的唯一写盘边界是 `@chameleon-ui/install-core`。

## 职责

- 把 8 套官方致敬主题作为**免费** listing 上架。
- 承接社区主题 listing（`community-` 前缀，可免费或付费）。
- 列出并安装纪律包（`type=registry:rules`），含种子 `community-focus-first`。
- 运行上架校验流水线：`checkRules` · `checkRtl` · `checkLicense` · `checkA11y`。
- **拒绝**把官方致敬 theme id 作为**付费 SKU** 提交（它们保持免费）；社区团内付费包允许。
- 每次安装都委托给 `@chameleon-ui/install-core`，`source: 'market'`。

## 命令

工作区根：

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/market-service build
corepack pnpm@9.15.0 --filter @chameleon-ui/market-service start
# http://127.0.0.1:8788
```

## API

| Method | Path | 作用 |
| :--- | :--- | :--- |
| GET | `/health` | 存活检查 |
| GET | `/v1/listings` | 浏览（`?type=registry:theme` 或 `registry:rules`） |
| GET | `/v1/listings/:id` | listing 详情 |
| POST | `/v1/listings/apply` | 提交一个 listing 供校验 |
| POST | `/v1/listings/:id` | 经 install-core 安装到 `targetDir` |

## 校验流水线

校验器是 `ListingValidator` 类型的插件式函数；默认流水线导出为 `defaultValidators`。可在不改 store/server 的前提下加新检查。

## 人工复核队列

store 支持 `humanReviewOnFailure` 选项：把失败的自动检查送回 `human-review` 状态（而非直接 `rejected`）。预留给运营启用，默认关闭。
