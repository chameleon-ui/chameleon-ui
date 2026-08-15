import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { compileSchema, SchemaCompileError, type RenderSchema } from './schema.js'
import { DEFAULT_COMPONENT_MAP, SchemaRenderer } from './vue.js'

const examplesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'examples')
const KNOWN = new Set(Object.keys(DEFAULT_COMPONENT_MAP))

function loadExample(name: string): RenderSchema {
  return JSON.parse(readFileSync(join(examplesDir, name), 'utf8')) as RenderSchema
}

describe('schema-renderer vue examples', () => {
  const exampleFiles = readdirSync(examplesDir)
    .filter((name) => name.endsWith('.json'))
    .sort()

  it('ships the same default map as React (10 slugs)', () => {
    expect(Object.keys(DEFAULT_COMPONENT_MAP).sort()).toEqual([
      'alert',
      'badge',
      'button',
      'card',
      'divider',
      'empty-state',
      'heading',
      'input',
      'stack',
      'typography',
    ])
  })

  for (const name of exampleFiles) {
    it(`renders ${name} without a schema error`, () => {
      const schema = loadExample(name)
      const issues: unknown[] = []
      const wrapper = mount(SchemaRenderer, {
        props: { schema, onIssues: (found) => issues.push(...found) },
      })
      expect(issues).toEqual([])
      expect(wrapper.html()).not.toContain('data-schema-error')
      expect(wrapper.attributes('data-schema-renderer')).toBe('root')
    })
  }
})

describe('schema-renderer vue compile guards', () => {
  it('recovers unknown components as annotated placeholders', () => {
    const schema: RenderSchema = {
      version: '1.0',
      root: {
        component: 'stack',
        children: [
          { component: 'not-a-component', children: [] },
          { component: 'typography', children: ['still rendered'] },
        ],
      },
    }
    const { tree, issues } = compileSchema(schema, KNOWN)
    expect(issues).toHaveLength(1)
    expect(issues[0]?.reason).toBe('unknown_component')
    const wrapper = mount(SchemaRenderer, { props: { schema } })
    expect(wrapper.find('[data-schema-error]').exists()).toBe(true)
    expect(wrapper.text()).toContain('still rendered')
    expect(tree?.children).toHaveLength(2)
  })

  it('rejects structurally invalid schemas', () => {
    expect(() => compileSchema({}, KNOWN)).toThrow(SchemaCompileError)
  })
})
