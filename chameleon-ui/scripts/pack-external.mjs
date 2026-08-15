/**
 * Pack the five runtime packages to dist-tarballs/ without npm publish.
 * External apps can `npm install ../chameleon-ui/dist-tarballs/<file>.tgz`.
 *
 * Usage (from chameleon-ui/, after a workspace build):
 *   node ./scripts/pack-external.mjs
 */
import { spawn } from 'node:child_process'
import { mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'dist-tarballs')
const vue = process.argv.includes('--vue')
const runtimePackages = vue
  ? ['tokens', 'i18n', 'primitives-vue', 'themes', 'components-vue']
  : ['tokens', 'i18n', 'primitives', 'themes', 'components']

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: false })
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
  await run(npmCommand(), ['pack', '--pack-destination', outDir], dir)
}

const files = (await readdir(outDir)).filter((file) => file.endsWith('.tgz')).sort()
console.log('')
console.log(`pack-external: wrote ${files.length} tarballs to ${outDir}`)
for (const file of files) console.log(`- ${file}`)
console.log('This is not npm publish. Versions are 0.1.0. In the consumer:')
console.log('  npm install <path-to-each>.tgz')
console.log(
  vue
    ? 'Link tokens + i18n + primitives-vue + themes + components-vue. Prefer templates/external-vite-vue.'
    : 'Link all five. Prefer templates/external-vite-react for Vite + Windows. Pass --vue to pack the Vue graph.',
)
