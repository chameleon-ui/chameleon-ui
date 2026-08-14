import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { ArticleCard } from './ArticleCard.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('ArticleCard', () => {
  it('renders title, excerpt, metadata, and read action', () => {
    render(
      <ArticleCard
        title="Shipping Phase 6"
        excerpt="Forty-one new components."
        author="Ada"
        date="2026-08-13"
        href="/blog/phase-6"
        readLabel="Read article"
      />,
    )
    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('data-ai-role', 'article-card')
    expect(screen.getByRole('heading', { name: 'Shipping Phase 6' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Read article: Shipping Phase 6' })).toHaveAttribute('href', '/blog/phase-6')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'article-card.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<ArticleCard title="مقالة" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
