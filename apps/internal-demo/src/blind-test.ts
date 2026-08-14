import { themeIds, type ThemeId } from '@chameleon-ui/themes'

export const BLIND_THEME_IDS = themeIds
export const BLIND_REPEATS = 2
export const BLIND_TRIAL_COUNT = themeIds.length * BLIND_REPEATS
export const UNKNOWN_GUESS = 'unknown' as const
export const BLIND_RESULT_FILENAME = '盲测结果.json'
export const BLIND_RESULT_SCHEMA = 'chameleon-ui/blind-test-result/v1' as const
export const BLIND_PASS_RULE =
  'rate >= 0.8 on aggregated complete human sessions; unknown is incorrect; never type a fake percentage'

export type BlindGuess = ThemeId | typeof UNKNOWN_GUESS
export type BlindSessionStatus = 'not_run' | 'in_progress' | 'complete'

export interface BlindTrial {
  index: number
  themeId: ThemeId
  guess: BlindGuess
  correct: boolean
  timestamp: string
}

export interface BlindTestResult {
  schema: typeof BLIND_RESULT_SCHEMA
  status: BlindSessionStatus
  rate: number | null
  owner: '待指定'
  legacy: 'LEGACY-2026-008'
  testerId: string
  startedAt: string | null
  completedAt: string | null
  passRule: typeof BLIND_PASS_RULE
  harness: string
  protocol: string
  themes: readonly ThemeId[]
  trials: BlindTrial[]
  summary: {
    total: number
    answered: number
    correct: number
    unknown: number
  }
}

export function isBlindGuess(value: string): value is BlindGuess {
  return value === UNKNOWN_GUESS || (themeIds as readonly string[]).includes(value)
}

export function shuffleInPlace<T>(items: T[], random: () => number = Math.random): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const current = items[i]
    const swap = items[j]
    if (current === undefined || swap === undefined) continue
    items[i] = swap
    items[j] = current
  }
  return items
}

/** 8 official homage themes × 2, shuffled. */
export function buildBlindDeck(random: () => number = Math.random): ThemeId[] {
  const deck: ThemeId[] = []
  for (const id of themeIds) {
    for (let n = 0; n < BLIND_REPEATS; n += 1) deck.push(id)
  }
  return shuffleInPlace(deck, random)
}

export function scoreTrial(themeId: ThemeId, guess: BlindGuess): boolean {
  return guess === themeId
}

export function recordTrial(input: {
  index: number
  themeId: ThemeId
  guess: BlindGuess
  timestamp?: string
}): BlindTrial {
  return {
    index: input.index,
    themeId: input.themeId,
    guess: input.guess,
    correct: scoreTrial(input.themeId, input.guess),
    timestamp: input.timestamp ?? new Date().toISOString(),
  }
}

export function buildBlindTestResult(input: {
  status: BlindSessionStatus
  testerId?: string
  startedAt?: string | null
  completedAt?: string | null
  trials?: BlindTrial[]
  harness?: string
}): BlindTestResult {
  const trials = input.trials ?? []
  const answered = trials.length
  const correct = trials.filter((trial) => trial.correct).length
  const unknown = trials.filter((trial) => trial.guess === UNKNOWN_GUESS).length
  const complete = input.status === 'complete' && answered > 0

  return {
    schema: BLIND_RESULT_SCHEMA,
    status: input.status,
    rate: complete ? correct / answered : null,
    owner: '待指定',
    legacy: 'LEGACY-2026-008',
    testerId: input.testerId ?? '',
    startedAt: input.startedAt ?? null,
    completedAt: input.completedAt ?? null,
    passRule: BLIND_PASS_RULE,
    harness: input.harness ?? 'http://127.0.0.1:5175/?view=blind',
    protocol: 'docs/project/reports/盲测协议.md',
    themes: themeIds,
    trials,
    summary: {
      total: BLIND_TRIAL_COUNT,
      answered,
      correct,
      unknown,
    },
  }
}

export function serializeBlindTestResult(result: BlindTestResult): string {
  return `${JSON.stringify(result, null, 2)}\n`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function downloadJson(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
