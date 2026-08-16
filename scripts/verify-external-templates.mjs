/**
 * Typecheck (and optionally Vite-build) the official external consumer templates
 * against workspace packages via file: deps (one umbrella package). Run from
 * chameleon-ui/ after a library build of the React and/or Vue graphs.
 *
 * Usage:
 *   node ./scripts/verify-external-templates.mjs
 *   node ./scripts/verify-external-templates.mjs --build
 *   node ./scripts/verify-external-templates.mjs --react-only
 *   node ./scripts/verify-external-templates.mjs --vue-only
 *   node ./scripts/verify-external-templates.mjs --skip-install
 */
import { spawn } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const doBuild = process.argv.includes('--build')
const skipInstall = process.argv.includes('--skip-install')
const reactOnly = process.argv.includes('--react-only')
const vueOnly = process.argv.includes('--vue-only')

const version = JSON.parse(
  await readFile(join(root, 'packages/react/package.json'), 'utf8'),
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
      else reject(new Error(`${command} ${args.join(' ')} exited ${code} (cwd=${cwd})`))
    })
  })
}

async function assertDist(pkgDir) {
  const marker = join(root, 'packages', pkgDir, 'dist')
  try {
    await access(marker)
  } catch {
    throw new Error(
      `missing ${marker}. Build the graph first, e.g. corepack pnpm@9.15.0 --filter @chameleon-ui/${pkgDir} build`,
    )
  }
}

const templates = []
if (!vueOnly) {
  templates.push({
    id: 'react',
    dir: join(root, 'templates/external-vite-react'),
    packages: ['tokens', 'i18n', 'primitives', 'themes', 'components-react', 'react'],
    typecheck: ['run', 'typecheck'],
    build: ['run', 'build'],
  })
}
if (!reactOnly) {
  templates.push({
    id: 'vue',
    dir: join(root, 'templates/external-vite-vue'),
    packages: ['tokens', 'i18n', 'primitives-vue', 'themes', 'components-vue', 'vue'],
    typecheck: ['run', 'typecheck'],
    build: ['run', 'build'],
  })
}

console.log(`verify-external-templates: package version ${version} (unpublished; umbrella file: / pack-external)`)
console.log(doBuild ? 'mode: typecheck + vite build' : 'mode: typecheck only (pass --build for vite build)')

for (const template of templates) {
  for (const name of template.packages) await assertDist(name)
  console.log(`\n== ${template.id}: ${template.dir}`)
  if (!skipInstall) {
    await run(npmCommand(), ['install'], template.dir)
  }
  await run(npmCommand(), template.typecheck, template.dir)
  if (doBuild) {
    await run(npmCommand(), template.build, template.dir)
  }
}

console.log('\nverify-external-templates: ok')
console.log(
  `Documented pin for consumers: @chameleon-ui/react|vue@${version} via file: / npm link / pack-external umbrella tarball — not npm registry.`,
)
console.log('Print Vite snippets: node ./scripts/link-external.mjs --print-vite | --print-vite-vue')
console.log('Tarballs: node ./scripts/pack-external.mjs   # add --vue; --legacy-five for five-pack')
