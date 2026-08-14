import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const chameleonRoot = process.env.CU_MONOREPO ?? path.resolve(here, '../..')

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [here, chameleonRoot],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@ark-ui/react',
      'intl-messageformat',
      '@formatjs/icu-messageformat-parser',
    ],
  },
  resolve: {
    preserveSymlinks: true,
    dedupe: ['react', 'react-dom', '@ark-ui/react', 'intl-messageformat'],
  },
})
