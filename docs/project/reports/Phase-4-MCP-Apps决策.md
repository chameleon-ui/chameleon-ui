# MCP Apps 决策（Phase 4）

> 日期：2026-08-13  
> 阶段卡：[`../phases/Phase-4-v2.0.md`](../phases/Phase-4-v2.0.md) §3.3  
> 决策树：评估协议成熟度 → **适配 POC（有 demo）** / 仅观察报告（无码）。

## 结论：**适配**（独立 POC 包，不进 L1）

不是「仅观察」。物：`chameleon-ui/packages/adapter-mcp-apps` + `demo/form-submit`。

英文决策原文与诚实边界见包内 [`DECISION.md`](../../chameleon-ui/packages/adapter-mcp-apps/DECISION.md)。

## 成熟度（2026-08-13）

- SEP-1865 **Final**（2026-01-26）；扩展 id `io.modelcontextprotocol/ui`。
- HTML MVP：`text/html;profile=mcp-app`；资源 `ui://`。
- 已有宿主宣布支持。本仓 **未** 做宿主认证，禁止写成「已上架 Claude/ChatGPT」。
- 现有 `mcp-server` 仍是 tools-only；本 POC 不把协议类型放进 L1。

## 禁止误读

映射 + demo ≠ 生产适配完成。双向 JSON-RPC、iframe 沙箱实测、把 `ui://` 挂到 `mcp-server` 工具元数据，均未做。
