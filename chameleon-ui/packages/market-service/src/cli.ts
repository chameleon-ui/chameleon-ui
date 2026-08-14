#!/usr/bin/env node

import { createMarketServer } from './server.js';
import { createListingStore, seedMarketCatalog } from './listings.js';

function usage(): void {
  console.log(`Usage:
  chameleon-market serve

Environment:
  CU_MARKET_HOST    listen address (default: 127.0.0.1)
  CU_MARKET_PORT    listen port (default: 8788)

The marketplace service hosts official homage themes as free listings plus
community theme listings and registry:rules discipline packs (including
community-focus-first). Community packs may be free or paid. Every install is
handled by @chameleon-ui/install-core; this service never writes project files
directly. Official homage themes are free SKUs (not sold as paid listings).`);
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

  const host = process.env.CU_MARKET_HOST?.trim() || '127.0.0.1';
  const port = Number.parseInt(process.env.CU_MARKET_PORT ?? '8788', 10);
  const store = createListingStore({ initial: seedMarketCatalog() });
  const server = await createMarketServer({ store, host, port });

  console.error(
    JSON.stringify({
      event: 'market.listen',
      url: server.url,
      protocol: 'chameleon-market/v1',
      telemetry: 'off',
    }),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
