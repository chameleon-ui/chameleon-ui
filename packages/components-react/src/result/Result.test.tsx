import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Result } from './Result.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Result', () => {
  it('renders the status region with data-ai-role', () => {
    render(<Result status="success" title="Payment received" description="A receipt was sent." />)
    const element = screen.getByRole('status')
    expect(element).toHaveClass('cu-result')
    expect(element).toHaveAttribute('data-ai-role', 'result')
    expect(element).toHaveAttribute('data-ai-state', 'success')
  })

  it('renders the action area', () => {
    render(
      <Result status="error" title="Import failed">
        <button type="button">Retry</button>
      </Result>,
    )
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'result.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Result status="info" title="النتيجة" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
