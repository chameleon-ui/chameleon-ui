/** RFC 6902 JSON Patch subset (add / replace / remove) with immutable apply. */

export interface JsonPatchOperation {
  op: 'add' | 'replace' | 'remove'
  path: string
  value?: unknown
}

export class JsonPatchError extends Error {
  constructor(
    message: string,
    public readonly path: string,
  ) {
    super(message)
    this.name = 'JsonPatchError'
  }
}

function parsePath(path: string): string[] {
  if (path === '') return []
  if (!path.startsWith('/')) {
    throw new JsonPatchError(`Patch path must start with "/" (got "${path}")`, path)
  }
  return path
    .slice(1)
    .split('/')
    .map((segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'))
}

function clone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((entry) => clone(entry)) as T
  const out: Record<string, unknown> = {}
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    out[key] = clone(entry)
  }
  return out as T
}

function resolveContainer(
  document: unknown,
  segments: string[],
  path: string,
): { parent: unknown; key: string } {
  let parent = document
  for (const segment of segments.slice(0, -1)) {
    if (Array.isArray(parent)) {
      const index = Number(segment)
      if (!Number.isInteger(index) || index < 0 || index >= parent.length) {
        throw new JsonPatchError(`Array index "${segment}" out of bounds`, path)
      }
      parent = parent[index]
    } else if (parent !== null && typeof parent === 'object') {
      parent = (parent as Record<string, unknown>)[segment]
    } else {
      throw new JsonPatchError(`Cannot traverse into ${typeof parent}`, path)
    }
  }
  const key = segments.at(-1)
  if (key === undefined) {
    throw new JsonPatchError('Patch path must address a member', path)
  }
  return { parent, key }
}

/**
 * Apply a patch immutably. Unknown or out-of-bounds paths raise JsonPatchError
 * and leave the input document untouched.
 *
 * @complexity time O(p * d) | space O(n) | p = ops, d = path depth, n = document nodes
 */
export function applyJsonPatch<T>(document: T, operations: JsonPatchOperation[]): T {
  let current = clone(document)
  for (const operation of operations) {
    current = applyOne(current, operation)
  }
  return current
}

function applyOne<T>(document: T, operation: JsonPatchOperation): T {
  const segments = parsePath(operation.path)

  if (segments.length === 0) {
    if (operation.op === 'remove') {
      throw new JsonPatchError('Cannot remove the document root', operation.path)
    }
    return clone(operation.value) as T
  }

  const { parent, key } = resolveContainer(document, segments, operation.path)

  if (Array.isArray(parent)) {
    const index = key === '-' ? parent.length : Number(key)
    if (!Number.isInteger(index) || index < 0 || (operation.op !== 'add' && index >= parent.length) || index > parent.length) {
      throw new JsonPatchError(`Array index "${key}" out of bounds`, operation.path)
    }
    const next = [...parent]
    if (operation.op === 'remove') {
      next.splice(index, 1)
    } else if (operation.op === 'add') {
      next.splice(index, 0, clone(operation.value))
    } else {
      next[index] = clone(operation.value)
    }
    return rebuild(document, segments, next)
  }

  if (parent !== null && typeof parent === 'object') {
    const record = parent as Record<string, unknown>
    if (operation.op !== 'add' && !(key in record)) {
      throw new JsonPatchError(`Member "${key}" does not exist`, operation.path)
    }
    const next = { ...record }
    if (operation.op === 'remove') {
      delete next[key]
    } else {
      next[key] = clone(operation.value)
    }
    return rebuild(document, segments, next)
  }

  throw new JsonPatchError(`Cannot patch ${typeof parent}`, operation.path)
}

function rebuild<T>(document: T, segments: string[], nextContainer: unknown): T {
  // Replace the container addressed by segments[:-1] with nextContainer.
  const parentSegments = segments.slice(0, -1)
  if (parentSegments.length === 0) {
    return nextContainer as T
  }
  const root: unknown = clone(document)
  let cursor = root as Record<string, unknown> | unknown[]
  for (const segment of parentSegments.slice(0, -1)) {
    cursor = (cursor as Record<string, unknown>)[segment] as Record<string, unknown> | unknown[]
  }
  const last = parentSegments.at(-1)!
  if (Array.isArray(cursor)) {
    cursor[Number(last)] = nextContainer
  } else {
    cursor[last] = nextContainer
  }
  return root as T
}
