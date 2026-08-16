import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { Navigation } from '../navigation/Navigation.js'
import { TitleBar } from './TitleBar.js'
import en from './locales/en.json'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

function navigationCss() {
  return readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../navigation/styles.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )
}

describe('TitleBar', () => {
  it('renders logo, title, and subtitle with brand chrome defaults', () => {
    render(<TitleBar title="EraseLab" subtitle="智能去水印" logoSrc="/logo.png" />)
    const control = screen.getByRole('button', { name: 'EraseLab' })
    expect(control).toHaveClass('cu-title-bar', 'cu-title-bar--no-select', 'cu-title-bar--interactive')
    expect(control).toHaveAttribute('data-ai-role', 'title-bar')
    expect(control).toHaveAttribute('data-ai-intent', 'navigate')
    expect(control).toHaveAttribute('data-ai-state', 'default')
    expect(screen.getByRole('img', { name: 'EraseLab' })).toHaveAttribute('src', '/logo.png')
    expect(screen.getByText('智能去水印')).toBeInTheDocument()
  })

  it('uses homeHref as a link and fires onBrandClick first', () => {
    const onBrandClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault())
    render(<TitleBar title="EraseLab" homeHref="/" onBrandClick={onBrandClick} />)
    const link = screen.getByRole('link', { name: 'EraseLab' })
    expect(link).toHaveAttribute('href', '/')
    fireEvent.click(link)
    expect(onBrandClick).toHaveBeenCalledTimes(1)
  })

  it('suppresses context menu by default and can opt out', () => {
    const { rerender } = render(<TitleBar title="EraseLab" />)
    const control = screen.getByRole('button', { name: 'EraseLab' })
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    control.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)

    rerender(<TitleBar title="EraseLab" preventContextMenu={false} />)
    const again = screen.getByRole('button', { name: 'EraseLab' })
    const event2 = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    again.dispatchEvent(event2)
    expect(event2.defaultPrevented).toBe(false)
  })

  it('hides text when density is compact and falls back to a letter mark', () => {
    render(<TitleBar title="EraseLab" subtitle="tag" density="compact" />)
    const control = screen.getByRole('button', { name: 'EraseLab' })
    expect(control).toHaveClass('cu-title-bar--compact')
    expect(control).toHaveAttribute('data-ai-state', 'compact')
    expect(control.querySelector('.cu-title-bar__letter')).toHaveTextContent('E')
    expect(control.querySelector('.cu-title-bar__text')).toBeTruthy()
  })

  it('accepts a custom logo node for SVG / Icon', () => {
    render(
      <TitleBar
        title="EraseLab"
        logo={<span data-testid="custom-logo">SVG</span>}
        brandInteractive={false}
      />,
    )
    expect(screen.getByTestId('custom-logo')).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('is the official Navigation header brand path and stays hidden on compact TabBar', () => {
    render(
      <Navigation
        label="Main"
        items={[{ value: 'home', label: 'Home' }]}
        header={<TitleBar title="EraseLab" subtitle="tag" logoSrc="/logo.png" />}
      />,
    )
    expect(document.querySelector('.cu-navigation__header .cu-title-bar')).toBeTruthy()
    const css = navigationCss()
    expect(css).toMatch(/\.cu-navigation__header[\s\S]*?display:\s*none/)
    expect(css).toMatch(
      /@container app-shell \(max-width: 47\.99rem\)\s*\{[\s\S]*?\.cu-navigation__header[\s\S]*?display:\s*none/,
    )
    expect(css).toMatch(
      /@container app-shell \(min-width: 48rem\)\s*\{[\s\S]*?\.cu-navigation__header\s*\{[^}]*display:\s*flex/,
    )
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'title-bar.label')).toBeDefined()
  })
})
