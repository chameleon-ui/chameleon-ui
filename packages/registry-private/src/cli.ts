#!/usr/bin/env node

import { serveFromEnv } from './index.js';

function usage(): void {
  console.log(`Usage:
  chameleon-registry serve

Environment:
  CU_REGISTRY_TOKEN       required bearer token
  CU_REGISTRY_HOST        listen address (default: 127.0.0.1)
  CU_REGISTRY_PORT        listen port (default: 8787)
  CU_REGISTRY_TLS_CERT    optional PEM cert path (HTTPS)
  CU_REGISTRY_TLS_KEY     optional PEM key path (HTTPS)

Local R&D does not require this process. CLI/MCP use the bundled catalog
unless CU_REGISTRY_URL is set. This server does not write project files
and does not emit install telemetry (install-core remains the only writer).
mTLS client certificates and IdP SSO are reserved, not implemented.`);
}

async function main(): Promise<void> {
  const command = process.argv[2] ?? 'serve';
  if (command === '-h' || command === '--help' || command === 'help') {
    usage();
    return;
  }
  if (command !== 'serve') {
    usage();
    process.exit(1);
  }
  const server = await serveFromEnv();
  console.error(
    JSON.stringify({
      event: 'registry.listen',
      url: server.url,
      protocol: server.protocol,
      namespaces: ['public', 'acme'],
      telemetry: 'off',
    }),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
