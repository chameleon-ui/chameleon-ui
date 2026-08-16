import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Spinner } from './Spinner.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Spinner', () => {
  it('renders a status region with size classes and a default label', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')

    expect(spinner).toHaveClass('cu-spinner', 'cu-spinner--md')
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
    expect(spinner).toHaveAttribute('data-ai-role', 'spinner')
  })

  it('supports a custom label and size', () => {
    render(<Spinner label="Saving" size="lg" />)
    expect(screen.getByRole('status')).toHaveClass('cu-spinner--lg')
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving')
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(<Spinner label={copy.get('spinner.loading') ?? ''} />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'جارٍ التحميل')
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('spinner.loading')).toBe('Loading')
    expect(createCatalog(de).get('spinner.saving')).toBe('Wird gespeichert')
    expect(createCatalog(zhCN).get('spinner.loading')).toBe('加载中')
  })
})
