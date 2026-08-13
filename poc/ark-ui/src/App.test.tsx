import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App direction and locale playground', () => {
  it('switches locale and document direction without telemetry markers', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Locale' }), 'en-XA')
    expect(document.documentElement).toHaveAttribute('lang', 'en-XA')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Å')
    expect(screen.getByRole('heading', { name: /Ƒåîř çöɱþöñéñţ/i })).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '[ŘŢĻ]' }))
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
    expect(screen.getAllByText('390px').length).toBeGreaterThan(0)
    expect(screen.getAllByText('768px').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1280px').length).toBeGreaterThan(0)
    expect(
      [...container.querySelectorAll('[data-preview-width]')].map((node) =>
        node.getAttribute('data-preview-width'),
      ),
    ).toEqual(['390', '768', '1280'])
    expect(
      [...container.querySelectorAll('[data-preview-width]')].every(
        (node) => node.getAttribute('lang') === 'en-XA' && node.getAttribute('dir') === 'rtl',
      ),
    ).toBe(true)
    expect(container.querySelector('[data-ai-role]')).toBeNull()

    await user.selectOptions(screen.getByRole('combobox', { name: '[Ļöçåļé~~]' }), 'en')
    expect(document.documentElement).toHaveAttribute('lang', 'en')
  })
})
