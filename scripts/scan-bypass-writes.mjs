/**
 * Phase 8 A2 hard gate: prove install-core is the ONLY disk-write path.
 *
 * Scans every runtime entry surface (cli / mcp-server / adapters /
 * schema-renderer / market-service / docs app / market app) for direct fs
 * write calls. Any hit outside install-core fails the gate.
 * Run: node scripts/scan-bypass-writes.mjs
 */
import { readdir, readFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const SCAN_ROOTS = [
  'packages/cli/src',
  'packages/mcp-server/src',
  'packages/adapter-a2ui/src',
  'packages/adapter-mcp-apps/src',
  'packages/adapter-ag-ui/src',
  'packages/schema-renderer/src',
  'packages/market-service/src',
  'apps/docs/src',
  'apps/market/src',
  'apps/internal-demo/src',
  'apps/theme-studio/src',
]

// Red-proof hook for the Phase 8 gate: append an extra fixture root and
// confirm the scanner goes red. Never set in production runs.
if (process.env.CU_SCAN_EXTRA_ROOT) {
  SCAN_ROOTS.push(process.env.CU_SCAN_EXTRA_ROOT)
}

// Direct disk-write APIs that would constitute a second write path.
// install-core (packages/install-core) is the only package allowed to call them.
const WRITE_CALL =
  /\b(writeFile|writeFileSync|appendFile|appendFileSync|createWriteStream|mkdir|mkdirSync|rm|rmSync|rename|renameSync|copyFile|copyFileSync|cp|cpSync)\s*\(/

async function* walk(directory) {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const fullPath = join(directory, entry.name)
    if (entry.isDirectory()) {
      yield* walk(fullPath)
    } else if (/\.(ts|tsx|mts|cts|js|mjs|cjs)$/.test(entry.name)) {
      yield fullPath
    }
  }
}

function isCommentLine(line) {
  const trimmed = line.trim()
  return trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')
}

async function main() {
  const violations = []
  let scanned = 0

  for (const scanRoot of SCAN_ROOTS) {
    // Absolute extra roots (CU_SCAN_EXTRA_ROOT red-proof) must not be joined onto
    // the repo path: Node win32 join keeps the drive prefix and ENOENTs.
    const resolved = isAbsolute(scanRoot) ? scanRoot : join(root, scanRoot)
    for await (const filePath of walk(resolved)) {
      if (/\.(test|spec)\.(ts|tsx|js|mjs)$/.test(filePath)) continue
      if (filePath.includes(`${join('src', 'test')}`)) continue
      scanned += 1
      const source = await readFile(filePath, 'utf8')
      const lines = source.split('\n')
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index]
        if (isCommentLine(line)) continue
        if (WRITE_CALL.test(line)) {
          violations.push(`${relative(root, filePath)}:${index + 1}: ${line.trim()}`)
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error(
      [
        'bypass-write scan failed: direct fs write calls outside install-core.',
        ...violations.map((violation) => `  - ${violation}`),
        'All installs must go through @chameleon-ui/install-core (单核不可破).',
      ].join('\n'),
    )
    process.exitCode = 1
    return
  }

  console.log(
    `[scan-bypass-writes] clean: ${scanned} files across ${SCAN_ROOTS.length} surfaces; install-core is the only write path`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
