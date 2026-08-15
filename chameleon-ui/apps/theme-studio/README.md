# @chameleon-ui/theme-studio

Phase 3 theme workbench Beta. Private app — not published.

Flow: pick a baseline theme → edit tokens/rules JSON → schema validate → export a bundle (`tokens` + `design-rules` + `meta`) with `generator=theme-studio`. Export is blocked until `design-rules` pass the v1.0 schema.

This is **not** a timed 10-minute human study. The routes and validation are the engineering evidence. Do not claim the U-key 10-minute bar without a recorded novice run.

## Commands

From `chameleon-ui/`:

```
corepack pnpm@9.15.0 studio
# http://127.0.0.1:5177

corepack pnpm@9.15.0 --filter @chameleon-ui/theme-studio test
corepack pnpm@9.15.0 --filter @chameleon-ui/theme-studio build
corepack pnpm@9.15.0 --filter @chameleon-ui/theme-studio preview
# http://127.0.0.1:4177
```

## Routes

| Path | What |
| :--- | :--- |
| `/editor` | Theme selector, rules JSON, live schema issues |
| `/export` | Download JSON bundle when valid |

Local market loop: download export → Marketplace **Apply → Import Theme Studio export** → Submit → Install. Studio does not call the market API.

Pro capabilities (multi-file zip, PR bot, auto-submit from Studio) remain reserved.
