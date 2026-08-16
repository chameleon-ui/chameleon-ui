import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Edge } from './Edge.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Edge', () => {
  it('renders a bezier path with data-ai-role', () => {
    const { container } = render(<Edge x1={10} y1={10} x2={110} y2={60} label="depends on" />)
    const edge = container.querySelector('.cu-edge')
    expect(edge).toHaveAttribute('data-ai-role', 'edge')
    const path = edge?.querySelector('path')
    expect(path?.getAttribute('d')).toContain('C')
    expect(screen.getByText('depends on')).toBeInTheDocument()
  })

  it('renders a straight path when asked', () => {
    const { container } = render(<Edge x1={0} y1={0} x2={50} y2={50} variant="straight" />)
    expect(container.querySelector('path')?.getAttribute('d')).toBe('M 0 0 L 50 50')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'edge.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Edge x1={0} y1={0} x2={10} y2={10} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
