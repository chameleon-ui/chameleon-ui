import { defineConfig } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const monorepoRoot = path.resolve(packageRoot, '..')
const skipWebServer = process.env.CU_VR_SKIP_WEBSERVER === '1'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixels: 120,
    },
  },
  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.join(packageRoot, 'artifacts', 'html') }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  ...(skipWebServer
    ? {}
    : {
        webServer: [
          {
            command: 'pnpm --filter @chameleon-ui/poc-ark-ui preview',
            cwd: monorepoRoot,
            url: 'http://127.0.0.1:4173',
            reuseExistingServer: false,
            timeout: 120_000,
          },
          {
            command: 'pnpm --filter @chameleon-ui/internal-demo preview',
            cwd: monorepoRoot,
            url: 'http://127.0.0.1:4175',
            reuseExistingServer: false,
            timeout: 120_000,
          },
        ],
      }),
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
})
