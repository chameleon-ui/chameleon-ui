# How AI Works

> **English · [简体中文](how-ai-works.md) · [繁體中文（香港）](how-ai-works.zh-HK.md) · [العربية](how-ai-works.ar.md)**

This document explains how Chameleon UI's **AI mechanism works end-to-end**: how AI (agents / models) "understands" components, how it gets **valid and reliable** usage, and how it **installs** components/themes. This is an architectural mechanism explanation; the operative rules come from [`AGENTS.md`](../../AGENTS.md), the single source of truth (SSOT).

> In one sentence: Chameleon UI is driven by **machine-readable contracts** — AI doesn't guess; it assembles WYSIWYG components by querying contracts and the lexicon, and all disk writes always converge on one kernel.

---

## 1. Core idea: contract-driven

Traditional component libraries are a "black box" to AI — AI can only guess usage from README/examples, often inventing imports, wrong props, or non-existent paths. Chameleon UI's opposite: **every component carries a machine-readable `contract.json`** — AI reads it directly to get authoritative, checkable usage.

Each component's `contract.json` (at `packages/components-react/src/<slug>/contract.json`) includes:

- `slug` / `name` / `schemaVersion`
- `props` / `variants` / `states`
- `composition` / `antiPatterns` (how not to use it)
- `a11y` (accessibility requirements)
- `responsive` / `rtl` (three-end and RTL behavior)
- **`dataAi`**: `{ "role", "states", "intents" }` — machine-readable behavior semantics
- `usage` / `exports` / `mechanics`

Real example (button's `dataAi`):

```json
{
  "role": "button",
  "states": ["default", "loading", "disabled"],
  "intents": ["submit", "confirm", "cancel"]
}
```

Contracts are **100% validated by a shared schema** in [`@chameleon-ui/contract`](../../packages/contract/README.md): every slug in the catalog must have a valid contract, otherwise CI turns red. So "contracts are trustworthy" is not a hope — it's guaranteed by gates.

---

## 2. Intent lexicon: data-ai-vocabulary

When AI searches/describes components, it uses a **frozen intent lexicon** to align semantics:

[`docs/ai/data-ai-vocabulary.json`](./data-ai-vocabulary.json) defines a set of standard `intents` (currently **70**), e.g. `submit`, `cancel`, `choose-option`, `confirm`.

- Each intent is an English semantic description (e.g. `adjust-value`: "Adjust a numeric value along a range.").
- Purpose: let "requirement descriptions" and "component capabilities" join on the **same vocabulary**, making AI search/recommendation explainable and predictable.
- The lexicon is **frozen**: before adding an intent you must register it here, then `catalog-data-ai.test.ts` and `generate-data-ai-vocabulary.mjs --check` prevent drift in both directions.

---

## 3. Two consumption paths

AI consumes Chameleon UI via **two** paths, decided by "whether MCP is mounted":

### Path A: MCP mounted (recommended for near-production AI workflows)

`@chameleon-ui/mcp-server` provides a stdio [Model Context Protocol](../../packages/mcp-server/README.md) server; AI **queries in real time** via tool calls rather than guessing:

| When | Tool |
| :--- | :--- |
| First call | `get_started` (catalog summary, theme, tool order, NEVER) |
| Before writing any CSS/JS import | `get_import_specifiers` (returns **valid** specifiers) |
| Picking components | `list_components` / `search_components` (by `intent`) |
| Emitting component JSX/SFC | `get_contract` (v0.2 contract) |
| Handling density / radius / RTL | `get_design_rules` |
| Listing themes | `list_themes` |
| Landing installation | `install_with_theme` and other `install_*` |

Read-only tools don't write disk; **all writes go through `install-core`**.

### Path B: no MCP (zero dependency)

AI reads `AGENTS.md` and `docs/ai/` from the repo, takes contracts from the filesystem, and copies official import specifiers. In this mode **inventing** alternative paths or specifiers is forbidden — `AGENTS.md`'s rules exist exactly to stop "guessing".

---

## 4. Three-layer responsibility: map → render → install

Protocol documents (A2UI / MCP Apps / AG-UI) become real Chameleon components through a three-layer split, and **protocol fields never leak into L1/L2**:

| Layer | Package | Responsibility | Writes disk? |
| :--- | :--- | :--- | :--- |
| Protocol mapping | `adapter-a2ui` / `adapter-mcp-apps` / `adapter-ag-ui` | protocol doc → render node / install plan | No (returns a plan) |
| Runtime render | `schema-renderer` | JSON render-schema → **real component tree** (default 10 slugs) | No |
| Install kernel | `install-core` | **writes to disk** per plan (dependency graph, conflict detection, idempotency) | **Yes (only)** |

- `schema-renderer` shares the catalog's slug naming but is unaware of any protocol field.
- adapters and `schema-renderer` are **side paths** (L3/L4) that don't pollute the headless core.
- Example: a `schema-renderer` JSON input:

```json
{
  "version": "1.0",
  "root": {
    "component": "stack",
    "props": { "direction": "column", "gap": "2" },
    "children": [
      { "component": "heading", "props": { "level": "level-2" }, "children": ["Sign in"] }
    ]
  }
}
```

---

## 5. AI assembly safety bounds (NEVER)

`AGENTS.md` constrains AI with an explicit **NEVER list** to prevent bad code:

- **Forbidden** to invent `@chameleon-ui/*/css` specifiers, or write `workspace:*` in consumers.
- **Forbidden** to include both `@chameleon-ui/react` and `@chameleon-ui/vue`.
- **Forbidden** to treat the AG-UI adapter as a supported protocol (it's a POC).
- **Forbidden** to invent performance numbers, blind-test recognition rates, or accessibility certifications.
- **Forbidden** to write a second install path outside `install-core`.
- **Forbidden** to add `resolve.alias` hacks for `@chameleon-ui/*` CSS — package `exports` must resolve on their own.

These aren't suggestions — they're hard constraints enforced by CI/gates.

---

## 6. Workflow example: AI adds a login form

1. `get_started` → get theme `linear`, CSS imports, tool order.
2. `search_components`(`intent: "authenticate"`) → hits `login` / `input` / `password-input`.
3. `get_import_specifiers` → get the **valid** imports for this set.
4. `get_contract`(`input`) → get props / a11y / antiPatterns.
5. `get_design_rules`(`linear`) → get density / RTL / spacing rules.
6. Produce JSX/SFC with official specifiers, zero `resolve.alias`.
7. To write to disk: `install_with_theme` (idempotent via install-core).

Every step in the chain has an authoritative source — AI doesn't need to guess.

---

## 7. Related docs

| Topic | Where |
| :--- | :--- |
| AI consumption rules (SSOT) | [`AGENTS.md`](../../AGENTS.md) |
| Agent consume flow | [`docs/ai/agent-consume.md`](./agent-consume.md) |
| Contract field mapping | [`docs/ai/component-contract-v0.2-mapping.md`](./component-contract-v0.2-mapping.md) |
| Intent lexicon | [`docs/ai/data-ai-vocabulary.md`](./data-ai-vocabulary.md) |
| SchemaRenderer | [`docs/ai/schema-renderer.md`](./schema-renderer.md) · [`packages/schema-renderer`](../../packages/schema-renderer/README.md) |
| MCP server | [`packages/mcp-server/README.md`](../../packages/mcp-server/README.md) |
| Contract validation | [`packages/contract/README.md`](../../packages/contract/README.md) |
| Install kernel | [`packages/install-core/README.md`](../../packages/install-core/README.md) |
