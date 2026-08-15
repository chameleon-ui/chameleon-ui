import { defineConfig } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 1,
  retries: 1,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [['list']],
  use: {
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm --filter @chameleon-ui/poc-ark-ui preview',
      cwd: workspaceRoot,
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'pnpm --filter @chameleon-ui/poc-base-ui preview',
      cwd: workspaceRoot,
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
})
