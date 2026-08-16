export interface VirtualWindow {
  start: number
  end: number
}

/**
 * @complexity time O(1) | space O(1)
 * @guarantees rendered count stays O(viewport / size + 2 * overscan)
 */
export function computeWindow(
  offset: number,
  viewport: number,
  count: number,
  size: number,
  overscan: number,
): VirtualWindow {
  if (count <= 0 || size <= 0) return { start: 0, end: 0 }
  const start = Math.max(0, Math.floor(offset / size) - overscan)
  const end = Math.min(count, Math.ceil((offset + viewport) / size) + overscan)
  return { start, end }
}

/**
 * @complexity time O(n) | space O(1) — n = sizes.length; walks until the viewport is covered
 * @guarantees start/end use real item sizes, not a uniform guess
 */
export function computeVariableWindow(
  offset: number,
  viewport: number,
  sizes: number[],
  overscan: number,
): VirtualWindow {
  const count = sizes.length
  if (count === 0) return { start: 0, end: 0 }
  let acc = 0
  let start = 0
  while (start < count && acc + sizes[start] <= offset) {
    acc += sizes[start]
    start += 1
  }
  start = Math.max(0, start - overscan)
  let covered = 0
  for (let i = 0; i < start; i += 1) covered += sizes[i]
  let end = start
  const target = offset + viewport
  while (end < count && covered < target) {
    covered += sizes[end]
    end += 1
  }
  end = Math.min(count, end + overscan)
  return { start, end }
}

export function windowsEqual(a: VirtualWindow, b: VirtualWindow): boolean {
  return a.start === b.start && a.end === b.end
}

export function prefixOffsets(sizes: number[]): { offsets: number[]; total: number } {
  const offsets: number[] = []
  let running = 0
  for (const size of sizes) {
    offsets.push(running)
    running += size
  }
  return { offsets, total: running }
}
