import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createInstallKernel } from '@chameleon-ui/install-core'
import { registry } from '@chameleon-ui/registry'
import {
  adapt,
  AgUiAdapterError,
  applyJsonPatch,
  createAgUiPeerPair,
  JsonPatchError,
  type AgUiEvent,
  type AgUiRenderDirective,
} from './index.js'

describe('AG-UI json-patch subset', () => {
  it('applies add/replace/remove immutably', () => {
    const doc = { user: { name: 'Ada' }, tags: ['a', 'b'] }
    const next = applyJsonPatch(doc, [
      { op: 'replace', path: '/user/name', value: 'Grace' },
      { op: 'add', path: '/tags/-', value: 'c' },
      { op: 'remove', path: '/tags/0' },
    ])
    expect(next).toEqual({ user: { name: 'Grace' }, tags: ['b', 'c'] })
    expect(doc).toEqual({ user: { name: 'Ada' }, tags: ['a', 'b'] })
  })

  it('rejects out-of-bounds paths without touching the document', () => {
    const doc = { a: [1] }
    expect(() => applyJsonPatch(doc, [{ op: 'remove', path: '/a/5' }])).toThrow(JsonPatchError)
    expect(() => applyJsonPatch(doc, [{ op: 'replace', path: '/missing', value: 1 }])).toThrow(
      JsonPatchError,
    )
    expect(doc).toEqual({ a: [1] })
  })
})

describe('AG-UI bidirectional state sync (POC)', () => {
  it('syncs a component edit (frontend) to the agent', () => {
    const { agent, frontend } = createAgUiPeerPair({ text: '', done: false })
    const received: AgUiEvent[] = []
    agent.onReceive((event) => received.push(event))

    frontend.setLocalState({ text: 'hello', done: false })

    expect(agent.getState()).toEqual({ text: 'hello', done: false })
    expect(received).toHaveLength(1)
    expect(received[0]).toMatchObject({ type: 'STATE_SNAPSHOT', origin: 'frontend' })
  })

  it('syncs an agent delta to the frontend component state', () => {
    const { agent, frontend } = createAgUiPeerPair({ count: 0 })
    const seen: unknown[] = []
    frontend.onStateChange((state) => seen.push(state))

    agent.pushDelta([{ op: 'replace', path: '/count', value: 41 }])
    agent.pushDelta([{ op: 'replace', path: '/count', value: 42 }])

    expect(frontend.getState()).toEqual({ count: 42 })
    expect(seen).toHaveLength(2)
  })

  it('does not echo remote applications (loop guard)', () => {
    const { agent, frontend } = createAgUiPeerPair({ v: 0 })
    const frontendEmitted: AgUiEvent[] = []
    const agentEmitted: AgUiEvent[] = []
    frontend.onEvent((event) => frontendEmitted.push(event))
    agent.onEvent((event) => agentEmitted.push(event))

    frontend.setLocalState({ v: 1 })

    // frontend emitted exactly its own snapshot; the agent applied it silently.
    expect(frontendEmitted).toHaveLength(1)
    expect(agentEmitted).toHaveLength(0)

    // And vice versa: agent-originated deltas are not echoed back.
    agent.pushDelta([{ op: 'replace', path: '/v', value: 2 }])
    expect(frontendEmitted).toHaveLength(1)
    expect(agentEmitted).toHaveLength(1)
  })

  it('re-syncs a full snapshot on reconnect (断线可恢复)', () => {
    const { agent, frontend } = createAgUiPeerPair({ v: 0 })
    frontend.setLocalState({ v: 1 })
    expect(agent.getState()).toEqual({ v: 1 })

    agent.disconnect()
    frontend.setLocalState({ v: 2 })
    frontend.setLocalState({ v: 3 })
    expect(agent.getState()).toEqual({ v: 1 })

    agent.reconnect()
    expect(agent.getState()).toEqual({ v: 3 })
  })

  it('drops events while disconnected and keeps them ordered after reconnect', () => {
    const { agent, frontend } = createAgUiPeerPair({ log: [] as string[] })
    agent.disconnect()
    frontend.setLocalState({ log: ['a'] })
    agent.reconnect()
    frontend.pushDelta([{ op: 'add', path: '/log/-', value: 'b' }])
    expect(agent.getState()).toEqual({ log: ['a', 'b'] })
  })
})

describe('AG-UI render directive → install plan (source=ag-ui)', () => {
  const directive: AgUiRenderDirective = {
    kind: 'ag-ui',
    version: '1.0',
    root: {
      id: 'form-1',
      type: 'form',
      children: [
        { id: 'email', type: 'text-field', props: { label: 'Email' } },
        { id: 'go', type: 'submit', props: { label: 'Sign in' } },
      ],
    },
  }

  it('maps elements to plan entries marked with source=ag-ui', () => {
    const plan = adapt(directive, registry)
    expect(plan.length).toBeGreaterThan(0)
    for (const entry of plan) {
      expect(entry.source).toBe('ag-ui')
    }
    expect(plan.map((entry) => entry.item.id)).toContain('form')
    expect(plan.map((entry) => entry.item.id)).toContain('input')
    expect(plan.map((entry) => entry.item.id)).toContain('button')
  })

  it('installs through install-core only (idempotent)', async () => {
    const plan = adapt(directive, registry)
    const dir = await mkdtemp(join(tmpdir(), 'cu-ag-ui-'))
    try {
      const flatFiles = plan.flatMap((entry) => entry.files)
      const bundle = {
        id: 'bundle:ag-ui-demo',
        type: 'registry:bundle',
        name: 'AG-UI demo bundle',
        files: flatFiles,
        dependencies: [],
      }
      const kernel = createInstallKernel([...registry, bundle])
      const first = await kernel.install(bundle, dir, { source: 'ag-ui' })
      expect(first.written.length).toBeGreaterThan(0)
      const content = await readFile(join(dir, 'components/button/Button.tsx'), 'utf8')
      expect(content).toContain('data-ai-role')
      const second = await kernel.install(bundle, dir, { source: 'ag-ui' })
      expect(second.written).toEqual([])
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('rejects unknown element types with a located error', () => {
    const bad: AgUiRenderDirective = {
      kind: 'ag-ui',
      version: '1.0',
      root: { id: 'x', type: 'hologram' },
    }
    expect(() => adapt(bad, registry)).toThrow(AgUiAdapterError)
  })
})
