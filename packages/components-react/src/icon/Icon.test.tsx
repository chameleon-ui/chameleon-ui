import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Icon } from './Icon.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Icon', () => {
  it('renders a default arrow with a mode data attribute and accessible name', () => {
    render(<Icon label="Back" mode="mirror" />)
    const icon = screen.getByRole('img', { name: 'Back' })

    expect(icon).toHaveClass('cu-icon', 'cu-icon--mirror')
    expect(icon).toHaveAttribute('data-mode', 'mirror')
    expect(icon).toHaveAttribute('data-ai-role', 'icon')
  })

  it('supports preserve and localized modes', () => {
    const { rerender } = render(<Icon label="Menu" mode="preserve" />)
    expect(screen.getByRole('img', { name: 'Menu' })).toHaveAttribute('data-mode', 'preserve')

    rerender(<Icon label="Menu" mode="localized" />)
    expect(screen.getByRole('img', { name: 'Menu' })).toHaveAttribute('data-mode', 'localized')
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(<Icon label={copy.get('icon.back') ?? ''} mode="mirror" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('img', { name: 'رجوع' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('icon.close')).toBe('Close')
    expect(createCatalog(de).get('icon.menu')).toBe('Hauptmenü öffnen')
    expect(createCatalog(zhCN).get('icon.back')).toBe('返回')
  })
})
