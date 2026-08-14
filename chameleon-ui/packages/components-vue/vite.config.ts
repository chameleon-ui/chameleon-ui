import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ChameleonComponentsVue',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@chameleon-ui/primitives-vue', '@chameleon-ui/tokens'],
    },
    cssCodeSplit: false,
    outDir: 'dist',
  },
})
