import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Carousel } from './Carousel.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const props = { label: 'Featured', previousLabel: 'Previous slide', nextLabel: 'Next slide' }

describe('Carousel', () => {
  it('renders the region with data-ai-role', () => {
    render(<Carousel {...props} items={[<p key="a">One</p>, <p key="b">Two</p>]} />)
    expect(screen.getByRole('region', { name: 'Featured' })).toHaveAttribute('data-ai-role', 'carousel')
    expect(screen.getByText('One')).toBeInTheDocument()
  })

  it('moves to the next slide and wraps around', () => {
    render(<Carousel {...props} items={[<p key="a">One</p>, <p key="b">Two</p>]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByText('Two')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByText('One')).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'carousel.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Carousel {...props} items={[<p key="a">واحد</p>]} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
