#!/usr/bin/env node
/**
 * Deterministic full-workspace clean for package/publish.
 *
 * WHY: turbo caches build outputs under `.turbo/` (see turbo.json `outputs:
 * ["dist/**"]`). If a previous dist hash matches the current source input, a
 * later `turbo run build` will happily restore the OLD dist straight from the
 * cache — so `rm -rf dist` alone is never enough and looks like "clean keeps
 * rolling back to the old build". This script wipes the cache itself, then all
 * dist and tsc build-info markers, so the next build cannot short-circuit.
 */
import { rmSync, readdirSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function rmRecursive(path) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true })
}

function walkDirs(dir, depth, collect) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const full = join(dir, entry.name)
    if (entry.name === 'node_modules') continue
    collect(full)
    if (depth > 0) walkDirs(full, depth - 1, collect)
  }
}

const deleted = []
function track(path) {
  deleted.push(path.replace(root, '.'))
}

// 0) Windows pnpm shim stubs (0-byte .cmd leaves, not git-tracked, not needed).
for (const stub of ['.pnpm-shim', '.tools']) {
  rmRecursive(join(root, stub))
  track(join(root, stub))
}

// 1) turbo build-output cache — the actual source of the "rollback to old dist".
rmRecursive(join(root, '.turbo'))
track(join(root, '.turbo'))

// 2) all `dist` folders anywhere in the workspace (packages + apps).
walkDirs(root, 3, (p) => {
  if (p.endsWith('dist')) {
    rmRecursive(p)
    track(p)
  }
})

// 3) tsc .tsbuildinfo markers (in case incremental/composite is ever enabled).
walkDirs(root, 3, (p) => {
  if (p.endsWith('.tsbuildinfo')) {
    rmRecursive(p)
    track(p)
  }
})

console.log('[clean] removed:')
for (const p of deleted) console.log(`  ${p}`)
console.log(`[clean] done. next run of \`build\` starts from a cold workspace.`)
