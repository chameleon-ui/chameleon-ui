import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'cu-emit-css-import',
      enforce: 'post',
      generateBundle(_options, bundle) {
        const js = Object.values(bundle).find((item) => item.type === 'chunk' && 'isEntry' in item && item.isEntry)
        const css = Object.values(bundle).find(
          (item) => item.type === 'asset' && String(item.fileName).endsWith('.css'),
        )
        if (js && js.type === 'chunk' && css && css.type === 'asset' && !js.code.includes(`import './${css.fileName}'`)) {
          js.code = `import './${css.fileName}';\n${js.code}`
        }
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ChameleonComponentsVue',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@chameleon-ui/i18n', '@chameleon-ui/primitives-vue', '@chameleon-ui/tokens'],
      output: {
        assetFileNames: 'index.css',
      },
    },
    cssCodeSplit: false,
    outDir: 'dist',
  },
})
