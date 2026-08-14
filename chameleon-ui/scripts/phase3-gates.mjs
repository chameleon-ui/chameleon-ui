import { gzipSync } from 'node:zlib'
import { access, readFile, readdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const S1_LIMIT_KB = 8
const VUE_SUBSET = ['button', 'input']

function fail(message) {
  console.error(`phase3:gates failed: ${message}`)
  process.exitCode = 1
}

function gzipKb(bytes) {
  return gzipSync(bytes).length / 1024
}

async function exists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

function runPnpm(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('corepack', ['pnpm@9.15.0', ...args], {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`corepack pnpm@9.15.0 ${args.join(' ')} exited ${code}`))
    })
  })
}

async function collectFiles(directory) {
  const files = []
  const entries = await readdir(directory, { withFileTypes: true, recursive: true })
  for (const entry of entries) {
    if (entry.isFile()) {
      files.push(join(entry.parentPath ?? directory, entry.name))
    }
  }
  return files
}

async function checkMvp20DataAi() {
  const catalog = JSON.parse(await readFile(join(root, 'packages/components/catalog.json'), 'utf8'))
  const mvp20 = catalog.components.slice(0, 20)
  if (mvp20.length !== 20) fail(`catalog MVP20 expected 20, got ${mvp20.length}`)

  const missing = []
  for (const component of mvp20) {
    const dir = join(root, 'packages/components/src', component.slug)
    const files = await collectFiles(dir)
    const source = (
      await Promise.all(
        files
          .filter((file) => /\.(tsx|ts)$/.test(file) && !/\.test\./.test(file) && !file.includes(`${join('locales')}`))
          .map((file) => readFile(file, 'utf8')),
      )
    ).join('\n')
    if (!source.includes('data-ai-role')) missing.push(`${component.slug}: data-ai-role`)
    if (!source.includes('data-ai-state')) missing.push(`${component.slug}: data-ai-state`)
  }

  if (missing.length > 0) fail(`A3.6 MVP20 data-ai: ${missing.join('; ')}`)
  else console.log(`[A3.6 ok] MVP20 data-ai-role + data-ai-state on ${mvp20.length} components`)
}

async function checkVueS1() {
  const jsPath = join(root, 'packages/components-vue/dist/index.js')
  const cssPath = join(root, 'packages/components-vue/dist/index.css')
  if (!(await exists(jsPath))) {
    fail(`Vue S1: missing ${jsPath} (build @chameleon-ui/components-vue first)`)
    return
  }

  const parts = [await readFile(jsPath)]
  if (await exists(cssPath)) parts.push(await readFile(cssPath))
  const kb = gzipKb(Buffer.concat(parts))
  const limit = S1_LIMIT_KB * VUE_SUBSET.length
  const message = `Vue subset (${VUE_SUBSET.join('+')} dist, vue/primitives external): ${kb.toFixed(3)} KB gzip (limit ${limit} = S1×${VUE_SUBSET.length})`
  if (kb > limit) fail(message)
  else console.log(`[S1 ok] ${message}`)
}

async function checkAdapterDemo() {
  const demoDir = join(root, 'packages/adapter-a2ui/demo')
  const required = ['README.md', 'form-submit.a2ui.json', 'FormSubmit.vue']
  for (const name of required) {
    if (!(await exists(join(demoDir, name)))) fail(`A3.2 demo missing ${name}`)
  }
  const doc = JSON.parse(await readFile(join(demoDir, 'form-submit.a2ui.json'), 'utf8'))
  if (doc.kind !== 'a2ui') fail('A3.2 demo document is not kind=a2ui')
  console.log('[A3.2 ok] adapter demo form-submit present')
}

async function checkStudioRoutes() {
  const app = await readFile(join(root, 'apps/theme-studio/src/App.tsx'), 'utf8')
  if (!app.includes("'/editor'") || !app.includes("'/export'")) {
    fail('A3.3 theme-studio missing /editor or /export routes')
    return
  }
  console.log('[A3.3 ok] theme-studio routes /editor and /export')
}

async function main() {
  const steps = [
    ['@chameleon-ui/themes', 'validate-rules'],
    ['@chameleon-ui/primitives-vue', 'test'],
    ['@chameleon-ui/components-vue', 'test'],
    ['@chameleon-ui/adapter-a2ui', 'test'],
    ['@chameleon-ui/theme-studio', 'test'],
    ['@chameleon-ui/registry-private', 'gate'],
  ]

  for (const [filter, script] of steps) {
    console.log(`\n[phase3:gates] ${filter} ${script}`)
    await runPnpm(['--filter', filter, script])
    if (process.exitCode) return
  }

  await checkMvp20DataAi()
  await checkVueS1()
  await checkAdapterDemo()
  await checkStudioRoutes()

  if (process.exitCode) return

  console.log(
    JSON.stringify(
      {
        ok: true,
        gates: [
          'validate-rules',
          'primitives-vue',
          'components-vue',
          'adapter-a2ui',
          'theme-studio',
          'registry-private',
          'mvp20-data-ai',
          'vue-s1',
        ],
        note: 'Phase 3 engineering gates. Not Lighthouse, not legal, not npm publish.',
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
