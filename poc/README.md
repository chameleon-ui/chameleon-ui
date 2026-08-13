# poc/

Phase 0 基元对比沙箱。**不发布、不进正式包。**

| 目录 | 路线 |
| :--- | :--- |
| [ark-ui](./ark-ui/) | Ark UI · Button / Input / Dialog |
| [base-ui](./base-ui/) | Base UI · 同上 |
| [e2e](./e2e/) | 真浏览器全矩阵：两线 × locale × direction × 三端 × Dialog |

跑：`pnpm poc:ark` / `pnpm poc:base`（在工程塔根）。全检：`pnpm --filter @chameleon-ui/poc-e2e test`。对比结论写入 M0 报告后，选定路线填入 `packages/primitives`。
