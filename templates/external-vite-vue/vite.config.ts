import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const chameleonRoot = process.env.CU_MONOREPO ?? path.resolve(here, '../..')

export default defineConfig({
  plugins: [vue()],
  server: {
    fs: {
      allow: [here, chameleonRoot],
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      '@ark-ui/vue',
      'intl-messageformat',
      '@formatjs/icu-messageformat-parser',
    ],
  },
  resolve: {
    preserveSymlinks: true,
    dedupe: ['vue', '@ark-ui/vue', 'intl-messageformat'],
  },
})
