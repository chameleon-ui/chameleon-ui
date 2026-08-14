# @chameleon-ui/market-service

Phase 4 marketplace service: community themes and `registry:rules` packs. Private app — not published.

## Responsibilities

- Host official homage themes as **free** listings (all 8 ids).
- Host community theme listings with `community-` id prefix (free or paid).
- List and install discipline packs (`type=registry:rules`), including seeded `community-focus-first`.
- Run the listing validation pipeline: `checkRules`, `checkRtl`, `checkLicense`, `checkA11y`.
- Reject official homage theme ids when submitted as **paid SKUs** (they remain free themes). Paid community packs are allowed.
- Delegate every install to `@chameleon-ui/install-core` with `source: 'market'`.

This service never writes project files directly. It is the only disk-writer boundary for marketplace installs.

## Commands

From `chameleon-ui/`:

```
corepack pnpm@9.15.0 --filter @chameleon-ui/market-service build
corepack pnpm@9.15.0 --filter @chameleon-ui/market-service start
# http://127.0.0.1:8788
```

## API

| Method | Path | What |
| :--- | :--- | :--- |
| GET | `/health` | Liveness check |
| GET | `/v1/listings` | Browse listings (`?type=registry:theme` or `registry:rules`) |
| GET | `/v1/listings/:id` | Listing detail |
| POST | `/v1/listings/apply` | Submit a listing for validation |
| POST | `/v1/listings/:id` | Install a listing to `targetDir` via install-core |

## Validation pipeline

Validators are plugin-shaped functions of type `ListingValidator`. The default pipeline is exported as `defaultValidators`. New checks can be added without changing the store or server.

## Human review queue

The store supports a `humanReviewOnFailure` option that sends failed auto-checks to `human-review` status instead of `rejected`. This is reserved for operator enablement and is off by default.
