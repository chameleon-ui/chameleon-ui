import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Masonry } from './Masonry.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Masonry', () => {
  it('renders a column track with cu-* classes and data-ai-role', () => {
    render(
      <Masonry columns={4} gap="lg">
        <span>One</span>
        <span>Two</span>
      </Masonry>,
    )
    const one = screen.getByText('One')
    const track = one.parentElement
    const root = track?.parentElement
    expect(root).toHaveClass('cu-masonry', 'cu-masonry--columns-4', 'cu-masonry--gap-lg')
    expect(root).toHaveAttribute('data-ai-role', 'masonry')
    expect(root).toHaveAttribute('data-ai-intent', 'layout-columns')
    expect(track).toHaveClass('cu-masonry__track')
  })

  it('adapts columns with token-equal @container queries, not viewport media', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8')
    expect(css).toMatch(/container-type:\s*inline-size/)
    expect(css).toMatch(/@container \(min-width: 48rem\)/)
    expect(css).toMatch(/@container \(min-width: 80rem\)/)
    expect(css).not.toMatch(/@media\s*\(\s*(?:min|max)-width/)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'masonry.label')).toBeDefined()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)
    render(
      <Masonry>
        <span>{copy.get('masonry.label') ?? ''}</span>
      </Masonry>,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByText('شبكة البناء')).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('masonry.label')).toBe('Masonry')
    expect(createCatalog(de).get('masonry.label')).toBe('Mauerwerksraster')
    expect(createCatalog(zhCN).get('masonry.label')).toBe('瀑布流')
  })
})
