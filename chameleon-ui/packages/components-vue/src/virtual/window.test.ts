import { describe, expect, it } from 'vitest'
import { downsample } from './downsample.js'
import { computeVariableWindow, computeWindow, prefixOffsets, windowsEqual } from './window.js'

describe('virtual window', () => {
  it('computes clamped fixed-size windows', () => {
    expect(computeWindow(0, 360, 10_000, 36, 6)).toEqual({ start: 0, end: 16 })
    expect(computeWindow(36 * 500, 360, 10_000, 36, 6)).toEqual({ start: 494, end: 516 })
    expect(computeWindow(36 * 9999, 360, 10_000, 36, 6)).toEqual({ start: 9993, end: 10_000 })
    expect(computeWindow(0, 360, 0, 36, 6)).toEqual({ start: 0, end: 0 })
  })

  it('windows columns by real widths, not a uniform guess', () => {
    const sizes = [400, 80, 400, 400]
    expect(computeVariableWindow(0, 200, sizes, 0)).toEqual({ start: 0, end: 1 })
    expect(computeVariableWindow(400, 200, sizes, 0)).toEqual({ start: 1, end: 3 })
    expect(prefixOffsets(sizes)).toEqual({ offsets: [0, 400, 480, 880], total: 1280 })
    expect(windowsEqual({ start: 1, end: 3 }, { start: 1, end: 3 })).toBe(true)
    expect(windowsEqual({ start: 1, end: 3 }, { start: 1, end: 4 })).toBe(false)
    expect(computeWindow(1, 360, 10_000, 36, 6)).toEqual(computeWindow(2, 360, 10_000, 36, 6))
  })
})

describe('downsample', () => {
  it('keeps short series unchanged and caps long series', () => {
    expect(downsample([1, 2, 3], 8)).toEqual([1, 2, 3])
    const long = Array.from({ length: 1000 }, (_, index) => index)
    const out = downsample(long, 8)
    expect(out).toHaveLength(8)
    expect(out[0]).toBe(0)
    expect(out[7]).toBe(999)
  })
})
