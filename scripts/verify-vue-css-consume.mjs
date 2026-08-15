/**
 * Acceptance: brand-new external Vite Vue app, only the Vue umbrella + one CSS
 * import, zero Vite aliases — first-screen CSS must include full cu-* styles.
 *
 * Usage (from chameleon-ui/, after building the Vue graph):
 *   node ./scripts/verify-vue-css-consume.mjs
 *
 * Optional:
 *   node ./scripts/verify-vue-css-consume.mjs --vite=6
 *   node ./scripts/verify-vue-css-consume.mjs --keep
 *   node ./scripts/verify-vue-css-consume.mjs --file   # skip pack; use file: to packages/vue
 */
import { spawn } from 'node:child_process'
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const keep = process.argv.includes('--keep')
const useFile = process.argv.includes('--file')
const viteArg = process.argv.find((a) => a.startsWith('--vite='))
const viteMajor = viteArg ? viteArg.slice('--vite='.length) : '6'
const viteVersion = viteMajor === '6' ? '6.3.5' : viteMajor === '8' ? '8.2.1' : viteMajor

const vuePkgPath = join(root, 'packages/vue/package.json')
const vuePkg = JSON.parse(await readFile(vuePkgPath, 'utf8'))
const version = vuePkg.version
const tarballName = `chameleon-ui-vue-${version}.tgz`
const tarballPath = join(root, 'dist-tarballs', tarballName)

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, npm_config_fund: 'false' },
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}`))
    })
  })
}

function cssExportTarget(entry) {
  if (typeof entry === 'string') return entry
  if (entry && typeof entry === 'object') {
    return entry.style ?? entry.default ?? entry.import
  }
  return undefined
}

async function assertBuiltCss() {
  const css = join(root, 'packages/vue/dist/css.css')
  try {
    await access(css)
  } catch {
    throw new Error(
      `missing ${css}. Run: corepack pnpm@9.15.0 --filter @chameleon-ui/vue... build`,
    )
  }
  if (cssExportTarget(vuePkg.exports?.['./css']) !== './dist/css.css') {
    throw new Error(
      `@chameleon-ui/vue exports ./css must target ./dist/css.css (got ${JSON.stringify(vuePkg.exports?.['./css'])})`,
    )
  }
}

await assertBuiltCss()

if (!useFile) {
  console.log('verify-vue-css-consume: packing umbrella tarball…')
  await run(process.execPath, [join(root, 'scripts/pack-external.mjs'), '--vue'], root)
  await access(tarballPath)
}

const work = await mkdtemp(join(tmpdir(), 'cu-vue-css-consume-'))
const srcDir = join(work, 'src')
await mkdir(srcDir, { recursive: true })

const umbrellaDep = useFile
  ? `file:${join(root, 'packages/vue').replace(/\\/g, '/')}`
  : `file:${tarballPath.replace(/\\/g, '/')}`

await writeFile(
  join(work, 'package.json'),
  `${JSON.stringify(
    {
      name: 'cu-vue-css-consume',
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: { build: 'vite build' },
      dependencies: {
        '@chameleon-ui/vue': umbrellaDep,
        '@ark-ui/vue': '5.38.1',
        '@formatjs/icu-messageformat-parser': '3.5.14',
        'intl-messageformat': '11.2.13',
        vue: '3.5.13',
      },
      devDependencies: {
        '@vitejs/plugin-vue': viteMajor === '6' ? '5.2.3' : '6.0.8',
        typescript: '5.9.3',
        vite: viteVersion,
      },
    },
    null,
    2,
  )}\n`,
)

await writeFile(
  join(work, 'vite.config.ts'),
  `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Zero resolve.alias — package exports must be enough.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    preserveSymlinks: true,
    dedupe: ['vue', '@ark-ui/vue', 'intl-messageformat'],
  },
})
`,
)

await writeFile(
  join(work, 'index.html'),
  `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>cu-vue-css-consume</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
)

await writeFile(
  join(work, 'src/main.ts'),
  `import { createApp } from 'vue'
import '@chameleon-ui/vue/css'
import App from './App.vue'

createApp(App).mount('#app')
`,
)

await writeFile(
  join(work, 'src/App.vue'),
  `<script setup lang="ts">
import { Button, ThemeProvider } from '@chameleon-ui/vue'
</script>

<template>
  <ThemeProvider theme="line" locale="zh-CN">
    <Button>Accept</Button>
  </ThemeProvider>
</template>
`,
)

console.log(`verify-vue-css-consume: workdir ${work}`)
console.log(
  `vite@${viteVersion} · @chameleon-ui/vue@${version} via ${useFile ? 'file: packages/vue' : `tarball ${tarballName}`} · single CSS import`,
)

await run(npmCommand(), ['install'], work)
await run(npmCommand(), ['run', 'build'], work)

const assets = join(work, 'dist/assets')
const files = await readdir(assets)
const cssFile = files.find((name) => name.endsWith('.css'))
if (!cssFile) throw new Error('vite build produced no CSS asset')
const css = await readFile(join(assets, cssFile), 'utf8')

const required = [
  { name: 'token --cu-color-fg-default', re: /--cu-color-fg-default/ },
  { name: 'density --cu-density-active', re: /--cu-density-active/ },
  { name: 'component .cu-button', re: /\.cu-button\b/ },
]
const missing = required.filter((item) => !item.re.test(css))
if (missing.length > 0) {
  throw new Error(
    `built CSS missing ${missing.map((m) => m.name).join(', ')} (asset ${cssFile}, ${css.length} chars)`,
  )
}

console.log(`verify-vue-css-consume: ok (${cssFile}, ${css.length} chars, cu-* present)`)
console.log('Acceptance recipe:')
console.log('  corepack pnpm@9.15.0 --filter @chameleon-ui/vue... build')
console.log('  node ./scripts/verify-vue-css-consume.mjs')

if (!keep) {
  await rm(work, { recursive: true, force: true })
} else {
  console.log(`kept workdir: ${work}`)
}
