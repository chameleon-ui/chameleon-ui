/**
 * Vue S1 gzip gate — same 8KB ceiling and peer-external rule as React S1.
 * Peers: vue, @chameleon-ui/primitives-vue, @chameleon-ui/tokens.
 * Writes docs/project/reports/Phase-6-Vue-S1.json with measured KB (not invented).
 */
import { gzipSync } from 'node:zlib'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const vueRoot = path.join(workspaceRoot, 'packages', 'components-vue')
const budgetsPath = path.join(workspaceRoot, 'benchmarks', 'budgets.json')
const reportPath = path.join(workspaceRoot, '..', 'docs', 'project', 'reports', 'Phase-6-Vue-S1.json')
const require = createRequire(path.join(vueRoot, 'package.json'))

function gzipKb(bytes) {
  return gzipSync(bytes).length / 1024
}

async function loadVite() {
  const viteHref = pathToFileURL(require.resolve('vite')).href
  const pluginHref = pathToFileURL(require.resolve('@vitejs/plugin-vue')).href
  const viteMod = await import(viteHref)
  const pluginMod = await import(pluginHref)
  return {
    build: viteMod.build,
    vue: pluginMod.default ?? pluginMod,
  }
}

async function bundleSlug(build, vue, slug) {
  const result = await build({
    configFile: false,
    root: vueRoot,
    logLevel: 'error',
    plugins: [vue()],
    build: {
      write: false,
      emptyOutDir: false,
      minify: true,
      cssCodeSplit: false,
      lib: {
        entry: path.join(vueRoot, 'src', slug, 'index.ts'),
        name: 'ChameleonVueS1',
        formats: ['es'],
        fileName: () => 'index.js',
      },
      rollupOptions: {
        external: ['vue', '@chameleon-ui/primitives-vue', '@chameleon-ui/tokens'],
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const parts = []
  for (const output of outputs) {
    for (const item of output.output) {
      if (item.type === 'asset') {
        const source = item.source
        parts.push(Buffer.isBuffer(source) ? source : Buffer.from(source))
      } else {
        parts.push(Buffer.from(item.code))
      }
    }
  }
  return gzipKb(Buffer.concat(parts))
}

async function listVueSlugs() {
  const src = path.join(vueRoot, 'src')
  const entries = await readdir(src, { withFileTypes: true })
  const slugs = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const files = await readdir(path.join(src, entry.name))
    if (files.some((name) => name.endsWith('.vue'))) slugs.push(entry.name)
  }
  return slugs.sort((a, b) => a.localeCompare(b, 'en'))
}

async function main() {
  const budgets = JSON.parse(await readFile(budgetsPath, 'utf8'))
  const limit = budgets.metrics.S1.limitKbGzip
  const slugs = await listVueSlugs()
  const { build, vue } = await loadVite()
  const components = []
  let failed = false

  for (const slug of slugs) {
    const kb = await bundleSlug(build, vue, slug)
    const ok = kb <= limit
    const message = `${slug}: ${kb.toFixed(3)} KB gzip (limit ${limit})`
    console.log(`[S1-vue ${ok ? 'ok' : 'FAIL'}] ${message}`)
    components.push({ slug, kbGzip: Number(kb.toFixed(3)), limitKbGzip: limit, ok })
    if (!ok) failed = true
  }

  const record = {
    measuredAt: '2026-08-14',
    tool: 'benchmarks/scripts/check-vue-size.mjs',
    unit: 'kb_gzip',
    peerExternalized: ['vue', '@chameleon-ui/primitives-vue', '@chameleon-ui/tokens'],
    metricId: 'S1',
    count: slugs.length,
    limitKbGzip: limit,
    components,
    note: 'Measured Vite lib bundles, minify on, CSS included. Not a freeze-meeting signature. Owner 待指定.',
  }
  await mkdir(path.dirname(reportPath), { recursive: true })
  await writeFile(reportPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8')
  console.log(`[S1-vue] wrote ${path.relative(workspaceRoot, reportPath).replaceAll('\\', '/')}`)

  if (slugs.length < 20) {
    console.error(`phase6 Vue S1: count ${slugs.length} < 20`)
    failed = true
  }
  if (failed) process.exitCode = 1
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
