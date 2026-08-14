import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MCP_APPS_COMPONENT_MAP,
  MCP_APPS_MIME,
  MCP_APPS_PROTOCOL,
  McpAppsAdapterError,
  SchemaRenderer,
  adapt,
  toUiResource,
  toolUiMeta,
  type McpAppsDocument,
} from './index.js'
import { createInstallKernel } from '@chameleon-ui/install-core'
import { registry } from '@chameleon-ui/registry'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const formSubmitDoc: McpAppsDocument = {
  version: '2026-01-26',
  kind: 'mcp-apps',
  uri: 'ui://chameleon-ui/form-submit',
  mimeType: MCP_APPS_MIME,
  title: 'Sign in',
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

describe('MCP Apps adapter', () => {
  it('maps known widget types to Chameleon slugs', () => {
    expect(DEFAULT_MCP_APPS_COMPONENT_MAP['text-field']).toBe('input')
    expect(DEFAULT_MCP_APPS_COMPONENT_MAP.button).toBe('button')
    expect(DEFAULT_MCP_APPS_COMPONENT_MAP.form).toBe('form')
  })

  it('adapts a form+submit document to an install plan', () => {
    const plan = adapt(formSubmitDoc, registry)
    const ids = plan.map((entry) => entry.item.id)

    expect(ids).toContain('form')
    expect(ids).toContain('input')
    expect(ids).toContain('button')
    expect(plan.every((entry) => entry.source === MCP_APPS_PROTOCOL)).toBe(true)
  })

  it('throws a readable error for unknown widget types', () => {
    const badDoc: McpAppsDocument = {
      ...formSubmitDoc,
      root: { id: 'x', type: 'unknown-widget' },
    }

    expect(() => adapt(badDoc, registry)).toThrow(McpAppsAdapterError)
    try {
      adapt(badDoc, registry)
    } catch (err) {
      const error = err as McpAppsAdapterError
      expect(error.reason).toBe('unknown_type')
      expect(error.path).toContain('x')
      expect(error.message).toContain('unknown-widget')
    }
  })

  it('rejects non ui:// URIs', () => {
    const badDoc: McpAppsDocument = { ...formSubmitDoc, uri: 'https://example.test/app' }
    expect(() => adapt(badDoc, registry)).toThrow(McpAppsAdapterError)
    try {
      adapt(badDoc, registry)
    } catch (err) {
      expect((err as McpAppsAdapterError).reason).toBe('invalid_uri')
    }
  })

  it('renders an MCP Apps document as a tree of mapped components', () => {
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

  it('emits a predeclared HTML UI resource without claiming host RPC', () => {
    const resource = toUiResource(formSubmitDoc)
    expect(resource.uri).toBe('ui://chameleon-ui/form-submit')
    expect(resource.mimeType).toBe(MCP_APPS_MIME)
    expect(resource.text).toContain('data-cu-poc="mcp-apps"')
    expect(resource.text).toContain('Not a host certification')
    expect(resource.text).toContain('name="email"')
    expect(resource.text).toContain('type="submit"')
    expect(resource.text).not.toContain('certified')
  })

  it('builds tool UI metadata for a ui:// resource', () => {
    expect(toolUiMeta(formSubmitDoc.uri)).toEqual({
      _meta: { ui: { resourceUri: 'ui://chameleon-ui/form-submit' } },
    })
  })

  it('renders a directory of MCP Apps documents', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'mcp-apps-'))
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
    expect(button?.source).toBe(MCP_APPS_PROTOCOL)

    const dir = await mkdtemp(join(tmpdir(), 'mcp-apps-install-'))
    try {
      const kernel = createInstallKernel(registry)
      const result = await kernel.install(button!.item, dir, { source: 'mcp' })
      expect(result.installed).toContain('button')
      const writtenPath = join(dir, button!.item.files[0].path)
      const content = await readFile(writtenPath, 'utf8')
      expect(content).toBe(button!.item.files[0].content)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
