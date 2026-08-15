/**
 * Windows-safe GenUI-Bench runner (avoids nested bare `pnpm` when only
 * `corepack pnpm@9.15.0` is available on PATH).
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = join(root, 'benchmarks', 'genui-bench')

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}`))
    })
  })
}

await run('corepack', ['pnpm@9.15.0', 'exec', 'tsc', '-p', 'tsconfig.json'], pkg)
await run(process.execPath, ['dist/index.js'], pkg)
