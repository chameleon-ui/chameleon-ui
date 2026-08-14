/**
 * Measures visible literal expansion of a candidate string versus a source.
 *
 * @complexity time O(n) | space O(n) | n = grapheme count
 * @guarantees C10; used by German +35% and pseudo-locale CI
 */
export function measureLiteralExpansion(source: string, candidate: string) {
  const sourceLength = Math.max(1, [...source].length)
  const candidateLength = [...candidate].length
  return {
    sourceLength,
    candidateLength,
    ratio: candidateLength / sourceLength,
  }
}

export function meetsExpansion(source: string, candidate: string, expansion: number) {
  return measureLiteralExpansion(source, candidate).ratio + Number.EPSILON >= expansion
}
