import type { IncomingMessage, ServerResponse } from 'node:http';
import { authorizeRequest } from './auth.js';
import { createAuditLog, type AuditEntry } from './audit.js';
import type { RegistryStore } from './store.js';

export interface RegistryHandlerOptions {
  token: string;
  store: RegistryStore;
  audit?: ReturnType<typeof createAuditLog>;
}

function sendJson(
  res: ServerResponse,
  status: number,
  body: unknown,
): void {
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

function sourceOf(req: IncomingMessage): string | undefined {
  const header = req.headers['x-cu-source'];
  return typeof header === 'string' ? header : undefined;
}

export function createPrivateRegistryHandler(
  options: RegistryHandlerOptions,
): (req: IncomingMessage, res: ServerResponse) => void {
  const audit = options.audit ?? createAuditLog();

  return (req, res) => {
    const method = req.method ?? 'GET';
    const { pathname, searchParams } = requestPath(req);
    const source = sourceOf(req);

    const record = (
      status: number,
      extra: { authorized: boolean; namespace?: string; itemId?: string },
    ): void => {
      audit.record({
        method,
        path: pathname,
        status,
        source,
        ...extra,
      });
    };

    if (method === 'GET' && pathname === '/health') {
      record(200, { authorized: true });
      sendJson(res, 200, {
        ok: true,
        protocol: 'chameleon-registry/v1',
        telemetry: 'off',
      });
      return;
    }

    if (method !== 'GET') {
      record(405, { authorized: false });
      sendJson(res, 405, {
        error: { code: 'method_not_allowed', message: 'Only GET is implemented' },
      });
      return;
    }

    if (!pathname.startsWith('/v1/')) {
      record(404, { authorized: false });
      sendJson(res, 404, {
        error: { code: 'not_found', message: 'Unknown route' },
      });
      return;
    }

    if (!authorizeRequest(req.headers.authorization, options.token)) {
      record(401, { authorized: false });
      sendJson(res, 401, {
        error: { code: 'unauthorized', message: 'Missing or invalid bearer token' },
      });
      return;
    }

    if (pathname === '/v1/namespaces') {
      record(200, { authorized: true });
      sendJson(res, 200, { namespaces: options.store.listNamespaces() });
      return;
    }

    const itemVersion = /^\/v1\/namespaces\/([^/]+)\/items\/([^/]+)\/versions\/([^/]+)$/.exec(
      pathname,
    );
    if (itemVersion) {
      const namespace = decodeURIComponent(itemVersion[1]);
      const itemId = decodeURIComponent(itemVersion[2]);
      const version = decodeURIComponent(itemVersion[3]);
      const item = options.store.get(namespace, itemId, version);
      if (!item) {
        record(404, { authorized: true, namespace, itemId });
        sendJson(res, 404, {
          error: { code: 'not_found', message: `Unknown item ${namespace}/${itemId}@${version}` },
        });
        return;
      }
      record(200, { authorized: true, namespace, itemId });
      sendJson(res, 200, { item });
      return;
    }

    const itemVersions = /^\/v1\/namespaces\/([^/]+)\/items\/([^/]+)\/versions$/.exec(pathname);
    if (itemVersions) {
      const namespace = decodeURIComponent(itemVersions[1]);
      const itemId = decodeURIComponent(itemVersions[2]);
      const versions = options.store.listVersions(namespace, itemId);
      if (versions.length === 0) {
        record(404, { authorized: true, namespace, itemId });
        sendJson(res, 404, {
          error: { code: 'not_found', message: `Unknown item ${namespace}/${itemId}` },
        });
        return;
      }
      record(200, { authorized: true, namespace, itemId });
      sendJson(res, 200, { id: itemId, namespace, versions });
      return;
    }

    const itemLatest = /^\/v1\/namespaces\/([^/]+)\/items\/([^/]+)$/.exec(pathname);
    if (itemLatest) {
      const namespace = decodeURIComponent(itemLatest[1]);
      const itemId = decodeURIComponent(itemLatest[2]);
      const item = options.store.get(namespace, itemId);
      if (!item) {
        record(404, { authorized: true, namespace, itemId });
        sendJson(res, 404, {
          error: { code: 'not_found', message: `Unknown item ${namespace}/${itemId}` },
        });
        return;
      }
      record(200, { authorized: true, namespace, itemId });
      sendJson(res, 200, { item });
      return;
    }

    const itemList = /^\/v1\/namespaces\/([^/]+)\/items$/.exec(pathname);
    if (itemList) {
      const namespace = decodeURIComponent(itemList[1]);
      if (!options.store.hasNamespace(namespace)) {
        record(404, { authorized: true, namespace });
        sendJson(res, 404, {
          error: { code: 'not_found', message: `Unknown namespace ${namespace}` },
        });
        return;
      }
      const items = options.store.listItems(namespace, searchParams.get('q') ?? undefined);
      const full = searchParams.get('full') === '1';
      record(200, { authorized: true, namespace });
      sendJson(res, 200, {
        namespace,
        items: full
          ? items
          : items.map((item) => ({
              id: item.id,
              name: item.name,
              type: item.type,
              namespace: item.namespace,
              version: item.version,
            })),
      });
      return;
    }

    record(404, { authorized: true });
    sendJson(res, 404, {
      error: { code: 'not_found', message: 'Unknown route' },
    });
  };
}

export type { AuditEntry };
