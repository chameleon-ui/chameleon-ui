#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const SERVICE_HOST = process.env.CU_MARKET_HOST ?? '127.0.0.1';
const SERVICE_PORT = Number(process.env.CU_MARKET_PORT ?? 8788);
const SERVICE_URL = `http://${SERVICE_HOST}:${SERVICE_PORT}`;

async function waitForHealth(url, retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${url}/health`);
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await setTimeout(200);
  }
  throw new Error(`Market service did not become healthy at ${url}`);
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0 || code === null) resolve();
      else reject(new Error(`${command} exited with ${code}`));
    });
    return child;
  });
}

async function main() {
  console.error(`[market] building market service…`);
  await run('pnpm', ['--filter', '@chameleon-ui/market-service', 'build'], { env: process.env });

  console.error(`[market] starting market service on ${SERVICE_HOST}:${SERVICE_PORT}…`);
  const serviceEnv = { ...process.env, CU_MARKET_HOST: SERVICE_HOST, CU_MARKET_PORT: String(SERVICE_PORT) };
  const service = spawn('node', ['packages/market-service/dist/cli.js'], {
    stdio: 'inherit',
    env: serviceEnv,
    shell: process.platform === 'win32',
  });

  try {
    await waitForHealth(SERVICE_URL);
    console.error(`[market] service healthy at ${SERVICE_URL}`);
    console.error(`[market] starting market UI…`);
    console.log(`Market UI: http://127.0.0.1:5178`);
    console.log(`Market API: ${SERVICE_URL}`);

    const appEnv = { ...process.env, CU_MARKET_SERVICE_URL: SERVICE_URL };
    await run('pnpm', ['--filter', '@chameleon-ui/market', 'dev'], { env: appEnv });
  } finally {
    service.kill();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
