/**
 * @complexity time O(maxPoints) | space O(maxPoints)
 * @guarantees first and last samples are kept; length never exceeds maxPoints
 */
export function downsample(data: number[], maxPoints: number): number[] {
  if (maxPoints < 2 || data.length <= maxPoints) return data
  const last = data.length - 1
  const out = new Array<number>(maxPoints)
  for (let i = 0; i < maxPoints; i += 1) {
    out[i] = data[Math.round((i * last) / (maxPoints - 1))]
  }
  return out
}

export function downsampleLabels(
  labels: string[] | undefined,
  length: number,
  maxPoints: number,
): string[] | undefined {
  if (!labels?.length) return labels
  if (length <= maxPoints) return labels
  const last = length - 1
  const out: string[] = []
  for (let i = 0; i < maxPoints; i += 1) {
    out.push(labels[Math.min(labels.length - 1, Math.round((i * last) / (maxPoints - 1)))] ?? '')
  }
  return out
}
