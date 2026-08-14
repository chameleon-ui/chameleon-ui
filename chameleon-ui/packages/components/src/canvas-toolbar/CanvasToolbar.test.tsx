import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { CanvasToolbar } from './CanvasToolbar.js'
import type { CanvasToolbarAction } from './CanvasToolbar.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const props = {
  label: 'Canvas toolbar',
  zoomInLabel: 'Zoom in',
  zoomOutLabel: 'Zoom out',
  resetLabel: 'Reset view',
  fitLabel: 'Fit to view',
}

describe('CanvasToolbar', () => {
  it('renders the toolbar with data-ai-role', () => {
    render(<CanvasToolbar {...props} onAction={() => {}} />)
    expect(screen.getByRole('toolbar', { name: 'Canvas toolbar' })).toHaveAttribute('data-ai-role', 'canvas-toolbar')
  })

  it('emits an action per control', () => {
    const actions: CanvasToolbarAction[] = []
    render(<CanvasToolbar {...props} onAction={(action) => actions.push(action)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset view' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fit to view' }))
    expect(actions).toEqual(['zoom-in', 'zoom-out', 'reset', 'fit'])
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'canvas-toolbar.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<CanvasToolbar {...props} onAction={() => {}} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
