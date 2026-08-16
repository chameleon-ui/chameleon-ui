/**
 * Zip chameleon-ui monorepo source for release handoff (not npm publish).
 * Uses `git archive` of the chameleon-ui tree so node_modules / local junk stay out.
 *
 * Usage (from chameleon-ui/):
 *   node ./scripts/pack-source.mjs
 *   pnpm pack:source
 *
 * Output:
 *   dist-release/chameleon-ui-<version>-source.zip
 *
 * Note: only **committed** files are included. Commit changelog/scripts first, then pack.
 */
import { spawn } from 'node:child_process'
import { mkdir, readFile, rm, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = join(root, '..')
const pkgVersion = JSON.parse(
  await readFile(join(root, 'packages', 'components-react', 'package.json'), 'utf8'),
).version

const outDir = join(root, 'dist-release')
const outFile = join(outDir, `chameleon-ui-${pkgVersion}-source.zip`)
const prefix = `chameleon-ui-${pkgVersion}/`

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    })
    let stderr = ''
    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk)
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}${stderr ? `\n${stderr}` : ''}`))
    })
  })
}

await mkdir(outDir, { recursive: true })
await rm(outFile, { force: true })

await run(
  'git',
  [
    'archive',
    '--format=zip',
    `--prefix=${prefix}`,
    '-o',
    outFile,
    'HEAD:chameleon-ui',
  ],
  workspaceRoot,
)

const info = await stat(outFile)
const mb = (info.size / (1024 * 1024)).toFixed(2)
console.log(`pack-source: wrote ${outFile}`)
console.log(`pack-source: size ${mb} MiB (git archive of chameleon-ui @ ${pkgVersion})`)
console.log('Excluded by design: untracked files, node_modules, .idea, .tmp-chrome-audit, etc.')
console.log('This is monorepo source, not npm publish. Per-package tarballs: node ./scripts/pack-external.mjs')
