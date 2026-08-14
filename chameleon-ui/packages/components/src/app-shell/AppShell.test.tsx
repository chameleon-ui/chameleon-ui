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
