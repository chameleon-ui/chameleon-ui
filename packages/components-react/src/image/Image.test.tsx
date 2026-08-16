import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Image } from './Image.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Image', () => {
  it('renders the img with alt text and data-ai-role', () => {
    render(<Image src="/cover.png" alt="Cover" />)
    const img = screen.getByRole('img', { name: 'Cover' })
    expect(img.closest('.cu-image')).toHaveAttribute('data-ai-role', 'image')
    expect(img.closest('.cu-image')).toHaveAttribute('data-ai-state', 'default')
  })

  it('shows the fallback on load error', () => {
    render(<Image src="/missing.png" alt="Cover" errorLabel="Image failed to load" />)
    fireEvent.error(screen.getByRole('img', { name: 'Cover' }))
    expect(screen.getByText('Image failed to load')).toBeInTheDocument()
    expect(screen.getByText('Image failed to load').closest('.cu-image')).toHaveAttribute('data-ai-state', 'error')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'image.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Image src="/cover.png" alt="غلاف" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
