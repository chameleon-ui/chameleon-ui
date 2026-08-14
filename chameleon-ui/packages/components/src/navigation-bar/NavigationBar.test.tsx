import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { NavigationBar } from './NavigationBar.js'
import { useTabStacks } from './stack.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

function navigationBarCss() {
  return readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )
}

function TabHost() {
  const tabs = [
    { value: 'home', title: 'Home' },
    { value: 'library', title: 'Library' },
  ]
  const stack = useTabStacks(tabs)
  return (
    <div>
      <NavigationBar
        title={stack.current.title}
        backLabel={stack.previous?.title}
        onBack={stack.canPop ? stack.pop : undefined}
      />
      <button type="button" onClick={() => stack.selectTab('home')}>
        Open home tab
      </button>
      <button type="button" onClick={() => stack.selectTab('library')}>
        Open library tab
      </button>
      <button type="button" onClick={() => stack.push({ id: 'album', title: 'Album' })}>
        Push album
      </button>
    </div>
  )
}

describe('NavigationBar', () => {
  it('renders stack chrome, not a site link row', () => {
    render(<NavigationBar title="Library" />)
    const bar = document.querySelector('.cu-navigation-bar')
    expect(bar).toHaveAttribute('data-ai-role', 'navigation-bar')
    expect(bar).toHaveAttribute('data-ai-intent', 'navigate-stack')
    expect(bar).toHaveAttribute('data-ai-state', 'root')
    expect(screen.getByRole('heading', { name: 'Library' })).toHaveClass('cu-navigation-bar__title')
    expect(screen.queryByRole('button', { name: /back/i })).toBeNull()
    expect(document.querySelector('.cu-navbar')).toBeNull()
  })

  it('pops with a back control labeled by the previous title', () => {
    render(<NavigationBar title="Album" backLabel="Library" onBack={() => undefined} />)
    expect(document.querySelector('.cu-navigation-bar')).toHaveAttribute('data-ai-state', 'nested')
    expect(screen.getByRole('button', { name: 'Library' })).toHaveClass('cu-navigation-bar__back')
  })

  it('keeps one stack per tab — switching tabs does not push', () => {
    render(<TabHost />)
    fireEvent.click(screen.getByRole('button', { name: 'Push album' }))
    expect(screen.getByRole('heading', { name: 'Album' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Open library tab' }))
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Home' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Open home tab' }))
    expect(screen.getByRole('heading', { name: 'Album' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('morphs via named container queries, not viewport width @media', () => {
    const css = navigationBarCss()
    expect(css).toMatch(/container-name:\s*navigation-bar/)
    expect(css).toMatch(/container-type:\s*inline-size/)
    expect(css).toMatch(/@container navigation-bar \(min-width: 48rem\)/)
    expect(css).not.toMatch(/@media\s*\(\s*(?:min|max)-width/)
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'navigationBar.back')).toBe('Back')
    expect(requireMessage(createCatalog(zhCN), 'navigationBar.back')).toBe('返回')
    expect(requireMessage(createCatalog(de), 'navigationBar.back')).toBe('Zurück')
    expect(requireMessage(createCatalog(ar), 'navigationBar.back')).toBe('رجوع')
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<NavigationBar title="المكتبة" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
