# 2026-08-15 · Theme quantification（工程可测量）

> Worker B · 0.1.9 commercial-essentials train  
> **关闭「主题还有 7 个没有量化」作为工程可测项。**  
> 禁止：手写识别率、宣称 Linear 对等、npm publish、改 package 版本（版本属 Worker A）。

机器可读清单：[`2026-08-15-theme-quantification.json`](./2026-08-15-theme-quantification.json)。  
盲测槽位：[`盲测结果.pending.json`](./盲测结果.pending.json)（Worker C；本报告 `recognition_rate` 一律 `null`）。

## 1. 测量口径

| 项 | 命令 / 路径 | 结果 |
| :--- | :--- | :--- |
| design-rules | `pnpm --filter @chameleon-ui/themes validate-rules` | **9/9** schema v1.0（8 官方 + community-focus-first） |
| S3 gzip | `node ./benchmarks/scripts/check-size.mjs "--only=S3"` | 8/8 ≤ 20 KB（dist 拼接后 gzip） |
| 回归基线 | `test-themes-regression.mjs --write-baseline` | 故意补齐 tribute overlay 后重写 |

## 2. S3 与清单（含 flagship 基线）

| Theme | Role | design-rules | forbiddenPatterns | S3 KB gzip | preview accent / surface | recognition_rate |
| :--- | :--- | :---: | ---: | ---: | :--- | :---: |
| line | flagship | 1.0 ✓ | 7 | **2.788** | `#171717` / `#f4f3ef` | `null` |
| silver-arrow | tribute | 1.0 ✓ | 7 | **3.314** | `#5c6b7a` / `#f8fafc` | `null` |
| stuttgart | tribute | 1.0 ✓ | 7 | **3.332** | `#bb0a30` / `#0f0f0f` | `null` |
| corsa | tribute | 1.0 ✓ | 7 | **2.879** | `#d40000` / `#ffffff` | `null` |
| cupertino | tribute | 1.0 ✓ | 5 | **3.339** | `#007aff` / `#f2f2f7` | `null` |
| siren | tribute | 1.0 ✓ | 7 | **3.025** | `#f5c400` / `#fff6c2` | `null` |
| wechat | tribute | 1.0 ✓ | 6 | **3.227** | `#07c160` / `#ededed` | `null` |
| ant-blue | tribute | 1.0 ✓ | 6 | **2.798** | `#1677ff` / `#f5f5f5` | `null` |

Token groups / surface layers / effects 字节见 JSON。每套均有非空 `tokens.json`、`effects.css`、`meta.json`（含 preview）。

## 3. 本切片补齐（非八套平均浅改旗舰）

仅补 **overlay 相对 design-rules / consume 明显缺的表面与运动/边宽叶子**，不把七套抬成第二 flagship：

- **silver-arrow / corsa / siren**：显式 `background.default|inverse`、`fg.default|inverse`、`border-width`、完整 blur/motion
- **cupertino**：`inverse` 表面、`fg.inverse`、motion、typography body
- **wechat**：`fg.inverse`、`blur.thick`、`border-width`
- **stuttgart**：blur/motion/border-width 补齐
- **ant-blue**：`typography.tracking`

`line` 保持唯一视觉旗舰；未做致敬主题深度重绘。

## 4. 工程结论

「主题还有 7 个没有量化」→ **对工程可测量项为 false**：七套致敬主题已落盘校验规则、完整 overlay 工件、S3 实测与 checklist。  
识别率仍为 **`null`**，直至 Worker C 完成盲测会话。
