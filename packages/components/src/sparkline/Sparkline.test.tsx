import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Sparkline } from './Sparkline.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Sparkline', () => {
  it('renders a polyline with data-ai-role', () => {
    render(<Sparkline data={[1, 3, 2, 5]} label="Latency trend" />)
    const svg = screen.getByRole('img', { name: 'Latency trend' })
    expect(svg).toHaveAttribute('data-ai-role', 'sparkline')
    expect(svg).toHaveAttribute('data-ai-state', 'default')
    expect(svg.querySelector('polyline')).not.toBeNull()
  })

  it('marks fewer than two samples as empty', () => {
    render(<Sparkline data={[1]} label="Latency trend" />)
    expect(screen.getByRole('img', { name: 'Latency trend' })).toHaveAttribute('data-ai-state', 'empty')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'sparkline.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Sparkline data={[1, 2]} label="اتجاه" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
