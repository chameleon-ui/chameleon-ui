import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { CheckerboardSurface } from './CheckerboardSurface.js'
import en from './locales/en.json'

describe('CheckerboardSurface', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    const { container } = render(<CheckerboardSurface>img</CheckerboardSurface>)
    const el = container.firstElementChild
    expect(el).toHaveClass('cu-checkerboard-surface')
    expect(el).toHaveAttribute('data-ai-role', 'checkerboard-surface')
    expect(el).toHaveAttribute('data-contrast', 'default')
  })

  it('applies strong contrast attribute', () => {
    const { container } = render(<CheckerboardSurface contrast="strong">img</CheckerboardSurface>)
    expect(container.firstElementChild).toHaveAttribute('data-contrast', 'strong')
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'checkerboard-surface.label')).toBeDefined()
  })
})
