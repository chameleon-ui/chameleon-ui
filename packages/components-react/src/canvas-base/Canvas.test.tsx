import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Canvas, snapToGridValue } from './Canvas.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Canvas (canvas-base)', () => {
  it('renders the application region with data-ai-role and canvas-2d backend marker', () => {
    render(<Canvas label="Flow canvas" />)
    const canvas = screen.getByRole('application', { name: 'Flow canvas' })
    expect(canvas).toHaveAttribute('data-ai-role', 'canvas-base')
    expect(canvas).toHaveAttribute('data-ai-state', 'default')
    expect(canvas).toHaveAttribute('data-backend', 'canvas-2d')
  })

  it('zooms via the keyboard within clamped bounds', () => {
    render(<Canvas label="Flow canvas" initialZoom={1} maxZoom={2} />)
    const canvas = screen.getByRole('application', { name: 'Flow canvas' })
    fireEvent.keyDown(canvas, { key: '+' })
    expect(canvas).toHaveAttribute('aria-description', 'Zoom 110%')
    fireEvent.keyDown(canvas, { key: '+' })
    fireEvent.keyDown(canvas, { key: '+' })
    fireEvent.keyDown(canvas, { key: '+' })
    fireEvent.keyDown(canvas, { key: '+' })
    expect(canvas).toHaveAttribute('aria-description', 'Zoom 161%')
  })

  it('pans via pointer drag and reports the viewport', () => {
    const viewports: string[] = []
    render(<Canvas label="Flow canvas" onViewportChange={(v) => viewports.push(`${v.offsetX},${v.offsetY}`)} />)
    const canvas = screen.getByRole('application', { name: 'Flow canvas' })
    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 })
    fireEvent.pointerMove(canvas, { clientX: 140, clientY: 90 })
    fireEvent.pointerUp(canvas)
    expect(viewports).toContain('40,-10')
  })

  it('snaps offsets to the grid when enabled', () => {
    expect(snapToGridValue(23, 24, true)).toBe(24)
    expect(snapToGridValue(13, 24, true)).toBe(24)
    expect(snapToGridValue(23, 24, false)).toBe(23)
  })

  it('shows and hides the minimap', () => {
    const { rerender } = render(<Canvas label="Flow canvas" showMinimap />)
    expect(document.querySelector('.cu-canvas__minimap')).not.toBeNull()
    rerender(<Canvas label="Flow canvas" />)
    expect(document.querySelector('.cu-canvas__minimap')).toBeNull()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'canvas-base.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Canvas label="لوحة" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
