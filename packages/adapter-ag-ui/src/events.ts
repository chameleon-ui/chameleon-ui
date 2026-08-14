import type { JsonPatchOperation } from './json-patch.js'

/**
 * Minimal AG-UI event subset implemented by this adapter.
 * Scope honesty: the full AG-UI protocol defines ~16 event types (text
 * messages, tool calls, run lifecycle); this adapter implements the state-sync
 * slice only. See DECISION.md.
 */
export const AG_UI_EVENT_TYPES = [
  'STATE_SNAPSHOT',
  'STATE_DELTA',
  'SYNC_REQUEST',
] as const

export type AgUiEventType = (typeof AG_UI_EVENT_TYPES)[number]

export type AgUiOrigin = 'agent' | 'frontend'

export interface AgUiStateSnapshotEvent {
  type: 'STATE_SNAPSHOT'
  origin: AgUiOrigin
  state: unknown
}

export interface AgUiStateDeltaEvent {
  type: 'STATE_DELTA'
  origin: AgUiOrigin
  delta: JsonPatchOperation[]
}

/** Frontend → agent request for a fresh full snapshot (used on reconnect). */
export interface AgUiSyncRequestEvent {
  type: 'SYNC_REQUEST'
  origin: AgUiOrigin
}

export type AgUiEvent = AgUiStateSnapshotEvent | AgUiStateDeltaEvent | AgUiSyncRequestEvent

export function isAgUiEvent(value: unknown): value is AgUiEvent {
  if (value === null || typeof value !== 'object') return false
  const type = (value as { type?: unknown }).type
  return (AG_UI_EVENT_TYPES as readonly string[]).includes(String(type))
}
