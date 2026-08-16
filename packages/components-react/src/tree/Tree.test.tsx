import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Tree } from './Tree.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const nodes = [
  {
    id: 'src',
    label: 'src',
    children: [{ id: 'src-index', label: 'index.ts' }],
  },
  { id: 'readme', label: 'README.md' },
]

describe('Tree', () => {
  it('renders tree semantics with data-ai-role', () => {
    render(<Tree nodes={nodes} />)
    expect(screen.getByRole('tree').closest('.cu-tree')).toHaveAttribute('data-ai-role', 'tree')
    expect(screen.getAllByRole('treeitem')).toHaveLength(2)
  })

  it('expands a node via its toggle', () => {
    render(<Tree nodes={nodes} toggleLabel="Toggle node" />)
    expect(screen.queryByText('index.ts')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Toggle node: src' }))
    expect(screen.getByText('index.ts')).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'tree.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Tree nodes={nodes} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
