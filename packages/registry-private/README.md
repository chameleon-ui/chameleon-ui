# @chameleon-ui/registry-private

Local / intranet registry server for Phase 3. It serves the **same
`RegistryItem` JSON** as `@chameleon-ui/registry`, behind a Bearer token, with
namespaces and semver versions.

This is **not** an IdP, mTLS mesh, multi-tenant SaaS, or Kubernetes operator.
Those are reserved. The implemented demo form is a **Node HTTP listener on
`127.0.0.1`**. Docker/K8s are optional wrappers around the same process; they
are not required for local R&D.

The server **does not write project files**. CLI and MCP still call
`@chameleon-ui/install-core`. Telemetry stays off unless the installer sets
`CU_TELEMETRY=1`.

## Run

```
$env:CU_REGISTRY_TOKEN = "replace-me"
corepack pnpm@9.15.0 --filter @chameleon-ui/registry-private start
```

Default listen: `http://127.0.0.1:8787`. Then point a client at it:

```
$env:CU_REGISTRY_URL = "http://127.0.0.1:8787"
$env:CU_REGISTRY_TOKEN = "replace-me"
$env:CU_REGISTRY_NAMESPACE = "public"
chameleon add button
```

Without `CU_REGISTRY_URL`, CLI/MCP keep using the bundled catalog. No remote
is required.

## Protocol (`chameleon-registry/v1`)

| Method | Path | Auth | Body |
| :--- | :--- | :--- | :--- |
| GET | `/health` | no | `{ ok, protocol, telemetry }` |
| GET | `/v1/namespaces` | Bearer | `{ namespaces }` |
| GET | `/v1/namespaces/:ns/items` | Bearer | summaries; `?full=1` for files; `?q=` search |
| GET | `/v1/namespaces/:ns/items/:id` | Bearer | latest version `{ item }` |
| GET | `/v1/namespaces/:ns/items/:id/versions` | Bearer | `{ versions }` |
| GET | `/v1/namespaces/:ns/items/:id/versions/:ver` | Bearer | pinned `{ item }` |

`item` is the public registry schema plus `namespace` and `version`.

Seeded namespaces:

| Namespace | Contents |
| :--- | :--- |
| `public` | bundled 50 UI + 8 themes at `0.0.0` |
| `acme` | demo overlay of `button` at `0.9.0`, `1.0.0`, `1.1.0` (latest = `1.1.0`) |

## Environment

| Variable | Role |
| :--- | :--- |
| `CU_REGISTRY_TOKEN` | required to **start** the server; same value for clients |
| `CU_REGISTRY_HOST` | default `127.0.0.1` |
| `CU_REGISTRY_PORT` | default `8787` |
| `CU_REGISTRY_TLS_CERT` / `CU_REGISTRY_TLS_KEY` | optional HTTPS (server cert). Client-cert mTLS is reserved |
| `CU_REGISTRY_URL` | client: base URL |
| `CU_REGISTRY_NAMESPACE` | client: default `public` |

Do not commit tokens. Audit log records method/path/status/source; it does not
record the bearer token or file contents.

## Reserved

- Multi-tenant per-namespace tokens / IdP
- mTLS client certificates (`CU_REGISTRY_TLS_CA` is not read)
- Market / paid catalog fields
