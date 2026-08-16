import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { AppShell } from './AppShell.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('AppShell', () => {
  it('renders header, sidebar, and main regions with cu-* classes', () => {
    render(
      <AppShell header={<span>Header</span>} sidebar={<span>Sidebar</span>}>
        <span>Main</span>
      </AppShell>,
    )

    const shell = document.querySelector('.cu-app-shell')
    expect(shell).toHaveClass('cu-app-shell')
    expect(shell).toHaveAttribute('data-ai-role', 'app-shell')
    expect(shell?.firstElementChild).toHaveClass('cu-app-shell__frame')
    expect(screen.getByRole('banner')).toHaveClass('cu-app-shell__header')
    expect(screen.getByRole('complementary')).toHaveClass('cu-app-shell__sidebar')
    expect(screen.getByRole('main')).toHaveClass('cu-app-shell__main')
    expect(document.querySelector('.cu-app-shell__tab-bar')).toBeNull()
  })

  it('renders an optional tabBar slot inside the frame so container queries can hide it', () => {
    render(
      <AppShell
        header={<span>Header</span>}
        sidebar={<span>Sidebar</span>}
        tabBar={<nav data-testid="shell-tab">Tabs</nav>}
      >
        <span>Main</span>
      </AppShell>,
    )

    const tabSlot = document.querySelector('.cu-app-shell__tab-bar')
    expect(tabSlot).not.toBeNull()
    expect(tabSlot?.querySelector('[data-testid="shell-tab"]')).not.toBeNull()
  })

  it('places one navigation node in a single slot — not a sidebar plus tab-bar pair', () => {
    render(
      <AppShell header={<span>Header</span>} navigation={<nav data-testid="shell-nav">Nav</nav>}>
        <span>Main</span>
      </AppShell>,
    )

    const navSlot = document.querySelector('.cu-app-shell__nav')
    expect(navSlot).not.toBeNull()
    expect(navSlot?.querySelector('[data-testid="shell-nav"]')).not.toBeNull()
    expect(document.querySelector('.cu-app-shell__sidebar')).toBeNull()
    expect(document.querySelector('.cu-app-shell__tab-bar')).toBeNull()
    expect(screen.queryByRole('complementary')).toBeNull()
  })

  it('renders an optional footer outside the main scrollport so it adheres to the shell bottom', () => {
    render(
      <AppShell
        header={<span>Header</span>}
        navigation={<nav data-testid="shell-nav">Nav</nav>}
        footerPlacement="shell"
        footer={<span data-testid="shell-footer">Credits</span>}
      >
        <span>Main</span>
      </AppShell>,
    )

    const shell = document.querySelector('.cu-app-shell')
    expect(shell).toHaveAttribute('data-cu-shell')
    expect(shell).toHaveAttribute('data-footer-placement', 'shell')
    const footer = document.querySelector('.cu-app-shell__footer--chrome')
    expect(footer).not.toBeNull()
    expect(footer?.querySelector('[data-testid="shell-footer"]')).not.toBeNull()
    expect(screen.getByRole('contentinfo')).toHaveClass('cu-app-shell__footer')
  })

  it('defaults footerPlacement auto with dual hosts for compact↔wide morph', () => {
    render(
      <AppShell header={<span>Header</span>} footer={<span data-testid="credits">Credits</span>}>
        <span>Main</span>
      </AppShell>,
    )
    const shell = document.querySelector('.cu-app-shell')
    expect(shell).toHaveAttribute('data-footer-placement', 'auto')
    expect(document.querySelector('.cu-app-shell__footer--flow [data-testid="credits"]')).not.toBeNull()
    expect(document.querySelector('.cu-app-shell__footer--chrome [data-testid="credits"]')).not.toBeNull()
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    )
    expect(css).toMatch(/data-footer-placement='auto'[\s\S]*?footer--chrome[\s\S]*?display:\s*none/)
    expect(css).toMatch(
      /@container app-shell \(min-width: 48rem\)\s*\{[\s\S]*?data-footer-placement='auto'[\s\S]*?footer--chrome[\s\S]*?display:\s*block/,
    )
  })

  it('pins compact navigation to the block-end while main is the scrollport', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    )
    expect(css).toMatch(/minmax\(0,\s*1fr\)/)
    expect(css).toMatch(/block-size:\s*100%/)
    expect(css).toMatch(/min-block-size:\s*0/)
    expect(css).toMatch(/overflow:\s*hidden/)
    expect(css).toMatch(/\.cu-app-shell__nav\s*\{[^}]*position:\s*sticky/)
    expect(css).toMatch(/inset-inline-start:\s*0/)
    expect(css).toMatch(/\.cu-app-shell__main\s*\{[^}]*min-block-size:\s*0/)
    expect(css).toMatch(/\.cu-app-shell__main\s*\{[^}]*overflow-x:\s*hidden/)
    expect(css).toMatch(/\.cu-app-shell__main\s*\{[^}]*overflow-y:\s*auto/)
    expect(css).toMatch(/\.cu-app-shell__main\s*\{[^}]*scrollbar-gutter:\s*auto/)
    expect(css).toMatch(
      /\.cu-app-shell__main:has\(>\s*\.cu-workspace-split\[data-scroll-mode='panes'\]\)/,
    )
    expect(css).toMatch(/\.cu-app-shell__main:has\(>\s*\.cu-scroll-pane\)/)
    expect(css).toMatch(/\.cu-app-shell__footer\s*\{/)
    expect(css).toMatch(/grid-area:\s*footer/)
    expect(css).toMatch(/"footer"/)
    expect(css).toMatch(/inline-size:\s*100%/)
    expect(css).toMatch(/min-inline-size:\s*0/)
    expect(css).toMatch(/max-inline-size:\s*100%/)
    expect(css).toMatch(/\.cu-app-shell\s*\{[^}]*margin:\s*0/)
    expect(css).toMatch(/\.cu-app-shell\s*\{[^}]*padding:\s*0/)
    expect(css).toMatch(/\.cu-app-shell\s*\{[^}]*border-radius:\s*0/)
    expect(css).toMatch(/\.cu-app-shell__main\s*>\s*\.cu-workspace-split/)
    expect(css).toMatch(/cu-navigation--collapsed/)
    expect(css).toMatch(/\.cu-app-shell:has\(\.cu-app-shell__nav\)\s*\.cu-app-shell__footer--chrome/)
    expect(css).toMatch(/\.cu-app-shell__nav\s*\{[^}]*overflow:\s*hidden/)
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(
      <AppShell
        header={<span>Header</span>}
        sidebar={<span>{copy.get('appShell.sidebar') ?? ''}</span>}
        sidebarLabel={copy.get('appShell.sidebar') ?? ''}
      >
        <span>Main</span>
      </AppShell>,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('complementary', { name: 'الشريط الجانبي' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('appShell.sidebar')).toBe('Sidebar')
    expect(createCatalog(de).get('appShell.main')).toBe('Hauptinhalt')
    expect(createCatalog(zhCN).get('appShell.sidebar')).toBe('侧边栏')
  })
})
