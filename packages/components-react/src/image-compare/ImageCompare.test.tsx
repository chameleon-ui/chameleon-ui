import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { ImageCompare } from './ImageCompare.js'
import en from './locales/en.json'

describe('ImageCompare', () => {
  it('renders a slider with before/after images', () => {
    render(<ImageCompare beforeSrc="/a.png" afterSrc="/b.png" checkerboard={false} />)
    expect(screen.getByRole('slider')).toHaveClass('cu-image-compare')
    expect(screen.getByRole('slider')).toHaveAttribute('data-ai-role', 'image-compare')
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('wraps with strong-contrast checkerboard when enabled', () => {
    const { container } = render(<ImageCompare beforeSrc="/a.png" afterSrc="/b.png" />)
    const surface = container.querySelector('.cu-checkerboard-surface')
    expect(surface).toHaveAttribute('data-contrast', 'strong')
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'image-compare.label')).toBeDefined()
  })
})
