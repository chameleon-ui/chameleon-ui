# MCP Apps form-submit demo

Smallest MCP Apps → Chameleon UI mapping: a form with one text field and a submit button.

- `form-submit.mcp-apps.json` is the local protocol document (`kind=mcp-apps`, `ui://` URI).
- `form-submit.html` is the generated `text/html;profile=mcp-app` template (POC preview, not a host listing).
- The adapter maps `form` → `form`, `text-field` → `input`, and `button` → `button`.
- Install still goes through `@chameleon-ui/install-core`. This demo does not write to disk.

This is **not** a Claude / ChatGPT / VS Code certification.
