export interface AuditEntry {
  ts: string;
  method: string;
  path: string;
  status: number;
  authorized: boolean;
  namespace?: string;
  itemId?: string;
  source?: string;
}

export function createAuditLog(): {
  entries: AuditEntry[];
  record: (entry: Omit<AuditEntry, 'ts'> & { ts?: string }) => AuditEntry;
} {
  const entries: AuditEntry[] = [];
  return {
    entries,
    record(entry) {
      const full: AuditEntry = {
        ts: entry.ts ?? new Date().toISOString(),
        method: entry.method,
        path: entry.path,
        status: entry.status,
        authorized: entry.authorized,
        namespace: entry.namespace,
        itemId: entry.itemId,
        source: entry.source,
      };
      entries.push(full);
      return full;
    },
  };
}
