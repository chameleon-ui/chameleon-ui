import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { FlowNode } from './FlowNode.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('FlowNode', () => {
  it('renders positioned with data-ai-role and ports', () => {
    render(<FlowNode id="n1" x={40} y={80} title="Build" status="active" />)
    const node = screen.getByText('Build').closest('.cu-flow-node')
    expect(node).toHaveAttribute('data-ai-role', 'flow-node')
    expect(node).toHaveAttribute('data-ai-state', 'active')
    expect(node).toHaveAttribute('data-canvas-node')
    expect(node).toHaveStyle({ transform: 'translate(40px, 80px)' })
    expect(node?.querySelectorAll('.cu-flow-node__port')).toHaveLength(2)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'flow-node.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<FlowNode id="n1" x={0} y={0} title="بناء" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
