# @chameleon-ui/market

Phase 4 marketplace UI for community themes and rules packs. Private app — not published.

## Features

- **Browse** community theme and `registry:rules` listings (seeded: `community-focus-first`).
- **Detail** page with validation report.
- **Install** a listing into a target directory via `@chameleon-ui/market-service` (which delegates to `@chameleon-ui/install-core`).
- **Apply** for a new listing (theme or rules pack); the application is validated by the service pipeline.

## Commands

From `chameleon-ui/`:

```
corepack pnpm@9.15.0 market
# UI: http://127.0.0.1:5178
# API: http://127.0.0.1:8788

corepack pnpm@9.15.0 --filter @chameleon-ui/market test
corepack pnpm@9.15.0 --filter @chameleon-ui/market build
corepack pnpm@9.15.0 --filter @chameleon-ui/market preview
# http://127.0.0.1:4178
```

## Notes

- The dev server proxies `/api` to the market service running on `CU_MARKET_SERVICE_URL` (default `http://127.0.0.1:8788`).
- Official homage themes (all 8 ids) are seeded as **free** listings. They must not be submitted as paid SKUs. Community packs may be free or paid. No payment SDK is included.
