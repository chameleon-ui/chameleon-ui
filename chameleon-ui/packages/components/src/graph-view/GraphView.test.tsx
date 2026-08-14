import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { GraphView } from './GraphView.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const nodes = [
  { id: 'api', label: 'API' },
  { id: 'db', label: 'Database' },
  { id: 'cache', label: 'Cache' },
]
const links = [
  { source: 'api', target: 'db' },
  { source: 'api', target: 'cache' },
]

describe('GraphView', () => {
  it('renders nodes and links with data-ai-role', () => {
    const { container } = render(<GraphView nodes={nodes} links={links} label="Service graph" />)
    const wrapper = container.querySelector('.cu-graph-view')
    expect(wrapper).toHaveAttribute('data-ai-role', 'graph-view')
    expect(wrapper).toHaveAttribute('data-ai-state', 'default')
    expect(container.querySelectorAll('.cu-graph-view__link')).toHaveLength(2)
    expect(container.querySelectorAll('.cu-graph-view__node')).toHaveLength(3)
  })

  it('skips links that reference unknown nodes', () => {
    const { container } = render(
      <GraphView nodes={nodes} links={[...links, { source: 'api', target: 'missing' }]} label="Service graph" />,
    )
    expect(container.querySelectorAll('.cu-graph-view__link')).toHaveLength(2)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'graph-view.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<GraphView nodes={nodes} links={links} label="رسم" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
