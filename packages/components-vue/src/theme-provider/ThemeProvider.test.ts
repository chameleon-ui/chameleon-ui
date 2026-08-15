import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ThemeProvider from './ThemeProvider.vue'

describe('ThemeProvider', () => {
  it('writes data-theme, density, lang, and dir onto the document element', () => {
    mount(ThemeProvider, {
      props: { density: 'comfortable', locale: 'ar', theme: 'line' },
      slots: { default: '<span>child</span>' },
    })
    expect(document.documentElement.dataset.theme).toBe('line')
    expect(document.documentElement.dataset.density).toBe('comfortable')
    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('scopes overlay CSS to data-theme instead of stacking :root', () => {
    mount(ThemeProvider, {
      props: {
        overlays: { line: ':root { --cu-color-palette-brand: #111111; }' },
        theme: 'line',
      },
      slots: { default: '<span>themed</span>' },
    })
    const style = document.getElementById('cu-theme-overlays')
    expect(style?.textContent).toContain('[data-theme="line"]')
    expect(style?.textContent).not.toContain(':root')
  })
})
