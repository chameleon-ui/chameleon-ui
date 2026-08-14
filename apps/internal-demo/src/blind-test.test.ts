import { themeIds } from '@chameleon-ui/themes'
import { describe, expect, it } from 'vitest'
import {
  BLIND_RESULT_SCHEMA,
  BLIND_TRIAL_COUNT,
  UNKNOWN_GUESS,
  buildBlindDeck,
  buildBlindTestResult,
  recordTrial,
  scoreTrial,
  serializeBlindTestResult,
} from './blind-test'

describe('blind-test protocol helpers', () => {
  it('builds a 16-trial deck with each official theme twice', () => {
    const deck = buildBlindDeck(() => 0.5)
    expect(deck).toHaveLength(BLIND_TRIAL_COUNT)
    expect(BLIND_TRIAL_COUNT).toBe(16)
    for (const id of themeIds) {
      expect(deck.filter((entry) => entry === id)).toHaveLength(2)
    }
  })

  it('treats unknown as incorrect', () => {
    expect(scoreTrial('cupertino', 'cupertino')).toBe(true)
    expect(scoreTrial('cupertino', 'line')).toBe(false)
    expect(scoreTrial('cupertino', UNKNOWN_GUESS)).toBe(false)
  })

  it('keeps rate null until a complete session has trials', () => {
    const empty = buildBlindTestResult({ status: 'not_run' })
    expect(empty.schema).toBe(BLIND_RESULT_SCHEMA)
    expect(empty.status).toBe('not_run')
    expect(empty.rate).toBeNull()
    expect(empty.owner).toBe('待指定')
    expect(empty.trials).toEqual([])

    const partial = buildBlindTestResult({
      status: 'in_progress',
      trials: [recordTrial({ index: 0, themeId: 'line', guess: 'line', timestamp: '2026-08-14T00:00:00.000Z' })],
    })
    expect(partial.rate).toBeNull()
    expect(partial.summary.correct).toBe(1)

    const complete = buildBlindTestResult({
      status: 'complete',
      trials: [
        recordTrial({ index: 0, themeId: 'line', guess: 'line', timestamp: '2026-08-14T00:00:00.000Z' }),
        recordTrial({ index: 1, themeId: 'wechat', guess: UNKNOWN_GUESS, timestamp: '2026-08-14T00:00:01.000Z' }),
      ],
    })
    expect(complete.rate).toBe(0.5)
    expect(complete.summary.unknown).toBe(1)
    expect(serializeBlindTestResult(complete)).toContain('"rate": 0.5')
  })
})
