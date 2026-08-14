import { createServer as createHttpServer, type Server } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { readFile } from 'node:fs/promises';
import { createAuditLog, type AuditEntry } from './audit.js';
import { createPrivateRegistryHandler } from './server.js';
import { seedDefaultStore } from './seed.js';
import type { RegistryStore } from './store.js';

export interface PrivateRegistryListenOptions {
  token: string;
  host?: string;
  port?: number;
  store?: RegistryStore;
  tls?: {
    cert: string | Buffer;
    key: string | Buffer;
  };
}

export interface PrivateRegistryServer {
  url: string;
  host: string;
  port: number;
  protocol: 'http' | 'https';
  auditLog: readonly AuditEntry[];
  close(): Promise<void>;
}

function listen(
  server: Server,
  port: number,
  host: string,
): Promise<{ port: number }> {
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
        reject(new Error('Private registry failed to bind a TCP port'));
        return;
      }
      resolve({ port: address.port });
    });
  });
}

export async function createPrivateRegistryServer(
  options: PrivateRegistryListenOptions,
): Promise<PrivateRegistryServer> {
  const token = options.token.trim();
  if (!token) {
    throw new Error('Private registry token is required');
  }
  const host = options.host ?? '127.0.0.1';
  const port = options.port ?? 0;
  const audit = createAuditLog();
  const store = options.store ?? seedDefaultStore();
  const handler = createPrivateRegistryHandler({ token, store, audit });
  const protocol = options.tls ? 'https' : 'http';
  const server = options.tls
    ? createHttpsServer({ cert: options.tls.cert, key: options.tls.key }, handler)
    : createHttpServer(handler);

  const bound = await listen(server, port, host);
  return {
    url: `${protocol}://${host}:${bound.port}`,
    host,
    port: bound.port,
    protocol,
    get auditLog() {
      return audit.entries;
    },
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

export async function serveFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): Promise<PrivateRegistryServer> {
  const token = env.CU_REGISTRY_TOKEN?.trim();
  if (!token) {
    throw new Error('CU_REGISTRY_TOKEN is required to start the private registry');
  }
  const host = env.CU_REGISTRY_HOST?.trim() || '127.0.0.1';
  const port = Number.parseInt(env.CU_REGISTRY_PORT ?? '8787', 10);
  const certPath = env.CU_REGISTRY_TLS_CERT?.trim();
  const keyPath = env.CU_REGISTRY_TLS_KEY?.trim();
  let tls: PrivateRegistryListenOptions['tls'];
  if (certPath || keyPath) {
    if (!certPath || !keyPath) {
      throw new Error('CU_REGISTRY_TLS_CERT and CU_REGISTRY_TLS_KEY must be set together');
    }
    tls = {
      cert: await readFile(certPath),
      key: await readFile(keyPath),
    };
  }
  return createPrivateRegistryServer({ token, host, port, tls });
}

export { createAuditLog, type AuditEntry } from './audit.js';
export { createPrivateRegistryHandler } from './server.js';
export { seedDefaultStore } from './seed.js';
export { RegistryStore, compareSemver, latestVersion } from './store.js';
export { authorizeRequest, parseBearerToken, tokensEqual } from './auth.js';
