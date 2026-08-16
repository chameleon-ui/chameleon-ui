import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Container } from './Container.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Container', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Container size="lg">Content</Container>)
    const body = screen.getByText('Content')
    const element = body.parentElement
    expect(body).toHaveClass('cu-container__body')
    expect(element).toHaveClass('cu-container', 'cu-container--lg')
    expect(element).toHaveAttribute('data-ai-role', 'container')
    expect(element).toHaveAttribute('data-ai-intent', 'group-content')
    expect(element).toHaveAttribute('data-ai-state', 'lg')
  })

  it('adapts padding with token-equal @container queries, not viewport media', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8')
    expect(css).toMatch(/container-type:\s*inline-size/)
    expect(css).toMatch(/@container \(min-width: 48rem\)/)
    expect(css).toMatch(/@container \(min-width: 80rem\)/)
    expect(css).not.toMatch(/@media\s*\(\s*(?:min|max)-width/)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'container.label')).toBeDefined()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)
    render(<Container>{copy.get('container.label') ?? ''}</Container>)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByText('حاوية')).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('container.label')).toBe('Container')
    expect(createCatalog(de).get('container.label')).toBe('Inhaltscontainer')
    expect(createCatalog(zhCN).get('container.label')).toBe('容器')
  })
})
