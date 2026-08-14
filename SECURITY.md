# Security Policy

This repository is a local R&D tree and does not currently have a GitHub remote
or a public vulnerability form.

## Reporting

Send a private note to the maintainers. Do not attach secrets, `.env` files, or
install-target dumps. Do not file a public issue that includes credentials.

## Telemetry

Usability telemetry is **off by default**. It is not a security product.

- Enable only with `CU_TELEMETRY=1`.
- There is no network analytics SDK in `install-core`; a hook, if present, receives
  `install`, `intent_vs_adopt`, and `opt_out` events.
- Opt out: `chameleon telemetry-off` (emits `opt_out` when a hook is configured).
- Notice copy version: `telemetry-notice.v1`.

## Supply chain

Do not commit `.env`, tokens, or private registry passwords. `pnpm install` uses
the frozen lockfile in CI.
