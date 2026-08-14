import { createServer as createHttpServer } from 'node:http';
import type { Server, IncomingMessage, ServerResponse } from 'node:http';
import {
  assertPaidRulesListingAllowed,
  createInstallKernel,
  RulesListingPolicyError,
} from '@chameleon-ui/install-core';
import type { InstallOptions } from '@chameleon-ui/install-core';
import type { ListingStore } from './listings.js';
import { HOMAGE_THEME_IDS, toRegistryItem, type ThemeListing } from './contracts.js';
import { HomagePaidZoneError } from './guard.js';

export interface MarketServerOptions {
  store: ListingStore;
  host?: string;
  port?: number;
  /** Optional telemetry hook forwarded to install-core. */
  telemetry?: InstallOptions['telemetry'];
}

export interface MarketServer {
  url: string;
  host: string;
  port: number;
  close(): Promise<void>;
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function requestPath(req: IncomingMessage): { pathname: string; searchParams: URLSearchParams } {
  const host = req.headers.host ?? '127.0.0.1';
  const url = new URL(req.url ?? '/', `http://${host}`);
  return { pathname: url.pathname, searchParams: url.searchParams };
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

function listen(server: Server, port: number, host: string): Promise<{ port: number }> {
  return new Promise((resolve, reject) => {
    const onError = (error: Error) => {
      server.off('error', onError);
      reject(error);
    };
    server.once('error', onError);
    server.listen(port, host, () => {
      server.off('error', onError);
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Market service failed to bind a TCP port'));
        return;
      }
      resolve({ port: address.port });
    });
  });
}

/** Official homage ids are free SKUs — paid homage listings must not install. Paid community packs still go through install-core policy. */
export function guardPaidListingInstall(listing: ThemeListing): void {
  if (listing.pricing !== 'paid') return;
  if (HOMAGE_THEME_IDS.has(listing.id)) {
    throw new HomagePaidZoneError(listing.id);
  }
  if (listing.type === 'registry:rules') {
    assertPaidRulesListingAllowed(listing.id);
  }
}

export function createMarketHandler(
  store: ListingStore,
  telemetry?: InstallOptions['telemetry'],
): (req: IncomingMessage, res: ServerResponse) => void {
  return async (req, res) => {
    const method = req.method ?? 'GET';
    const { pathname, searchParams } = requestPath(req);

    try {
      if (method === 'GET' && pathname === '/health') {
        sendJson(res, 200, { ok: true, protocol: 'chameleon-market/v1' });
        return;
      }

      if (method === 'GET' && pathname === '/v1/listings') {
        const type = searchParams.get('type');
        const listings = type ? store.list().filter((listing) => listing.type === type) : store.list();
        sendJson(res, 200, { listings });
        return;
      }

      const detailMatch = /^\/v1\/listings\/([^/]+)$/.exec(pathname);
      if (method === 'GET' && detailMatch) {
        const id = decodeURIComponent(detailMatch[1]);
        const listing = store.get(id);
        if (!listing) {
          sendJson(res, 404, { error: { code: 'not_found', message: `Listing ${id} not found` } });
          return;
        }
        sendJson(res, 200, { listing });
        return;
      }

      if (method === 'POST' && pathname === '/v1/listings/apply') {
        const body = await readBody(req);
        const application = JSON.parse(body) as Parameters<ListingStore['apply']>[0];
        const listing = store.apply(application);
        sendJson(res, listing.status === 'rejected' ? 422 : 201, { listing });
        return;
      }

      if (method === 'POST' && detailMatch) {
        const id = decodeURIComponent(detailMatch[1]);
        const listing = store.get(id);
        if (!listing) {
          sendJson(res, 404, { error: { code: 'not_found', message: `Listing ${id} not found` } });
          return;
        }
        const body = await readBody(req);
        const { targetDir, session } = JSON.parse(body) as {
          targetDir: string;
          session?: string;
        };
        if (!targetDir || typeof targetDir !== 'string') {
          sendJson(res, 400, {
            error: { code: 'bad_request', message: 'targetDir is required' },
          });
          return;
        }
        guardPaidListingInstall(listing);
        const kernel = createInstallKernel([toRegistryItem(listing)]);
        const result = await kernel.install(toRegistryItem(listing), targetDir, {
          telemetry,
          source: 'market',
          session,
        });
        sendJson(res, 200, { result });
        return;
      }

      sendJson(res, 404, { error: { code: 'not_found', message: 'Unknown route' } });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const code =
        error instanceof HomagePaidZoneError
          ? 'homage_paid_zone'
          : error instanceof RulesListingPolicyError
            ? error.reason === 'official_homage_id'
              ? 'homage_paid_zone'
              : 'community_prefix_required'
            : error instanceof Error && error.name === 'CommunityPrefixError'
              ? 'community_prefix_required'
              : 'bad_request';
      sendJson(res, 400, { error: { code, message } });
    }
  };
}

export async function createMarketServer(options: MarketServerOptions): Promise<MarketServer> {
  const host = options.host ?? '127.0.0.1';
  const port = options.port ?? 0;
  const handler = createMarketHandler(options.store, options.telemetry);
  const server = createHttpServer(handler);
  const bound = await listen(server, port, host);
  return {
    url: `http://${host}:${bound.port}`,
    host,
    port: bound.port,
    close() {
      return new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    },
  };
}
