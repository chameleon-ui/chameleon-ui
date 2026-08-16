/**
 * Print (default) or apply `npm link` for runtime packages an external
 * non-pnpm app needs. Default path is the **umbrella** package
 * (`@chameleon-ui/react` / `--vue` → `@chameleon-ui/vue`). Underlying five
 * packages are still linked so `workspace:*` inside the monorepo resolves.
 *
 * Legacy five-only consumer link: `--legacy-five`.
 *
 * Usage (from chameleon-ui/):
 *   node ./scripts/link-external.mjs
 *   node ./scripts/link-external.mjs --apply
 *   node ./scripts/link-external.mjs --vue --apply
 *   node ./scripts/link-external.mjs --legacy-five --apply
 *   node ./scripts/link-external.mjs --print-vite
 *   node ./scripts/link-external.mjs --print-vite-vue
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { access, readFile } from 'node:fs/promises'
import {
  VERSION_MATRIX,
  VITE_CONSUMER_SNIPPET,
  VITE_CONSUMER_SNIPPET_VUE,
} from './vite-consumer-snippet.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const printVite = process.argv.includes('--print-vite')
const printViteVue = process.argv.includes('--print-vite-vue')
const vue = process.argv.includes('--vue')
const legacyFive = process.argv.includes('--legacy-five')

const runtimePackages = vue
  ? ['tokens', 'i18n', 'primitives-vue', 'themes', 'components-vue']
  : ['tokens', 'i18n', 'primitives', 'themes', 'components-react']
const umbrellaName = vue ? 'vue' : 'react'
const umbrellaSpec = `@chameleon-ui/${umbrellaName}`

const packageVersion = JSON.parse(
  await readFile(join(root, 'packages', umbrellaName, 'package.json'), 'utf8'),
).version

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}`))
    })
  })
}

if (printViteVue) {
  console.log(VITE_CONSUMER_SNIPPET_VUE)
  process.exit(0)
}

if (printVite) {
  console.log(VITE_CONSUMER_SNIPPET)
  process.exit(0)
}

const linkNames = legacyFive ? [...runtimePackages] : [...runtimePackages, umbrellaName]
const dirs = linkNames.map((name) => ({
  name,
  dir: join(root, 'packages', name),
  spec: `@chameleon-ui/${name}`,
}))

const order = legacyFive
  ? vue
    ? 'tokens → i18n → primitives-vue → themes → components-vue'
    : 'tokens → i18n → primitives → themes → components'
  : vue
    ? 'tokens → i18n → primitives-vue → themes → components-vue → vue'
    : 'tokens → i18n → primitives → themes → components → react'

console.log(
  apply
    ? `link-external: npm link in dependency order (${order})`
    : 'link-external: print only. Pass --apply to run npm link in each package. Pass --vue for the Vue graph. Pass --legacy-five for five-only (no umbrella).',
)

for (const item of dirs) {
  await access(join(item.dir, 'package.json'))
  const line = `npm link  # in ${item.dir}`
  console.log(`- ${item.spec}: ${line}`)
  if (apply) {
    await run(npmCommand(), ['link'], item.dir)
  }
}

console.log('')
if (legacyFive) {
  console.log('In the external app (npm, not a pnpm workspace), link every package:')
  console.log(`  npm link ${dirs.map((item) => item.spec).join(' ')}`)
  if (vue) {
    console.log('Do not link only @chameleon-ui/components-vue. After npm publish, install from npm instead.')
  } else {
    console.log('Do not link only @chameleon-ui/components-react. After npm publish, install from npm instead.')
  }
} else {
  console.log('In the external app (npm, not a pnpm workspace), link the umbrella only:')
  console.log(`  npm link ${umbrellaSpec}`)
  console.log(
    `(Underlying five packages were still registered globally so monorepo workspace:* resolves.)`,
  )
}
console.log('')
console.log('Pin these versions at the app root (peer matrix):')
console.log(`  Node ${VERSION_MATRIX.node}`)
if (vue) {
  console.log(`  vue ${VERSION_MATRIX.vue}`)
  console.log(`  @ark-ui/vue ${VERSION_MATRIX.arkUiVue}`)
} else {
  console.log(`  react / react-dom ${VERSION_MATRIX.react}`)
  console.log(`  @ark-ui/react ${VERSION_MATRIX.arkUi}`)
}
console.log(`  intl-messageformat ${VERSION_MATRIX.intlMessageformat}`)
console.log(`  @formatjs/icu-messageformat-parser ${VERSION_MATRIX.icuParser}`)
console.log('')
console.log(`Package version on disk: ${packageVersion} (unpublished; prefer file: / npm link / pack-external tarballs)`)
console.log('Official Vite consumer templates:')
console.log('  React: templates/external-vite-react')
console.log('  Vue:   templates/external-vite-vue')
console.log('Print a Windows-ready vite.config.ts:')
console.log('  node ./scripts/link-external.mjs --print-vite')
console.log('  node ./scripts/link-external.mjs --print-vite-vue')
console.log(
  'Tarballs (one umbrella by default): node ./scripts/pack-external.mjs   # add --vue; --legacy-five for five-pack',
)
console.log('Verify templates: node ./scripts/verify-external-templates.mjs   # add --build for vite build')
if (!apply) {
  console.log('Dry run finished. Re-run with --apply to register the global links.')
}
