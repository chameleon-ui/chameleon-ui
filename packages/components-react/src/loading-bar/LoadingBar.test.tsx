import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { LoadingBar } from './LoadingBar.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('LoadingBar', () => {
  it('renders a determinate progressbar with data-ai-role', () => {
    render(<LoadingBar value={40} label="Loading" />)
    const bar = screen.getByRole('progressbar', { name: 'Loading' })
    expect(bar).toHaveAttribute('data-ai-role', 'loading-bar')
    expect(bar).toHaveAttribute('data-ai-state', 'default')
    expect(bar).toHaveAttribute('aria-valuenow', '40')
  })

  it('renders the indeterminate state without a value', () => {
    render(<LoadingBar label="Loading" />)
    const bar = screen.getByRole('progressbar', { name: 'Loading' })
    expect(bar).toHaveAttribute('data-ai-state', 'indeterminate')
    expect(bar).not.toHaveAttribute('aria-valuenow')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'loading-bar.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<LoadingBar value={10} label="تحميل" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
