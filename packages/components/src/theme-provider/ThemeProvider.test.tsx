import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from './ThemeProvider.js'

describe('ThemeProvider', () => {
  it('writes data-theme, density, lang, and dir onto the document element', () => {
    render(
      <ThemeProvider density="comfortable" locale="ar" theme="line">
        <span>child</span>
      </ThemeProvider>,
    )
    expect(document.documentElement.dataset.theme).toBe('line')
    expect(document.documentElement.dataset.density).toBe('comfortable')
    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('scopes overlay CSS to data-theme instead of stacking :root', () => {
    render(
      <ThemeProvider
        overlays={{ line: ':root { --cu-color-palette-brand: #111111; }' }}
        theme="line"
      >
        <span>themed</span>
      </ThemeProvider>,
    )
    const style = document.getElementById('cu-theme-overlays')
    expect(style?.textContent).toContain('[data-theme="line"]')
    expect(style?.textContent).not.toContain(':root')
  })
})
