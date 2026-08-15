#!/usr/bin/env node
/**
 * Ingest human blind-test session JSON into docs/project/reports/blind-sessions/.
 * Optionally promote to aggregate 盲测结果.json when ≥5 independent human sessions exist.
 * NEVER invents guesses or rates — only recomputes from trials.
 *
 * Usage (from chameleon-ui/):
 *   pnpm blind:ingest -- path/to/盲测结果.operator-local.json
 *   pnpm blind:ingest -- --promote
 *   pnpm blind:ingest -- path/a.json path/b.json --promote
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateBlindResult } from './blind-test-validate.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(root, '..')
const reportsDir = join(repoRoot, 'docs/project/reports')
const sessionsDir = join(reportsDir, 'blind-sessions')
const pendingPath = join(reportsDir, '盲测结果.pending.json')
const aggregatePath = join(reportsDir, '盲测结果.json')
const decisionPath = join(reportsDir, 'A9.5-decision.json')
const MIN_HUMANS = 5
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

function fail(message) {
  console.error(`blind:ingest failed: ${message}`)
  process.exitCode = 1
}

function safeTesterSlug(testerId) {
  const safe = String(testerId || 'anonymous')
    .trim()
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return safe || 'anonymous'
}

async function loadJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

async function listSessionFiles() {
  try {
    const names = await readdir(sessionsDir)
    return names.filter((n) => n.endsWith('.json') && !n.includes('dry-run')).map((n) => join(sessionsDir, n))
  } catch {
    return []
  }
}

function isHumanSession(doc) {
  if (doc.kind === 'dry-run-fixture' || doc.captureSource === 'dry-run-fixture') return false
  if (doc.kind && doc.kind !== 'session') return false
  return doc.status === 'complete' && Array.isArray(doc.trials) && doc.trials.length === 16
}

async function ingestOne(filePath) {
  const doc = await loadJson(filePath)
  const errors = validateBlindResult(doc)
  if (errors.length) {
    for (const e of errors) fail(`${filePath}: ${e}`)
    return null
  }
  if (!isHumanSession(doc)) {
    fail(`${filePath}: not a complete human session (16 trials). dry-run fixtures are rejected.`)
    return null
  }
  if (doc.captureSource && doc.captureSource !== 'human') {
    fail(`${filePath}: captureSource must be human (or unset)`)
    return null
  }

  const testerId = doc.testerId?.trim() || 'anonymous'
  if (!doc.testerId?.trim()) {
    console.warn(`warning: ${filePath} has empty testerId; storing as anonymous`)
  }

  await mkdir(sessionsDir, { recursive: true })
  const dest = join(sessionsDir, `盲测结果.${safeTesterSlug(testerId)}.json`)
  const normalized = {
    ...doc,
    kind: 'session',
    captureSource: 'human',
    testerId,
  }
  await writeFile(dest, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8')
  console.log(`ingested → ${dest}`)
  return dest
}

async function buildAggregate(sessionPaths) {
  const sessions = []
  for (const path of sessionPaths) {
    const doc = await loadJson(path)
    const errors = validateBlindResult(doc)
    if (errors.length) {
      for (const e of errors) fail(`${path}: ${e}`)
      return null
    }
    if (!isHumanSession(doc)) {
      fail(`${path}: skipped non-human or incomplete`)
      return null
    }
    sessions.push({ path, doc })
  }

  const byTester = new Map()
  for (const { path, doc } of sessions) {
    const id = doc.testerId?.trim() || basename(path)
    if (byTester.has(id)) {
      console.warn(`warning: duplicate testerId ${id}; keeping ${path}`)
    }
    byTester.set(id, doc)
  }

  const unique = [...byTester.entries()]
  const trials = []
  for (const [testerId, doc] of unique) {
    for (const trial of doc.trials) {
      trials.push({
        ...trial,
        testerId: trial.testerId || testerId,
      })
    }
  }

  const answered = trials.length
  const correct = trials.filter((t) => t.correct).length
  const unknown = trials.filter((t) => t.guess === 'unknown').length
  const rate = answered > 0 ? correct / answered : null
  const qualifies = unique.length >= MIN_HUMANS

  return {
    schema: 'chameleon-ui/blind-test-result/v1',
    kind: 'aggregate',
    status: qualifies ? 'complete' : 'in_progress',
    rate: qualifies ? rate : null,
    a95Decision: qualifies ? (rate !== null && rate >= 0.8 ? 'PASS-READY' : 'AGGREGATE-BELOW-80') : 'PROTOCOL-READY',
    waive: false,
    commercialClaimAllowed: Boolean(qualifies && rate !== null && rate >= 0.8),
    slogan80Allowed: Boolean(qualifies && rate !== null && rate >= 0.8),
    owner: '待指定',
    legacy: 'LEGACY-2026-008',
    testerId: unique.map(([id]) => id).join(','),
    sessionIds: unique.map(([id]) => id),
    startedAt: unique.map(([, d]) => d.startedAt).filter(Boolean).sort()[0] ?? null,
    completedAt: qualifies ? new Date().toISOString() : null,
    passRule:
      'rate >= 0.8 on aggregated complete human sessions; unknown is incorrect; never type a fake percentage',
    harness: 'http://127.0.0.1:5175/?view=blind',
    protocol: 'docs/project/reports/盲测协议.md',
    decisionDoc: 'docs/project/reports/A9.5-盲测决策-PROTOCOL-READY.md',
    decisionJson: 'docs/project/reports/A9.5-decision.json',
    captureSource: 'human',
    pipelineStatus: qualifies ? 'aggregate_complete' : 'sessions_partial',
    themes: THEMES,
    trials,
    summary: {
      total: 16,
      answered,
      correct,
      unknown,
      sessions: unique.length,
      minSessionsRequired: MIN_HUMANS,
    },
    note: qualifies
      ? `Aggregate of ${unique.length} human sessions. rate=correct/answered only. commercialClaimAllowed only if rate>=0.8.`
      : `Partial aggregate: ${unique.length}/${MIN_HUMANS} human sessions. rate kept null until protocol sample met. Do not claim ≥80%.`,
  }
}

async function writePendingMirror(aggregate) {
  const pending = await loadJson(pendingPath)
  const next = {
    ...pending,
    status: aggregate.status === 'complete' ? 'complete' : 'not_run',
    rate: aggregate.status === 'complete' ? aggregate.rate : null,
    pipelineStatus: aggregate.pipelineStatus,
    sessionIds: aggregate.sessionIds,
    summary: {
      total: 16,
      answered: aggregate.summary.answered,
      correct: aggregate.summary.correct,
      unknown: aggregate.summary.unknown,
    },
    note:
      aggregate.status === 'complete'
        ? `Promoted from ${aggregate.sessionIds.length} human sessions. See 盲测结果.json. rate computed from trials only.`
        : `ready_for_humans; ${aggregate.sessionIds.length}/${MIN_HUMANS} sessions ingested. rate=null until protocol sample. See operator kit.`,
  }
  // Keep pending as not_run + null rate until full promote — protocol forbids non-null on pending early.
  if (aggregate.status !== 'complete') {
    next.status = 'not_run'
    next.rate = null
    next.a95Decision = 'PROTOCOL-READY'
    next.commercialClaimAllowed = false
    next.slogan80Allowed = false
  } else {
    next.a95Decision = aggregate.a95Decision
    next.commercialClaimAllowed = aggregate.commercialClaimAllowed
    next.slogan80Allowed = aggregate.slogan80Allowed
  }
  await writeFile(pendingPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
}

async function maybeUpdateA95(aggregate) {
  if (aggregate.status !== 'complete' || aggregate.sessionIds.length < MIN_HUMANS) {
    console.log('A9.5 unchanged (PROTOCOL-READY): need ≥5 human sessions for qualifying aggregate.')
    return
  }
  const decision = await loadJson(decisionPath)
  const next = {
    ...decision,
    decision: aggregate.commercialClaimAllowed ? 'AGGREGATE-PASS' : 'AGGREGATE-REPORTED',
    rate: aggregate.rate,
    status: 'complete',
    commercialClaimAllowed: aggregate.commercialClaimAllowed,
    slogan80Allowed: aggregate.slogan80Allowed,
    pendingResult: aggregate.commercialClaimAllowed
      ? 'docs/project/reports/盲测结果.json'
      : 'docs/project/reports/盲测结果.json',
    decidedAt: new Date().toISOString().slice(0, 10),
    note: aggregate.commercialClaimAllowed
      ? `Human aggregate n=${aggregate.sessionIds.length}, rate=${aggregate.rate} ≥ 0.8. Product claim may proceed with evidence link.`
      : `Human aggregate n=${aggregate.sessionIds.length}, rate=${aggregate.rate} < 0.8 (or boundary). Results published; ≥80% claim still forbidden.`,
  }
  await writeFile(decisionPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  console.log(`updated A9.5-decision.json → ${next.decision} rate=${next.rate}`)
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--')
  const promote = args.includes('--promote')
  const inputs = args.filter((a) => !a.startsWith('--')).map((a) => resolve(process.cwd(), a))

  if (inputs.length === 0 && !promote) {
    fail('usage: node ./scripts/blind-test-ingest.mjs <session.json>... [--promote]')
    return
  }

  for (const input of inputs) {
    await ingestOne(input)
    if (process.exitCode) return
  }

  const sessionFiles = await listSessionFiles()
  console.log(`sessions on disk: ${sessionFiles.length}`)

  if (!promote) {
    console.log('Tip: after ≥5 unique human tester files, run: pnpm blind:ingest -- --promote')
    return
  }

  if (sessionFiles.length === 0) {
    fail('no sessions in docs/project/reports/blind-sessions/')
    return
  }

  const aggregate = await buildAggregate(sessionFiles)
  if (!aggregate || process.exitCode) return

  if (aggregate.status !== 'complete') {
    await writeFile(
      join(sessionsDir, '_aggregate.partial.json'),
      `${JSON.stringify(aggregate, null, 2)}\n`,
      'utf8',
    )
    await writePendingMirror(aggregate)
    console.log(
      `partial only: ${aggregate.sessionIds.length}/${MIN_HUMANS} humans. Wrote _aggregate.partial.json; rate stays null on pending.`,
    )
    console.log('A9.5 remains PROTOCOL-READY. No product recognition rate.')
    return
  }

  const errors = validateBlindResult(aggregate)
  // aggregate summary.total stays 16 per schema const; relax by not requiring session deck check (kind=aggregate)
  const filtered = errors.filter((e) => !e.includes('exactly twice') && !e.includes('exactly 16'))
  // For aggregate, summary.total=16 is per-session; answered may be 80+. Patch validation expectation:
  // Our schema says summary.total const 16 — for aggregate we keep total=16 as "per session size"
  // and answered as grand total. validate may complain about answered vs length - it checks answered===trials.length which is fine.
  // It may also require session deck for kind=session only — we set kind=aggregate so OK.
  if (filtered.length) {
    for (const e of filtered) fail(e)
    return
  }

  await writeFile(aggregatePath, `${JSON.stringify(aggregate, null, 2)}\n`, 'utf8')
  await writePendingMirror(aggregate)
  await maybeUpdateA95(aggregate)
  console.log(`wrote ${aggregatePath}`)
  console.log(`aggregate rate=${aggregate.rate} sessions=${aggregate.sessionIds.length}`)
  console.log(
    aggregate.commercialClaimAllowed
      ? 'commercialClaimAllowed=true (≥80% with ≥5 humans).'
      : 'commercialClaimAllowed=false — do not claim 一眼认出 ≥80%.',
  )
}

await main()
