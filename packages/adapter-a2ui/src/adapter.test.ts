import { describe, expect, it } from 'vitest'
import {
  A2UIAdapterError,
  adapt,
  DEFAULT_A2UI_COMPONENT_MAP,
  SchemaRenderer,
  type A2UIDocument,
} from './index.js'
import { createInstallKernel } from '@chameleon-ui/install-core'
import { registry } from '@chameleon-ui/registry'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const formSubmitDoc: A2UIDocument = {
  version: '1.0',
  kind: 'a2ui',
  root: {
    id: 'signin-form',
    type: 'form',
    props: { submitLabel: 'Sign in' },
    children: [
      {
        id: 'email',
        type: 'text-field',
        props: { label: 'Email', name: 'email' },
      },
      {
        id: 'submit',
        type: 'button',
        props: { intent: 'submit', label: 'Sign in' },
      },
    ],
  },
}

describe('A2UI adapter', () => {
  it('maps known element types to Chameleon slugs', () => {
    expect(DEFAULT_A2UI_COMPONENT_MAP['text-field']).toBe('input')
    expect(DEFAULT_A2UI_COMPONENT_MAP['button']).toBe('button')
    expect(DEFAULT_A2UI_COMPONENT_MAP['form']).toBe('form')
  })

  it('adapts a form+submit document to an install plan', () => {
    const plan = adapt(formSubmitDoc, registry)
    const ids = plan.map((entry) => entry.item.id)

    expect(ids).toContain('form')
    expect(ids).toContain('input')
    expect(ids).toContain('button')
    expect(plan.every((entry) => entry.source === 'a2ui')).toBe(true)
  })

  it('throws a readable error for unknown element types', () => {
    const badDoc: A2UIDocument = {
      version: '1.0',
      kind: 'a2ui',
      root: { id: 'x', type: 'unknown-widget' },
    }

    expect(() => adapt(badDoc, registry)).toThrow(A2UIAdapterError)
    try {
      adapt(badDoc, registry)
    } catch (err) {
      const error = err as A2UIAdapterError
      expect(error.reason).toBe('unknown_type')
      expect(error.path).toContain('x')
      expect(error.message).toContain('unknown-widget')
    }
  })

  it('renders an A2UI document as a tree of mapped components', () => {
    const renderer = new SchemaRenderer(registry)
    const tree = renderer.renderDocument(formSubmitDoc)

    expect(tree.protocolType).toBe('form')
    expect(tree.slug).toBe('form')
    expect(tree.item).toBeDefined()

    const field = tree.children[0]
    expect(field.protocolType).toBe('text-field')
    expect(field.slug).toBe('input')

    const action = tree.children[1]
    expect(action.protocolType).toBe('button')
    expect(action.slug).toBe('button')
  })

  it('renders a directory of A2UI documents', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'a2ui-'))
    await writeFile(join(dir, 'signin.json'), JSON.stringify(formSubmitDoc))

    const renderer = new SchemaRenderer(registry)
    const trees = await renderer.renderDirectory(dir)

    expect(trees).toHaveLength(1)
    expect(trees[0].slug).toBe('form')
  })

  it('hands the install plan to install-core for a real write', async () => {
    const plan = adapt(formSubmitDoc, registry)
    const button = plan.find((entry) => entry.item.id === 'button')
    expect(button).toBeDefined()
    expect(button?.source).toBe('a2ui')

    const dir = await mkdtemp(join(tmpdir(), 'a2ui-install-'))
    try {
      const kernel = createInstallKernel(registry)
      const result = await kernel.install(button!.item, dir, { source: 'cli' })
      expect(result.installed).toContain('button')
      const writtenPath = join(dir, button!.item.files[0].path)
      const content = await readFile(writtenPath, 'utf8')
      expect(content).toBe(button!.item.files[0].content)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
