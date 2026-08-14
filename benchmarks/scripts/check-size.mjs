import { gzipSync } from 'node:zlib'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const budgetsPath = path.join(workspaceRoot, 'benchmarks', 'budgets.json')
const catalogPath = path.join(workspaceRoot, 'packages', 'components', 'catalog.json')

function gzipKb(bytes) {
  return gzipSync(bytes).length / 1024
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

/**
 * Deterministic high-entropy bytes so gzip cannot collapse the S1 reject sample.
 * A `'x'.repeat(n)` fixture is not valid evidence — gzip stores that in tens of bytes.
 */
function makeOversizeBytes() {
  let state = 0xc0ffee >>> 0
  const bytes = Buffer.alloc(12_288)
  for (let index = 0; index < bytes.length; index += 1) {
    state ^= state << 13
    state >>>= 0
    state ^= state >>> 17
    state >>>= 0
    state ^= state << 5
    state >>>= 0
    bytes[index] = state & 0xff
  }
  return bytes
}

function fail(metricId, message) {
  return { metricId, ok: false, message }
}

function pass(metricId, message) {
  return { metricId, ok: true, message }
}

async function pathExists(target) {
  try {
    await stat(target)
    return true
  } catch {
    return false
  }
}

async function collectFiles(directory) {
  const files = []
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)))
    } else {
      files.push(fullPath)
    }
  }
  return files
}

async function bundleEntry(entry) {
  const result = await esbuild.build({
    absWorkingDir: workspaceRoot,
    entryPoints: [entry],
    bundle: true,
    write: false,
    outdir: path.join(workspaceRoot, 'benchmarks', '.tmp-size'),
    format: 'esm',
    platform: 'browser',
    minify: true,
    jsx: 'automatic',
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    plugins: [
      {
        name: 'external-headless',
        setup(build) {
          build.onResolve({ filter: /^@ark-ui\// }, (args) => ({
            path: args.path,
            external: true,
          }))
          build.onResolve({ filter: /^@zag-js\// }, (args) => ({
            path: args.path,
            external: true,
          }))
        },
      },
    ],
  })

  const combined = Buffer.concat(result.outputFiles.map((file) => Buffer.from(file.contents)))
  return gzipKb(combined)
}

async function measureDirectory(directory) {
  const files = await collectFiles(directory)
  const combined = Buffer.concat(await Promise.all(files.map((file) => readFile(file))))
  return gzipKb(combined)
}

async function main() {
  const budgets = JSON.parse(await readFile(budgetsPath, 'utf8'))
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
  const reports = []
  const onlyFlag = process.argv.find((arg) => typeof arg === 'string' && arg.startsWith('--only='))
  const requested = onlyFlag
    ? new Set(onlyFlag.slice('--only='.length).split(',').filter(Boolean))
    : null
  function want(metricId) {
    return !requested || requested.has(metricId)
  }

  const s1Limit = budgets.metrics.S1.limitKbGzip
  const s1Rows = budgets.metrics.S1.rows ?? []
  const s1RowBySlug = new Map(s1Rows.map((row) => [row.slug, row]))
  const complete = catalog.components.filter(
    (item) => item.implementation === 'complete' && item.tier === 'base',
  )
  const s1Items = [...complete]
  const s1Seen = new Set(complete.map((item) => item.slug))
  const s1Required = [
    ...(budgets.metrics.S1.requiredSlugs ?? []),
    ...s1Rows.map((row) => row.slug),
  ]
  for (const slug of s1Required) {
    if (s1Seen.has(slug)) continue
    const extra = catalog.components.find((item) => item.slug === slug)
    if (!extra) {
      if (want('S1')) reports.push(fail('S1', `${slug}: required S1 slug missing from catalog`))
      continue
    }
    s1Items.push(extra)
    s1Seen.add(slug)
  }

  const s1Measured = new Set()
  if (want('S1')) {
    for (const item of s1Items) {
      const entry = path.join(workspaceRoot, 'packages', 'components', 'src', item.slug, 'index.ts')
      if (!(await pathExists(entry))) {
        reports.push(fail('S1', `${item.slug}: missing entry ${entry}`))
        continue
      }
      const kb = await bundleEntry(entry)
      const limit = s1RowBySlug.get(item.slug)?.limitKbGzip ?? s1Limit
      const message = `${item.slug}: ${kb.toFixed(3)} KB gzip (limit ${limit})`
      reports.push(kb <= limit ? pass('S1', message) : fail('S1', message))
      s1Measured.add(item.slug)
    }
    for (const row of s1Rows) {
      if (!s1Measured.has(row.slug)) {
        reports.push(fail('S1', `${row.slug}: budget row was not measured`))
      }
    }

    const oversizeKb = gzipKb(makeOversizeBytes())
    if (oversizeKb <= s1Limit) {
      reports.push(
        fail(
          'S1',
          `oversize comparator input was ${oversizeKb.toFixed(3)} KB gzip; it must exceed ${s1Limit} so the gate can reject it`,
        ),
      )
    } else {
      reports.push(
        pass(
          'S1',
          `oversize sample rejected as expected (${oversizeKb.toFixed(3)} KB gzip > ${s1Limit})`,
        ),
      )
    }
  }

  const s2 = budgets.metrics.S2
  if (s2 && want('S2')) {
    const s2Rows = s2.rows ?? []
    const s2RowBySlug = new Map(s2Rows.map((row) => [row.slug, row]))
    const s2Slugs = [...new Set([...(s2.components ?? []), ...s2Rows.map((row) => row.slug)])]
    for (const slug of s2Slugs) {
      const entry = path.join(workspaceRoot, 'packages', 'components', 'src', slug, 'index.ts')
      if (!(await pathExists(entry))) {
        reports.push(fail('S2', `${slug}: missing entry ${entry}`))
        continue
      }
      const kb = await bundleEntry(entry)
      const limit = s2RowBySlug.get(slug)?.limitKbGzip ?? s2.limitKbGzip
      const message = `${slug}: ${kb.toFixed(3)} KB gzip (limit ${limit})`
      reports.push(kb <= limit ? pass('S2', message) : fail('S2', message))
    }
    for (const row of s2Rows) {
      const measured = reports.some(
        (report) => report.metricId === 'S2' && report.message.startsWith(`${row.slug}:`),
      )
      if (!measured) {
        reports.push(fail('S2', `${row.slug}: budget row was not measured`))
      }
    }
  }

  for (const metricId of ['F', 'G']) {
    if (!want(metricId)) continue
    const family = budgets.metrics[metricId]
    if (!family) {
      reports.push(fail(metricId, `missing ${metricId} row in budgets.json`))
      continue
    }
    const slugs = [...new Set([...(family.components ?? []), ...(family.rows ?? []).map((row) => row.slug)])]
    const rowBySlug = new Map((family.rows ?? []).map((row) => [row.slug, row]))
    if (slugs.length === 0) {
      reports.push(fail(metricId, `${metricId} row has no components`))
      continue
    }
    for (const slug of slugs) {
      const entry = path.join(workspaceRoot, 'packages', 'components', 'src', slug, 'index.ts')
      if (!(await pathExists(entry))) {
        reports.push(fail(metricId, `${slug}: missing entry ${entry}`))
        continue
      }
      const kb = await bundleEntry(entry)
      const limit = rowBySlug.get(slug)?.limitKbGzip ?? family.limitKbGzip
      const message = `${slug}: ${kb.toFixed(3)} KB gzip (limit ${limit})`
      reports.push(kb <= limit ? pass(metricId, message) : fail(metricId, message))
    }
  }

  const s3Limit = budgets.metrics.S3.limitKbGzip
  const themeIds = budgets.metrics.S3.themeIds ?? []
  let measuredThemes = 0
  if (want('S3')) {
  for (const themeId of themeIds) {
    const distDir = path.join(workspaceRoot, 'packages', 'themes', 'dist', themeId)
    const srcDir = path.join(workspaceRoot, 'packages', 'themes', 'src', themeId)
    const themeDir = (await pathExists(distDir)) ? distDir : srcDir
    if (!(await pathExists(themeDir))) {
      reports.push(fail('S3', `${themeId}: missing theme directory (expected dist or src)`))
      continue
    }
    const files = await collectFiles(themeDir)
    if (files.length === 0) {
      reports.push(fail('S3', `${themeId}: no theme artifacts to measure`))
      continue
    }
    measuredThemes += 1
    const kb = await measureDirectory(themeDir)
    const sourceLabel = themeDir.endsWith(path.join('dist', themeId)) ? 'dist' : 'src'
    const message = `${themeId} (${sourceLabel}): ${kb.toFixed(3)} KB gzip (limit ${s3Limit})`
    reports.push(kb <= s3Limit ? pass('S3', message) : fail('S3', message))
  }
  if (themeIds.length > 0 && measuredThemes < themeIds.length) {
    reports.push(
      fail(
        'S3',
        `expected ${themeIds.length} themes, measured ${measuredThemes}; build @chameleon-ui/themes before perf:size`,
      ),
    )
  }
  }

  const s4Limit = budgets.metrics.S4.limitKbGzip
  if (want('S4')) {
  for (const item of complete) {
    for (const locale of budgets.metrics.S4.locales) {
      const localePath = path.join(
        workspaceRoot,
        'packages',
        'components',
        'src',
        item.slug,
        'locales',
        `${locale}.json`,
      )
      if (!(await pathExists(localePath))) {
        reports.push(fail('S4', `${item.slug}/${locale}: missing locale file`))
        continue
      }
      const kb = gzipKb(await readFile(localePath))
      const message = `${item.slug}/${locale}: ${kb.toFixed(3)} KB gzip (limit ${s4Limit})`
      reports.push(kb <= s4Limit ? pass('S4', message) : fail('S4', message))
    }
  }
  }

  const s5Limit = budgets.metrics.S5.limitKbGzip
  if (want('S5')) {
  const s5Slugs = [catalog.s5Suite.appShell, ...catalog.s5Suite.common10]
  const s5Missing = s5Slugs.filter(
    (slug) =>
      !catalog.components.some((item) => item.slug === slug && item.implementation === 'complete'),
  )
  if (s5Missing.length > 0) {
    reports.push(
      fail(
        'S5',
        `suite not fully implemented (${s5Missing.join(', ')}); AppShell + common-10 must be measured (limit ${s5Limit} KB gzip)`,
      ),
    )
  } else {
    const s5Entries = []
    for (const slug of s5Slugs) {
      const item = catalog.components.find((entry) => entry.slug === slug)
      const entry = path.join(workspaceRoot, 'packages', 'components', 'src', slug, 'index.ts')
      if (!(await pathExists(entry))) {
        reports.push(fail('S5', `${slug}: missing entry ${entry}`))
        continue
      }
      s5Entries.push({ name: item.name, entry })
    }
    if (s5Entries.length === s5Slugs.length) {
      const contents = s5Entries
        .map((item) => {
          const relative = `./${toPosix(path.relative(workspaceRoot, item.entry))}`
          return `export { ${item.name} } from ${JSON.stringify(relative)}`
        })
        .join('\n')
      const result = await esbuild.build({
        absWorkingDir: workspaceRoot,
        stdin: {
          contents,
          resolveDir: workspaceRoot,
          sourcefile: 's5-suite.js',
          loader: 'js',
        },
        bundle: true,
        write: false,
        outdir: path.join(workspaceRoot, 'benchmarks', '.tmp-size'),
        format: 'esm',
        platform: 'browser',
        minify: true,
        jsx: 'automatic',
        external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
        plugins: [
          {
            name: 'external-headless',
            setup(build) {
              build.onResolve({ filter: /^@ark-ui\// }, (args) => ({
                path: args.path,
                external: true,
              }))
              build.onResolve({ filter: /^@zag-js\// }, (args) => ({
                path: args.path,
                external: true,
              }))
            },
          },
        ],
      })
      const combined = Buffer.concat(result.outputFiles.map((file) => Buffer.from(file.contents)))
      const kb = gzipKb(combined)
      const message = `AppShell + common-10 (${s5Slugs.join(', ')}): ${kb.toFixed(3)} KB gzip (limit ${s5Limit})`
      reports.push(kb <= s5Limit ? pass('S5', message) : fail('S5', message))
    }
  }
  }

  for (const report of reports) {
    const tag = report.ok ? 'ok' : 'FAIL'
    console.log(`[${report.metricId} ${tag}] ${report.message}`)
  }

  if (reports.some((report) => !report.ok)) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
