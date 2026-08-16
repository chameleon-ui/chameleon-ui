import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Navigation } from '../navigation/Navigation.js'
import { NavAccountCard } from './NavAccountCard.js'
import en from './locales/en.json'

function navigationCss() {
  return readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../navigation/styles.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )
}

describe('NavAccountCard', () => {
  it('renders avatar, username, nickname, and logout', () => {
    const onLogout = vi.fn()
    render(
      <NavAccountCard
        username="Ada"
        nickname="admin"
        avatarSrc="/ada.png"
        logoutLabel="登出"
        onLogout={onLogout}
      />,
    )
    const root = document.querySelector('.cu-nav-account-card')
    expect(root).toHaveAttribute('data-ai-role', 'nav-account-card')
    expect(root).toHaveAttribute('data-ai-intent', 'identify-user')
    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveAttribute('src', '/ada.png')
    fireEvent.click(screen.getByRole('button', { name: '登出' }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('is the official Navigation footer path; compact hides footer; footer suppresses toggle', () => {
    render(
      <Navigation
        label="Main"
        items={[{ value: 'home', label: 'Home' }]}
        footer={<NavAccountCard username="Ada" onLogout={() => undefined} />}
      />,
    )
    expect(document.querySelector('.cu-navigation__footer .cu-nav-account-card')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Collapse navigation' })).toBeNull()
    const css = navigationCss()
    expect(css).toMatch(/\.cu-navigation__footer[\s\S]*?display:\s*none/)
    expect(css).toMatch(
      /@container app-shell \(max-width: 47\.99rem\)\s*\{[\s\S]*?\.cu-navigation__footer[\s\S]*?display:\s*none/,
    )
    expect(css).toMatch(
      /@container app-shell \(min-width: 48rem\)\s*\{[\s\S]*?\.cu-navigation__footer\s*\{[^}]*display:\s*block/,
    )
  })

  it('row height matches NavigationTitle via --cu-control-size-active + space-1', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    )
    expect(css).toMatch(
      /\.cu-nav-account-card\s*\{[^}]*min-block-size:\s*calc\(\s*var\(--cu-control-size-active\)\s*\+\s*2\s*\*\s*var\(--cu-space-1\)\s*\)/,
    )
    expect(css).toMatch(/\.cu-nav-account-card\s*\{[^}]*padding-block:\s*var\(--cu-space-1\)/)
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'nav-account-card.label')).toBeDefined()
    expect(requireMessage(createCatalog(en), 'nav-account-card.logout')).toBeDefined()
  })
})
