#!/usr/bin/env node
/**
 * Validate a blind-test JSON export against protocol rules.
 * Never invents rates. Rejects mismatched correct flags / hand-typed rates.
 *
 * Usage (from chameleon-ui/):
 *   node ./scripts/blind-test-validate.mjs <path-to.json>
 *   node ./scripts/blind-test-validate.mjs --dry-run-format
 *   pnpm blind:validate -- <path>
 *   pnpm blind:validate -- --dry-run-format
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(root, '..')
const THEMES = [
  'line',
  'silver-arrow',
  'stuttgart',
  'corsa',
  'cupertino',
  'siren',
  'wechat',
  'ant-blue',
]
const SCHEMA = 'chameleon-ui/blind-test-result/v1'
const LEGACY = 'LEGACY-2026-008'
const SESSION_TRIALS = 16

function fail(message) {
  console.error(`blind:validate failed: ${message}`)
  process.exitCode = 1
}

function approxEqual(a, b) {
  return Math.abs(a - b) < 1e-9
}

export function validateBlindResult(doc, { expectKind } = {}) {
  const errors = []
  if (!doc || typeof doc !== 'object') {
    return ['document must be a JSON object']
  }
  if (doc.schema !== SCHEMA) errors.push(`schema must be ${SCHEMA}`)
  if (doc.legacy !== LEGACY) errors.push(`legacy must be ${LEGACY}`)
  if (!['not_run', 'in_progress', 'complete'].includes(doc.status)) {
    errors.push('status must be not_run | in_progress | complete')
  }
  if (expectKind && doc.kind !== expectKind) {
    errors.push(`kind must be ${expectKind}`)
  }
  if (!Array.isArray(doc.themes) || doc.themes.length !== 8) {
    errors.push('themes must list all 8 official ids')
  } else {
    for (const id of THEMES) {
      if (!doc.themes.includes(id)) errors.push(`themes missing ${id}`)
    }
  }
  if (!doc.summary || typeof doc.summary !== 'object') {
    errors.push('summary is required')
  } else if (doc.summary.total !== SESSION_TRIALS) {
    errors.push(`summary.total must be ${SESSION_TRIALS}`)
  }

  if (!Array.isArray(doc.trials)) {
    errors.push('trials must be an array')
    return errors
  }

  let correct = 0
  let unknown = 0
  for (const [i, trial] of doc.trials.entries()) {
    if (!trial || typeof trial !== 'object') {
      errors.push(`trials[${i}] must be an object`)
      continue
    }
    if (!THEMES.includes(trial.themeId)) errors.push(`trials[${i}].themeId invalid`)
    const guessOk = trial.guess === 'unknown' || THEMES.includes(trial.guess)
    if (!guessOk) errors.push(`trials[${i}].guess invalid`)
    if (typeof trial.correct !== 'boolean') errors.push(`trials[${i}].correct must be boolean`)
    if (typeof trial.timestamp !== 'string' || !trial.timestamp) {
      errors.push(`trials[${i}].timestamp required`)
    }
    const expectedCorrect = trial.guess === trial.themeId
    if (typeof trial.correct === 'boolean' && trial.correct !== expectedCorrect) {
      errors.push(
        `trials[${i}].correct=${trial.correct} but themeId=${trial.themeId} guess=${trial.guess} (unknown counts wrong)`,
      )
    }
    if (expectedCorrect) correct += 1
    if (trial.guess === 'unknown') unknown += 1
  }

  const answered = doc.trials.length
  if (doc.summary) {
    if (doc.summary.answered !== answered) {
      errors.push(`summary.answered=${doc.summary.answered} != trials.length=${answered}`)
    }
    if (doc.summary.correct !== correct) {
      errors.push(`summary.correct=${doc.summary.correct} != recomputed ${correct}`)
    }
    if (doc.summary.unknown !== unknown) {
      errors.push(`summary.unknown=${doc.summary.unknown} != recomputed ${unknown}`)
    }
  }

  if (doc.status === 'complete' && answered > 0) {
    const expectedRate = correct / answered
    if (doc.rate === null || typeof doc.rate !== 'number') {
      errors.push('complete results with trials must set rate = correct/answered (not null)')
    } else if (!approxEqual(doc.rate, expectedRate)) {
      errors.push(`rate=${doc.rate} does not equal correct/answered=${expectedRate}`)
    }
  } else if (doc.rate !== null) {
    errors.push('rate must be null unless status=complete and trials are present')
  }

  if (doc.kind === 'session' && doc.status === 'complete' && answered !== SESSION_TRIALS) {
    errors.push(`session complete must have exactly ${SESSION_TRIALS} trials`)
  }

  if (doc.kind === 'session' && doc.status === 'complete') {
    const counts = Object.fromEntries(THEMES.map((id) => [id, 0]))
    for (const trial of doc.trials) {
      if (THEMES.includes(trial.themeId)) counts[trial.themeId] += 1
    }
    for (const id of THEMES) {
      if (counts[id] !== 2) errors.push(`session deck must include ${id} exactly twice (got ${counts[id]})`)
    }
  }

  if (doc.kind === 'dry-run-fixture' && doc.captureSource !== 'dry-run-fixture') {
    errors.push('dry-run-fixture must set captureSource=dry-run-fixture')
  }

  if (doc.captureSource === 'human' && doc.kind === 'dry-run-fixture') {
    errors.push('dry-run fixture must not claim captureSource=human')
  }

  return errors
}

function buildDryRunFixture() {
  const themesTwice = THEMES.flatMap((id) => [id, id])
  const trials = themesTwice.map((themeId, index) => {
    const guess = index % 3 === 0 ? 'unknown' : themeId
    return {
      index,
      themeId,
      guess,
      correct: guess === themeId,
      timestamp: new Date(Date.UTC(2026, 7, 15, 0, 0, index)).toISOString(),
      testerId: 'dry-run-format-check',
    }
  })
  const correct = trials.filter((t) => t.correct).length
  const unknown = trials.filter((t) => t.guess === 'unknown').length
  return {
    schema: SCHEMA,
    kind: 'dry-run-fixture',
    status: 'complete',
    rate: correct / trials.length,
    owner: '待指定',
    legacy: LEGACY,
    testerId: 'dry-run-format-check',
    startedAt: '2026-08-15T00:00:00.000Z',
    completedAt: '2026-08-15T00:05:00.000Z',
    passRule:
      'rate >= 0.8 on aggregated complete human sessions; unknown is incorrect; never type a fake percentage',
    harness: 'http://127.0.0.1:5175/?view=blind',
    protocol: 'docs/project/reports/盲测协议.md',
    captureSource: 'dry-run-fixture',
    themes: THEMES,
    trials,
    summary: {
      total: SESSION_TRIALS,
      answered: trials.length,
      correct,
      unknown,
    },
    note: 'FORMAT CHECK ONLY. Not a human session. Do not promote to 盲测结果.json or claim recognition rates.',
  }
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--')
  const dryRun = args.includes('--dry-run-format')
  const pathArg = args.find((a) => !a.startsWith('--'))

  if (dryRun) {
    const fixture = buildDryRunFixture()
    const errors = validateBlindResult(fixture)
    const outDir = join(repoRoot, 'docs/project/reports/fixtures')
    await mkdir(outDir, { recursive: true })
    const outPath = join(outDir, '盲测结果.dry-run.example.json')
    await writeFile(outPath, `${JSON.stringify(fixture, null, 2)}\n`, 'utf8')
    if (errors.length) {
      for (const e of errors) fail(e)
      return
    }
    console.log('dry-run format OK')
    console.log(`wrote ${outPath}`)
    console.log(`rate in fixture = ${fixture.rate} (synthetic; NOT a product claim)`)
    console.log('Do not copy this fixture into published 盲测结果.json.')
    return
  }

  if (!pathArg) {
    fail('usage: node ./scripts/blind-test-validate.mjs <file.json> | --dry-run-format')
    return
  }

  const filePath = resolve(process.cwd(), pathArg)
  let doc
  try {
    doc = JSON.parse(await readFile(filePath, 'utf8'))
  } catch (error) {
    fail(`cannot read/parse ${filePath}: ${error.message}`)
    return
  }

  const errors = validateBlindResult(doc)
  if (errors.length) {
    for (const e of errors) fail(e)
    return
  }

  console.log(`OK ${filePath}`)
  console.log(`kind=${doc.kind ?? '(unset)'} status=${doc.status} answered=${doc.summary?.answered ?? 0} rate=${doc.rate}`)
  if (doc.kind === 'dry-run-fixture' || doc.captureSource === 'dry-run-fixture') {
    console.log('Note: dry-run fixture — not eligible for A9.5 / product rate.')
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isMain) {
  await main()
}
