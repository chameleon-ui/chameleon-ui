import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { BrandMark } from './BrandMark.js'
import en from './locales/en.json'

describe('BrandMark', () => {
  it('renders a sized brand image', () => {
    render(<BrandMark src="/logo.png" alt="Chameleon UI" />)
    const img = screen.getByRole('img', { name: 'Chameleon UI' })
    expect(img).toHaveClass('cu-brand-mark', 'cu-brand-mark--md')
    expect(img).toHaveAttribute('data-ai-role', 'brand-mark')
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'brand-mark.label')).toBeDefined()
  })
})
