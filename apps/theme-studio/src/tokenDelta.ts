/**
 * Compute the DTCG $extends delta between a base token tree and an edited one.
 * Only added/changed leaves are expressible; deletions are reported separately
 * because the compiler merge semantics (derived wins, groups deep-merge) have
 * no removal operation.
 */

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isTokenLeaf(value: unknown): boolean {
  return isObject(value) && '$value' in value
}

export interface TokenDelta {
  /** Delta tree to store under `$extends` (差量存储). */
  delta: Record<string, unknown>
  /** Base paths the edited tree removed; not expressible via $extends. */
  removedPaths: string[]
}

/**
 * @complexity time O(n) | space O(d) | n = leaf count, d = delta size
 * @guarantees deterministic key order; pure function
 */
export function diffTokenTrees(
  base: Record<string, unknown>,
  derived: Record<string, unknown>,
  currentPath: string[] = [],
): TokenDelta {
  const delta: Record<string, unknown> = {}
  const removedPaths: string[] = []

  const keys = new Set([...Object.keys(base), ...Object.keys(derived)])
  const sorted = [...keys].sort((a, b) => a.localeCompare(b, 'en'))

  for (const key of sorted) {
    if (key.startsWith('$')) continue
    const inBase = key in base
    const inDerived = key in derived
    const baseValue = base[key]
    const derivedValue = derived[key]

    if (inBase && !inDerived) {
      removedPaths.push([...currentPath, key].join('.'))
      continue
    }
    if (!inBase && inDerived) {
      delta[key] = derivedValue
      continue
    }
    if (isTokenLeaf(baseValue) || isTokenLeaf(derivedValue)) {
      if (JSON.stringify(baseValue) !== JSON.stringify(derivedValue)) {
        delta[key] = derivedValue
      }
      continue
    }
    if (isObject(baseValue) && isObject(derivedValue)) {
      const sub = diffTokenTrees(baseValue, derivedValue, [...currentPath, key])
      if (Object.keys(sub.delta).length > 0) {
        delta[key] = sub.delta
      }
      removedPaths.push(...sub.removedPaths)
      continue
    }
    if (JSON.stringify(baseValue) !== JSON.stringify(derivedValue)) {
      delta[key] = derivedValue
    }
  }

  return { delta, removedPaths }
}
