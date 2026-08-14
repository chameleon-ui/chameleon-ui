export interface RulesMergeConflict {
  path: string;
  baseValue: unknown;
  incomingValue: unknown;
}

export class RulesMergeError extends Error {
  constructor(
    message: string,
    readonly conflicts: RulesMergeConflict[],
  ) {
    super(message);
    this.name = 'RulesMergeError';
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatConflict(conflict: RulesMergeConflict): string {
  return `  - ${conflict.path}: base=${JSON.stringify(conflict.baseValue)} incoming=${JSON.stringify(conflict.incomingValue)}`;
}

function formatRulesMergeError(conflicts: RulesMergeConflict[]): string {
  return [
    'Design rules merge failed.',
    `Path: ${conflicts.map((conflict) => conflict.path).join(', ')}`,
    'Reason:',
    ...conflicts.map(formatConflict),
    'Next: resolve the conflicting fields or install the pack to a separate rules directory.',
  ].join('\n');
}

function mergeArraysUnique(base: unknown[], incoming: unknown[]): unknown[] {
  const seen = new Set<string>();
  const merged: unknown[] = [];
  for (const value of [...base, ...incoming]) {
    const key = JSON.stringify(value);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(value);
  }
  return merged;
}

function collectMergeConflicts(
  base: unknown,
  incoming: unknown,
  path: string,
  conflicts: RulesMergeConflict[],
): unknown {
  if (incoming === undefined) return base;
  if (base === undefined) return incoming;

  if (Array.isArray(base) && Array.isArray(incoming)) {
    if (path.endsWith('forbiddenPatterns') || path.endsWith('preferredStacks') || path.endsWith('mirroredIcons') || path.endsWith('surfaceLayers') || path.endsWith('steps')) {
      return mergeArraysUnique(base, incoming);
    }
    if (JSON.stringify(base) !== JSON.stringify(incoming)) {
      conflicts.push({ path, baseValue: base, incomingValue: incoming });
      return base;
    }
    return base;
  }

  if (isPlainObject(base) && isPlainObject(incoming)) {
    const keys = new Set([...Object.keys(base), ...Object.keys(incoming)]);
    const merged: Record<string, unknown> = {};
    for (const key of keys) {
      const childPath = path ? `${path}.${key}` : key;
      merged[key] = collectMergeConflicts(base[key], incoming[key], childPath, conflicts);
    }
    return merged;
  }

  if (base !== incoming) {
    conflicts.push({ path, baseValue: base, incomingValue: incoming });
  }
  return base;
}

/**
 * Merge two design-rules documents. Arrays that represent open-ended lists are
 * unioned; scalar/object fields must agree or a conflict is reported.
 *
 * @complexity time O(n) | space O(n) | n = document nodes
 * @guarantees U9 errors include path, reason, and next step
 */
export function mergeDesignRules<T extends Record<string, unknown>>(
  base: T,
  incoming: Record<string, unknown>,
): T {
  const conflicts: RulesMergeConflict[] = [];
  const merged = collectMergeConflicts(base, incoming, '', conflicts) as T;
  if (conflicts.length > 0) {
    throw new RulesMergeError(formatRulesMergeError(conflicts), conflicts);
  }
  return merged;
}

/**
 * Detect merge conflicts without producing a merged document.
 */
export function detectRulesMergeConflicts(
  base: Record<string, unknown>,
  incoming: Record<string, unknown>,
): RulesMergeConflict[] {
  const conflicts: RulesMergeConflict[] = [];
  collectMergeConflicts(base, incoming, '', conflicts);
  return conflicts;
}
