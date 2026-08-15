/**
 * Pack the five runtime packages to dist-tarballs/ without npm publish.
 * External apps can `npm install ../chameleon-ui/dist-tarballs/<file>.tgz`.
 * This is the first-class distribution path until a real npm registry publish.
 *
 * Usage (from chameleon-ui/, after a workspace build):
 *   node ./scripts/pack-external.mjs
 *   node ./scripts/pack-external.mjs --vue
 */
import { spawn } from 'node:child_process'
import { mkdir, readFile, readdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'dist-tarballs')
const vue = process.argv.includes('--vue')
const runtimePackages = vue
  ? ['tokens', 'i18n', 'primitives-vue', 'themes', 'components-vue']
  : ['tokens', 'i18n', 'primitives', 'themes', 'components']

const version = JSON.parse(
  await readFile(join(root, 'packages', runtimePackages[0], 'package.json'), 'utf8'),
).version

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    // Windows: spawning *.cmd requires shell (Node EINVAL otherwise).
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

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

for (const name of runtimePackages) {
  const dir = join(root, 'packages', name)
  const pkg = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'))
  if (pkg.version !== version) {
    throw new Error(
      `version skew: @chameleon-ui/${name} is ${pkg.version}, expected ${version} (from ${runtimePackages[0]})`,
    )
  }
  await run(npmCommand(), ['pack', '--pack-destination', outDir], dir)
}

const files = (await readdir(outDir)).filter((file) => file.endsWith('.tgz')).sort()
console.log('')
console.log(`pack-external: wrote ${files.length} tarballs (v${version}) to ${outDir}`)
for (const file of files) console.log(`- ${file}`)
console.log('This is not npm publish. Tarball/pack is the supported pre-registry path.')
console.log('In the consumer:')
console.log('  npm install <path-to-each>.tgz')
console.log(
  vue
    ? 'Install tokens + i18n + primitives-vue + themes + components-vue. Prefer templates/external-vite-vue.'
    : 'Install all five. Prefer templates/external-vite-react for Vite + Windows. Pass --vue to pack the Vue graph.',
)
