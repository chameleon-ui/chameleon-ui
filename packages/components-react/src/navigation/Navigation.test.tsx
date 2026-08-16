import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Navigation, splitNavigationItems } from './Navigation.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const items = [
  { value: 'home', label: 'Home' },
  { value: 'library', label: 'Library' },
]

function navigationCss() {
  return readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )
}

describe('Navigation', () => {
  it('renders one landmark with one item list — not a Sidebar + TabBar pair', () => {
    render(<Navigation label="Main" items={items} activeValue="library" />)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toHaveClass('cu-navigation')
    expect(nav).toHaveAttribute('data-ai-role', 'navigation')
    expect(nav).toHaveAttribute('data-ai-intent', 'navigate-sections')
    expect(nav).toHaveAttribute('data-ai-state', 'expanded')
    expect(nav.firstElementChild).toHaveClass('cu-navigation__frame')
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
    expect(document.querySelector('.cu-sidebar')).toBeNull()
    expect(document.querySelector('.cu-tab-bar')).toBeNull()
    expect(screen.getByRole('button', { name: 'Library' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('reports selection from the single list', () => {
    const onSelect = vi.fn()
    render(<Navigation label="Main" items={items} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))
    expect(onSelect).toHaveBeenCalledWith('home')
  })

  it('marks the clicked destination current without an onSelect handler', () => {
    render(<Navigation label="Main" items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Library' }))
    expect(screen.getByRole('button', { name: 'Library' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('keeps overflow destinations in the same tree and parks them behind More on compact', () => {
    const many = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
      { value: 'e', label: 'E' },
      { value: 'f', label: 'F' },
    ]
    expect(splitNavigationItems(many)).toEqual({
      compact: many.slice(0, 4),
      overflow: many.slice(4),
    })
    render(<Navigation label="Main" items={many} moreLabel="More" />)
    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'false')
    expect(document.querySelector('.cu-navigation__overflow-list')?.children).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'true')
    expect(document.querySelector('.cu-navigation')).toHaveAttribute('data-more', 'open')
    fireEvent.click(screen.getByRole('button', { name: 'E' }))
    expect(screen.getByRole('button', { name: 'E' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute('aria-current', 'page')
    expect(document.querySelector('.cu-navigation')).toHaveAttribute('data-more', 'closed')
  })

  it('toggles the tablet rail without mounting a second tree', () => {
    const onCollapsedChange = vi.fn()
    render(
      <Navigation
        label="Main"
        items={items}
        collapseLabel="Collapse navigation"
        expandLabel="Expand navigation"
        onCollapsedChange={onCollapsedChange}
      />,
    )
    const toggle = screen.getByRole('button', { name: 'Collapse navigation' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(toggle)
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(document.querySelector('.cu-navigation')).toHaveAttribute('data-ai-state', 'collapsed')
    expect(screen.getByRole('button', { name: 'Expand navigation' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByRole('button', { name: 'Home' })).toHaveLength(1)
  })

  it('morphs via named container queries, not viewport width @media or a second component', () => {
    const css = navigationCss()
    expect(css).toMatch(/container-name:\s*navigation/)
    expect(css).toMatch(/container-type:\s*inline-size/)
    expect(css).toMatch(/@container navigation \(min-width: 48rem\)/)
    expect(css).toMatch(/@container navigation \(min-width: 80rem\)/)
    expect(css).toMatch(/@container app-shell \(min-width: 48rem\)/)
    expect(css).toMatch(/@container app-shell \(min-width: 80rem\)/)
    expect(css).toMatch(/@container app-shell \(max-width: 47\.99rem\)/)
    expect(css).toMatch(/@container navigation \(max-width: 47\.99rem\)/)
    expect(css).toContain('.cu-navigation__overflow')
    expect(css).toContain('.cu-navigation__entry--more')
    expect(css).not.toMatch(/@media\s*\(\s*(?:min|max)-width/)
    expect(css).not.toContain('cu-sidebar')
    expect(css).not.toContain('cu-tab-bar')
  })

  it('locks compact TabBar below phone/device CSS widths (375–430)', () => {
    const css = navigationCss()
    // DevTools device widths stay under 48rem (=768px @16px root).
    for (const width of [375, 390, 430]) {
      expect(width).toBeLessThan(768)
    }
    expect(css).toMatch(
      /@container app-shell \(max-width: 47\.99rem\)\s*\{[\s\S]*?\.cu-navigation__toggle\s*\{[^}]*display:\s*none/,
    )
  })

  it('does not let navigation max-width fight in-shell sidebar morph', () => {
    const css = navigationCss()
    const navMax = css.indexOf('@container navigation (max-width: 47.99rem)')
    const shellMin = css.indexOf('@container app-shell (min-width: 48rem)')
    expect(navMax).toBeGreaterThanOrEqual(0)
    expect(shellMin).toBeGreaterThan(navMax)
    const navMaxBlock = css.slice(navMax, shellMin)
    expect(navMaxBlock).not.toMatch(/flex-direction:\s*row/)
    expect(navMaxBlock).toMatch(/\.cu-navigation__toggle\s*\{[^}]*display:\s*none/)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'navigation.label')).toBeDefined()
    expect(requireMessage(catalog, 'navigation.more')).toBe('More')
    expect(requireMessage(createCatalog(zhCN), 'navigation.expand')).toBe('展开导航')
    expect(requireMessage(createCatalog(de), 'navigation.label')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'navigation.label')).toBe('التنقل')
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Navigation label="التنقل" items={items} />)
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('keeps header/TitleBar as sidebar-only DoD (hidden on compact TabBar)', () => {
    const css = navigationCss()
    expect(css).toMatch(
      /\.cu-navigation__header,\s*\n\.cu-navigation__footer,\s*\n\.cu-navigation__toggle \{\s*display:\s*none/,
    )
    expect(css).toMatch(
      /@container app-shell \(min-width: 48rem\)\s*\{[\s\S]*?\.cu-navigation__header\s*\{[^}]*display:\s*flex/,
    )
    expect(css).toMatch(
      /@container app-shell \(max-width: 47\.99rem\)\s*\{[\s\S]*?\.cu-navigation__header[\s\S]*?display:\s*none/,
    )
    render(
      <Navigation label="Main" items={items} header={<span data-testid="brand">Brand</span>} />,
    )
    expect(document.querySelector('.cu-navigation__header')).toContainElement(
      screen.getByTestId('brand'),
    )
  })

  it('aligns sidebar header chrome with NavigationTitle (no top stagger)', () => {
    const css = navigationCss()
    // Frame must not push TitleBar down with --cu-space-3; safe-area only.
    expect(css).toMatch(
      /@container app-shell \(min-width: 48rem\)\s*\{[\s\S]*?\.cu-navigation__frame\s*\{[^}]*padding-block-start:\s*env\(safe-area-inset-top/,
    )
    expect(css).not.toMatch(
      /@container app-shell \(min-width: 48rem\)\s*\{[\s\S]*?\.cu-navigation__frame\s*\{[^}]*padding-block:\s*var\(--cu-space-3\)/,
    )
    // Same chrome row formula as NavigationTitle __frame / NavAccountCard.
    expect(css).toMatch(
      /@container app-shell \(min-width: 48rem\)\s*\{[\s\S]*?\.cu-navigation__header\s*\{[^}]*min-block-size:\s*calc\(\s*var\(--cu-control-size-active\)\s*\+\s*2\s*\*\s*var\(--cu-space-1\)\s*\)/,
    )
    expect(css).toMatch(
      /@container app-shell \(min-width: 48rem\)\s*\{[\s\S]*?\.cu-navigation__header\s*\{[^}]*padding-block:\s*var\(--cu-space-1\)/,
    )
  })
})
