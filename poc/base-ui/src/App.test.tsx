import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App direction, locale, and breakpoint playground', () => {
  it('switches pseudo-locale and RTL, then exposes all three previews', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Locale' }), 'en-XA')
    expect(document.documentElement.getAttribute('lang')).toBe('en-XA')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('⟦')

    await user.click(screen.getByRole('radio', { name: /Říǵɦţ ţó léƒţ/ }))
    expect(document.documentElement.getAttribute('dir')).toBe('rtl')

    await user.click(screen.getByRole('checkbox', { name: /şɦóŵ áll ţɦřéé/i }))
    expect(
      [...container.querySelectorAll('[data-preview-width]')].map((node) =>
        node.getAttribute('data-preview-width'),
      ),
    ).toEqual(['390', '768', '1280'])
    expect([...container.querySelectorAll('details')].every((node) => node.hasAttribute('open'))).toBe(true)
    expect(
      [...container.querySelectorAll('[data-preview-width]')].every((node) => {
        const preview = node.closest('[lang][dir]')
        return preview?.getAttribute('lang') === 'en-XA' && preview.getAttribute('dir') === 'rtl'
      }),
    ).toBe(true)
    const labelledSections = [...container.querySelectorAll('[data-preview-width]')].map(
      (node) => node.closest('section[aria-labelledby]'),
    )
    expect(labelledSections.every(Boolean)).toBe(true)
    const headingIds = labelledSections.map((node) => node?.getAttribute('aria-labelledby'))
    expect(new Set(headingIds).size).toBe(3)
    for (const headingId of headingIds) {
      expect(headingId && container.querySelector(`[id="${headingId}"]`)).not.toBeNull()
    }
    expect(container.querySelector('[data-ai-role]')).toBeNull()

    await user.selectOptions(screen.getByRole('combobox', { name: '⟦Ŀóçálé~~⟧' }), 'en')
    expect(document.documentElement.getAttribute('lang')).toBe('en')
  })
})
