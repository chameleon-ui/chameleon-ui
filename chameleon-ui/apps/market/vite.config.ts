import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const MARKET_SERVICE_URL = process.env.CU_MARKET_SERVICE_URL ?? 'http://127.0.0.1:8788'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5178,
    strictPort: true,
    proxy: {
      '/api': {
        target: MARKET_SERVICE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4178,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
