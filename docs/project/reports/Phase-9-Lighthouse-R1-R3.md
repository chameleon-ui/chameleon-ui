# Phase 9 · Lighthouse R1–R3（生成物）

> **禁止手写分数。** 本文件由 `corepack pnpm@9.15.0 perf:lhci` 从 `benchmarks/reports/lhci-latest.json` 写出。
> 日期：2026-08-15T16:01:44.315Z
> 口径：simulated Fast 4G + 4x CPU (mid-tier Android lab stand-in)

## 状态

- artifact `status`: **measured**
- 未测原因：（无）
- 工具：lighthouse pin 13.4.1 · lighthouse@13.4.1 (resolved module)
- Lighthouse 版本：13.4.1
- Chrome：`C:\Program Files\Google\Chrome\Application\chrome.exe`
- Host：win32 x64 Node v24.15.0
- URL：`http://127.0.0.1:4175/?view=suite&locale=ar&theme=line`
- 真机 4×A76+4GB：否（实验室模拟）
- Cloud LHCI：否

## R1–R3

| ID | 预算 | 本次 | LEGACY |
| :--- | :--- | :--- | :--- |
| R1 LCP | ≤ 2500 ms | 663 ms (0.7 s) ≤ budget | measured-local-lab |
| R2 INP P75 | ≤ 200 ms | **未测** | open-unmeasured |
| R3 CLS | ≤ 0.1 | 0 (0) ≤ budget | measured-local-lab |

R2 说明：Navigation-mode Lighthouse often has no INP numericValue (no lab interaction). TBT is recorded as extra only — not used as INP.

TBT（非 R2）：9 ms。TBT is not R2. Do not treat TBT as INP.

## 类别分（非 R* 预算）

Lighthouse category score（0–100；axe 自动检查进 accessibility）。**不是** VPAT 认证，不是 AT 实验室。

- performance: 100
- accessibility: 100

## 其它 URL

- docs :4176 (not R1–R3 kit page): docs preview not running; not started (R1–R3 uses demo :4175).

## 诚实边界

- 未宣称 chameleon-ui.dev 上线
- 未执行 npm publish
- 未宣称盲测 ≥80%
- VPAT 仍 draft / not certified
- owner 仍为待指定
