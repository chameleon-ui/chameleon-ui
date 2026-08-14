import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  compileSchema,
  DEFAULT_COMPONENT_MAP,
  MAX_RENDER_DEPTH,
  MAX_RENDER_NODES,
  SchemaCompileError,
  SchemaRenderer,
  type RenderSchema,
} from './index.js'

const examplesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'examples')
const KNOWN = new Set(Object.keys(DEFAULT_COMPONENT_MAP))

function loadExample(name: string): RenderSchema {
  return JSON.parse(readFileSync(join(examplesDir, name), 'utf8')) as RenderSchema
}

describe('schema-renderer examples (snapshot-green)', () => {
  const exampleFiles = readdirSync(examplesDir)
    .filter((name) => name.endsWith('.json'))
    .sort()

  it('ships a non-empty committed example set', () => {
    expect(exampleFiles.length).toBeGreaterThanOrEqual(3)
  })

  for (const name of exampleFiles) {
    it(`renders ${name} without issues and matches the snapshot`, () => {
      const schema = loadExample(name)
      const issues: unknown[] = []
      const { container } = render(
        <SchemaRenderer schema={schema} onIssues={(found) => issues.push(...found)} />,
      )
      expect(issues).toEqual([])
      expect(container.innerHTML).not.toContain('data-schema-error')
      expect(container).toMatchSnapshot()
    })
  }
})

describe('schema-renderer compile guards', () => {
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
    const { container } = render(<SchemaRenderer schema={schema} />)
    expect(container.querySelector('[data-schema-error]')).toBeTruthy()
    expect(container.textContent).toContain('still rendered')
    expect(tree?.children).toHaveLength(2)
  })

  it('rejects structurally invalid schemas', () => {
    expect(() => compileSchema({}, KNOWN)).toThrow(SchemaCompileError)
    expect(() => compileSchema({ version: '0.9', root: {} }, KNOWN)).toThrow(SchemaCompileError)
    expect(() => compileSchema({ version: '1.0', root: 'text' }, KNOWN)).toThrow(
      SchemaCompileError,
    )
  })

  it(`enforces the ${MAX_RENDER_DEPTH}-level depth cap`, () => {
    let node: Record<string, unknown> = { component: 'divider', children: [] }
    for (let depth = 0; depth < MAX_RENDER_DEPTH + 2; depth += 1) {
      node = { component: 'stack', children: [node] }
    }
    expect(() =>
      compileSchema({ version: '1.0', root: node }, KNOWN),
    ).toThrowError(/depth cap/)
  })

  it(`enforces the ${MAX_RENDER_NODES}-node budget`, () => {
    const children = Array.from({ length: MAX_RENDER_NODES + 1 }, () => ({
      component: 'divider',
      children: [],
    }))
    expect(() =>
      compileSchema({ version: '1.0', root: { component: 'stack', children } }, KNOWN),
    ).toThrowError(/node budget/)
  })

  it('keeps compile complexity linear (no exponential blow-up on wide trees)', () => {
    const children = Array.from({ length: 200 }, (_, index) => ({
      component: 'badge',
      props: { variant: 'default' },
      children: [`b${index}`],
    }))
    const started = Date.now()
    const { tree } = compileSchema({ version: '1.0', root: { component: 'stack', children } }, KNOWN)
    expect(Date.now() - started).toBeLessThan(1000)
    expect(tree?.children).toHaveLength(200)
  })
})
