# Agent notes (library)

These files sit next to [`../AGENTS.md`](../AGENTS.md). **AGENTS.md is the SSOT** for consuming `@chameleon-ui/*`. This folder adds attach/composition notes — not a second rulebook.

## Read order

1. [`../AGENTS.md`](../AGENTS.md) — **Start here in 60 seconds**, then install / CSS / NEVER
2. [`consumer-agent-bootstrap.md`](./consumer-agent-bootstrap.md) — paste into a consumer Cursor Rule / prompt
3. [`agent-consume.md`](./agent-consume.md) — MCP attach (optional), tool order, App chrome, external install
4. As needed:
   - [`schema-renderer.md`](./schema-renderer.md) — JSON → tree (10-slug default map)
   - [`component-contract-v0.2-mapping.md`](./component-contract-v0.2-mapping.md) — contract key mapping
   - [`data-ai-vocabulary.md`](./data-ai-vocabulary.md) / [`.json`](./data-ai-vocabulary.json) — frozen `data-ai-intent` lexicon
   - [`theme-extends.md`](./theme-extends.md) — theme `$extends` (compile-time)
   - [`community-rules-pack-guide.md`](./community-rules-pack-guide.md) — community design-rules packs

## File map

| File | Purpose |
| :--- | :--- |
| [`agent-consume.md`](./agent-consume.md) | Attach + composition spec for external consumer apps |
| [`consumer-agent-bootstrap.md`](./consumer-agent-bootstrap.md) | Short paste-ready rule + entry snippets |
| [`schema-renderer.md`](./schema-renderer.md) | SchemaRenderer shape, imports, limits |
| [`component-contract-v0.2-mapping.md`](./component-contract-v0.2-mapping.md) | v0.1 → v0.2 / report field mapping |
| [`data-ai-vocabulary.md`](./data-ai-vocabulary.md) | Human table of intents (generated with `.json`) |
| [`data-ai-vocabulary.json`](./data-ai-vocabulary.json) | Machine lexicon for contracts / gates |
| [`theme-extends.md`](./theme-extends.md) | DTCG `$extends` for derived themes |
| [`community-rules-pack-guide.md`](./community-rules-pack-guide.md) | Create → validate → register → install rules packs |

Repo-root `docs/ai/` is a **pointer only**. Do not maintain a second copy there.
