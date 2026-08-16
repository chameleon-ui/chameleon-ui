import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from './ThemeProvider.js'

describe('ThemeProvider', () => {
  it('writes data-theme, density, lang, and dir onto the document element', () => {
    render(
      <ThemeProvider density="comfortable" locale="ar" theme="linear">
        <span>child</span>
      </ThemeProvider>,
    )
    expect(document.documentElement.dataset.theme).toBe('linear')
    expect(document.documentElement.dataset.density).toBe('comfortable')
    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('writes data-color-scheme for manual dark / light switching', () => {
    const { rerender } = render(
      <ThemeProvider colorScheme="light" theme="linear">
        <span>schemed</span>
      </ThemeProvider>,
    )
    expect(document.documentElement.dataset.colorScheme).toBe('light')
    rerender(
      <ThemeProvider colorScheme="dark" theme="linear">
        <span>schemed</span>
      </ThemeProvider>,
    )
    expect(document.documentElement.dataset.colorScheme).toBe('dark')
    rerender(
      <ThemeProvider theme="linear">
        <span>schemed</span>
      </ThemeProvider>,
    )
    expect(document.documentElement.dataset.colorScheme).toBeUndefined()
  })

  it('scopes overlay CSS to data-theme instead of stacking :root', () => {
    render(
      <ThemeProvider
        overlays={{ linear: ':root { --cu-color-palette-brand: #111111; }' }}
        theme="linear"
      >
        <span>themed</span>
      </ThemeProvider>,
    )
    const style = document.getElementById('cu-theme-overlays')
    expect(style?.textContent).toContain('[data-theme="linear"]')
    expect(style?.textContent).not.toContain(':root')
  })
})
