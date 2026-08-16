import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Navbar } from './Navbar.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const items = [
  { value: 'home', label: 'Home' },
  { value: 'docs', label: 'Docs', href: '/docs' },
]

describe('Navbar', () => {
  it('renders a navigation landmark with data-ai-role', () => {
    render(<Navbar label="Main" brand="Chameleon" items={items} activeValue="home" />)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toHaveClass('cu-navbar')
    expect(nav).toHaveAttribute('data-ai-role', 'navbar')
    expect(nav).toHaveAttribute('data-ai-intent', 'navigate-sections')
    expect(nav).toHaveAttribute('data-ai-state', 'active')
    expect(nav.firstElementChild).toHaveClass('cu-navbar__frame')
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
  })

  it('notifies onSelect when an item is activated', () => {
    let selected = ''
    render(<Navbar label="Main" items={items} onSelect={(value) => { selected = value }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))
    expect(selected).toBe('home')
  })

  it('adapts layout with token-equal @container queries, not viewport media', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8')
    expect(css).toMatch(/container-type:\s*inline-size/)
    expect(css).toMatch(/@container \(min-width: 48rem\)/)
    expect(css).toMatch(/@container \(min-width: 80rem\)/)
    expect(css).not.toMatch(/@media\s*\(\s*(?:min|max)-width/)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'navbar.label')).toBeDefined()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)
    render(
      <Navbar
        label={copy.get('navbar.label') ?? ''}
        items={[{ value: 'home', label: copy.get('navbar.label') ?? '' }]}
      />,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('navigation', { name: 'شريط التنقل' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('navbar.label')).toBe('Navbar')
    expect(createCatalog(de).get('navbar.label')).toBe('Navigationsleiste')
    expect(createCatalog(zhCN).get('navbar.label')).toBe('导航栏')
  })
})
