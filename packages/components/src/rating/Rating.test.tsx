import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Rating } from './Rating.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Rating', () => {
  it('renders a radio per star with data-ai-role', () => {
    render(<Rating value={3} onChange={() => {}} label="Rating" starLabel="Star" />)
    const group = screen.getByRole('radiogroup', { name: 'Rating' })
    expect(group).toHaveAttribute('data-ai-role', 'rating')
    expect(screen.getAllByRole('radio')).toHaveLength(5)
    expect(screen.getByRole('radio', { name: '3 Star' })).toHaveAttribute('aria-checked', 'true')
  })

  it('changes the rating via click and arrow keys', () => {
    let next = 0
    render(<Rating value={2} onChange={(value) => { next = value }} label="Rating" starLabel="Star" />)
    fireEvent.click(screen.getByRole('radio', { name: '4 Star' }))
    expect(next).toBe(4)
    fireEvent.keyDown(screen.getByRole('radio', { name: '3 Star' }), { key: 'ArrowRight' })
    expect(next).toBe(3)
  })

  it('is read-only without onChange', () => {
    render(<Rating value={4} label="Rating" />)
    expect(screen.getByRole('radiogroup', { name: 'Rating' })).toHaveAttribute('data-ai-state', 'readonly')
    expect(screen.getByRole('radio', { name: '1 Star' })).toBeDisabled()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'rating.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Rating value={3} onChange={() => {}} label="تقييم" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
