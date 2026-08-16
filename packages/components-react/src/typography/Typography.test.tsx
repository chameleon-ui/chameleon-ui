import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Typography } from './Typography.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Typography', () => {
  it('renders the correct element and class for each variant', () => {
    render(<Typography variant="heading-1">Title</Typography>)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('cu-typography', 'cu-typography--heading-1')
    expect(heading).toHaveAttribute('data-ai-role', 'typography')
  })

  it('lets the consumer override the semantic element', () => {
    render(<Typography as="h2" variant="heading-1">Subtitle</Typography>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('cu-typography--heading-1')
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(<Typography variant="heading-1">{copy.get('typography.heading') ?? ''}</Typography>)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('عنوان')
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('typography.body')).toBe('Body text')
    expect(createCatalog(de).get('typography.heading')).toBe('Überschrift für diesen Abschnitt')
    expect(createCatalog(zhCN).get('typography.body')).toBe('正文')
  })
})
