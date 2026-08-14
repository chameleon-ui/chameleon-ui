/**
 * Print (default) or apply `npm link` for runtime packages an external
 * non-pnpm app needs. `workspace:*` is a pnpm protocol: linking only
 * `@chameleon-ui/components` fails because npm cannot fetch `workspace:*`.
 *
 * Publish path is unchanged: pnpm rewrites `workspace:*` to versions.
 * This script does not npm publish and does not invent an umbrella package.
 *
 * Usage (from chameleon-ui/):
 *   node ./scripts/link-external.mjs
 *   node ./scripts/link-external.mjs --apply
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { access } from 'node:fs/promises'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')

/** React consumer graph used by the stock-analyzer dogfood (2026-08-14). */
const runtimePackages = [
  'tokens',
  'i18n',
  'primitives',
  'themes',
  'components',
]

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

const dirs = runtimePackages.map((name) => ({
  name,
  dir: join(root, 'packages', name),
  spec: `@chameleon-ui/${name}`,
}))

console.log(
  apply
    ? 'link-external: npm link in dependency order (tokens → i18n → primitives → themes → components)'
    : 'link-external: print only. Pass --apply to run npm link in each package.',
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
console.log('In the external app (npm, not a pnpm workspace), link every package:')
console.log(
  `  npm link ${dirs.map((item) => item.spec).join(' ')}`,
)
console.log('Do not link only @chameleon-ui/components. After v0.1.0 publish, install from npm instead.')
if (!apply) {
  console.log('Dry run finished. Re-run with --apply to register the global links.')
}
