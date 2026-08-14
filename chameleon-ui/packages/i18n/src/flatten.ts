export type MessageTree = string | { [key: string]: MessageTree }

/**
 * Flattens nested message JSON into `a.b.c` keys.
 *
 * @complexity time O(n) | space O(n) | n = message nodes
 * @guarantees deterministic key order is not required; keys are unique paths
 */
export function flattenMessages(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') {
    return prefix ? { [prefix]: value } : {}
  }

  if (value === null || typeof value !== 'object') {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
      Object.entries(flattenMessages(nested, prefix ? `${prefix}.${key}` : key)),
    ),
  )
}
