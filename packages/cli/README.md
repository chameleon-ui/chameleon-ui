# @chameleon-ui/cli

Thin command-line shell over `@chameleon-ui/install-core`. All file writes go
through the shared install kernel.

## Usage

```bash
chameleon add button
chameleon add-theme line
chameleon bundle button line
chameleon search
chameleon telemetry-off
```

## Telemetry

Telemetry is **off by default**. Enable with `CU_TELEMETRY=1`. When enabled,
install events are logged to stderr as JSON; no network analytics SDK is used.

## Private registry

Leave `CU_REGISTRY_URL` unset to install from the bundled catalog. To talk to a
private server:

```
CU_REGISTRY_URL=http://127.0.0.1:8787
CU_REGISTRY_TOKEN=<token>
CU_REGISTRY_NAMESPACE=public
chameleon add button
chameleon add button@1.0.0
```

## Dependencies

- `@chameleon-ui/install-core` (workspace)
- `@chameleon-ui/registry` (workspace)
