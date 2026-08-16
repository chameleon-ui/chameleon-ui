# MCP Apps decision (Phase 4)

> Date: 2026-08-13  
> Card: `docs/project/phases/Phase-4-v2.0.md` §3.3（该阶段文档未保留在仓库中）  
> Decision tree: **evaluate protocol maturity → adapter POC with demo / observation report only**.

## Decision: **adapt** (small independent POC)

Not observe-only. Artifact: `@chameleon-ui/adapter-mcp-apps` + `demo/form-submit`.

## Inputs (maturity)

| Fact | Source | Bearing |
| :--- | :--- | :--- |
| SEP-1865 status **Final** (2026-01-26) | [modelcontextprotocol.io/seps/1865](https://modelcontextprotocol.io/seps/1865-mcp-apps-interactive-user-interfaces-for-mcp.md) | Spec is frozen enough for a mapping POC |
| Official extension `io.modelcontextprotocol/ui` | same | Capability id is stable |
| HTML MVP `text/html;profile=mcp-app`; `ui://` predeclared resources | same | Enough to emit a template + install plan |
| Hosts announced (Claude, ChatGPT, Goose, VS Code Insiders) | MCP blog 2026-01-26 | Ecosystem exists; **we did not certify against those hosts** |
| Existing Chameleon MCP server is tools-only (stdio JSON-RPC, no UI resources) | `packages/mcp-server` | Adapter can sit beside it without rewriting L1 |
| A2UI adapter already proved the L3/L4 mapping pattern | `packages/adapter-a2ui` | Reuse plan → install-core; do not put protocol types in L1 |

## Why not observe-only

Observation was the v1.0 (Phase 3) holding pattern while the SEP was still a proposal. At M4 evaluation time the SEP is Final and the mapping surface (`ui://` + widget types → slugs) is small. A POC adapter with a form-submit demo is cheaper than waiting another phase, and it does not block L1.

## Honesty bounds (do not read as “adapted in production”)

This package **maps** and **demos**. It does **not** claim:

- listing or review on Claude / ChatGPT / VS Code
- bidirectional host JSON-RPC
- iframe sandbox testing in a real host
- that `mcp-server` already serves `ui://` resources (it does not; that remains a follow-up)

Install telemetry, if any, still uses dictionary events (`install`) via install-core. No new event names.

## Follow-up (not this slice)

Wire `mcp-server` to declare the UI resource and `_meta.ui.resourceUri` on a tool; host sandbox QA. Until then the demo HTML is a template preview only.

## Phase 8 addendum (2026-08-13): POC → supported

轨道卡 A4 晋升项落地：错误路径（unknown_type / missing_registry_item / invalid_document / invalid_uri）有定位错误类型与测试；测试进 CI（`phase4:gates` + `phase8:gates`）；README 标明 supported 与版本承诺。**不变**：仍非宿主认证；demo HTML 仍是模板预览；`mcp-server` 仍未伺服 `ui://` 资源。
