import type { AgUiEvent, AgUiOrigin } from './events.js'
import { applyJsonPatch, type JsonPatchOperation } from './json-patch.js'

export interface AgUiEndpoint {
  readonly role: AgUiOrigin
  /** Current locally-held state copy. */
  getState(): unknown
  /** Local edit (e.g. user typed into a component): updates local state and broadcasts a snapshot to the peer. */
  setLocalState(next: unknown): void
  /** Push a full snapshot to the peer without marking it as a local edit. */
  pushSnapshot(state: unknown): void
  /** Push a JSON-Patch delta to the peer (applied to the peer's copy). */
  pushDelta(delta: JsonPatchOperation[]): void
  /** Subscribe to locally-visible state changes (after remote application or local edit). */
  onStateChange(listener: (state: unknown) => void): () => void
  /** Subscribe to events this endpoint EMITS (outbound protocol traffic). */
  onEvent(listener: (event: AgUiEvent) => void): () => void
  /** Subscribe to events this endpoint RECEIVES from the peer (inbound traffic). */
  onReceive(listener: (event: AgUiEvent) => void): () => void
  /** Drop the link; events are not delivered while disconnected. */
  disconnect(): void
  /** Re-establish the link; the frontend re-syncs a full snapshot to the agent (断线可恢复). */
  reconnect(): void
  isConnected(): boolean
}

interface Wire {
  deliver(from: AgUiOrigin, event: AgUiEvent): void
}

class Endpoint implements AgUiEndpoint {
  private state: unknown
  private stateListeners = new Set<(state: unknown) => void>()
  private eventListeners = new Set<(event: AgUiEvent) => void>()
  private receiveListeners = new Set<(event: AgUiEvent) => void>()
  private connected = true

  constructor(
    readonly role: AgUiOrigin,
    initialState: unknown,
    private readonly wire: Wire,
  ) {
    // Deep-clone so the two peers never share a mutable reference.
    this.state = initialState === undefined ? initialState : JSON.parse(JSON.stringify(initialState))
  }

  getState(): unknown {
    return this.state
  }

  setLocalState(next: unknown): void {
    this.applyLocal(next)
    this.emit({ type: 'STATE_SNAPSHOT', origin: this.role, state: next })
  }

  pushSnapshot(state: unknown): void {
    this.emit({ type: 'STATE_SNAPSHOT', origin: this.role, state })
  }

  pushDelta(delta: JsonPatchOperation[]): void {
    // Validate against the local copy first so the peer never receives a patch
    // that cannot apply cleanly.
    applyJsonPatch(this.state, delta)
    this.emit({ type: 'STATE_DELTA', origin: this.role, delta })
  }

  onStateChange(listener: (state: unknown) => void): () => void {
    this.stateListeners.add(listener)
    return () => this.stateListeners.delete(listener)
  }

  onEvent(listener: (event: AgUiEvent) => void): () => void {
    this.eventListeners.add(listener)
    return () => this.eventListeners.delete(listener)
  }

  onReceive(listener: (event: AgUiEvent) => void): () => void {
    this.receiveListeners.add(listener)
    return () => this.receiveListeners.delete(listener)
  }

  disconnect(): void {
    this.connected = false
  }

  reconnect(): void {
    this.connected = true
    if (this.role === 'agent') {
      // Ask the frontend (component-state authority in this adapter) for a full resync.
      this.emit({ type: 'SYNC_REQUEST', origin: this.role })
    }
  }

  isConnected(): boolean {
    return this.connected
  }

  /** Called by the wire when the peer emits an event. */
  receive(event: AgUiEvent): void {
    if (!this.connected) return
    for (const listener of this.receiveListeners) listener(event)
    if (event.type === 'STATE_SNAPSHOT') {
      // Remote application must not re-emit (loop guard).
      this.applyLocal(event.state)
    } else if (event.type === 'STATE_DELTA') {
      this.applyLocal(applyJsonPatch(this.state, event.delta))
    } else if (event.type === 'SYNC_REQUEST' && this.role === 'frontend') {
      this.emit({ type: 'STATE_SNAPSHOT', origin: this.role, state: this.state })
    }
  }

  private applyLocal(next: unknown): void {
    this.state = next
    for (const listener of this.stateListeners) listener(next)
  }

  private emit(event: AgUiEvent): void {
    this.notifyEvent(event)
    this.wire.deliver(this.role, event)
  }

  private notifyEvent(event: AgUiEvent): void {
    for (const listener of this.eventListeners) listener(event)
  }
}

/**
 * Create an in-memory AG-UI peer pair (agent ↔ frontend) with bidirectional
 * state sync. Transport is deliberately in-process; hosts wire their own
 * transport by forwarding the same event shapes.
 */
export function createAgUiPeerPair(initialState: unknown): {
  agent: AgUiEndpoint
  frontend: AgUiEndpoint
} {
  let agentEndpoint: Endpoint
  let frontendEndpoint: Endpoint
  const wire: Wire = {
    deliver(from, event) {
      const target = from === 'agent' ? frontendEndpoint : agentEndpoint
      target.receive(event)
    },
  }
  agentEndpoint = new Endpoint('agent', initialState, wire)
  frontendEndpoint = new Endpoint('frontend', initialState, wire)
  return { agent: agentEndpoint, frontend: frontendEndpoint }
}
