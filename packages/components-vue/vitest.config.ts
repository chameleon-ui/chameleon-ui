import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    testTimeout: 20_000,
    maxWorkers: 2,
    fileParallelism: false,
  },
})
