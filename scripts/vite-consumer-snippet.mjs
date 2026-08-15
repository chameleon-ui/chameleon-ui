/**
 * Vite snippet for an external (non-pnpm-workspace) consumer on Windows.
 * Printed by link-external.mjs; copied into templates/external-vite-react.
 */
export const VITE_CONSUMER_SNIPPET = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const chameleonRoot = process.env.CU_MONOREPO ?? path.resolve(here, '../../chameleon-ui')

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
    // Last-resort aliases if a file: install fails CSS exports. Prefer the
    // official specifiers first:
    //   @chameleon-ui/themes/<id>/css
    //   @chameleon-ui/tokens/css
    //   @chameleon-ui/tokens/density.css
    // alias: {
    //   '@chameleon-ui/themes/cupertino/css': path.join(chameleonRoot, 'packages/themes/dist/cupertino/variables.css'),
    //   '@chameleon-ui/tokens/css': path.join(chameleonRoot, 'packages/tokens/dist/css/variables.css'),
    //   '@chameleon-ui/tokens/density.css': path.join(chameleonRoot, 'packages/tokens/dist/css/density.css'),
    // },
  },
})
`

export const VERSION_MATRIX = {
  node: '>=20.19.0',
  react: '^19.0.0',
  vue: '^3.5.0',
  arkUi: '5.38.0',
  arkUiVue: '5.38.1',
  intlMessageformat: '11.2.13',
  icuParser: '3.5.14',
}

export const VITE_CONSUMER_SNIPPET_VUE = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const chameleonRoot = process.env.CU_MONOREPO ?? path.resolve(here, '../../chameleon-ui')

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
    // Last-resort aliases if a file: install fails CSS exports. Prefer:
    //   @chameleon-ui/themes/<id>/css
    //   @chameleon-ui/tokens/css
    //   @chameleon-ui/tokens/density.css
    //   @chameleon-ui/components-vue/css
  },
})
`
