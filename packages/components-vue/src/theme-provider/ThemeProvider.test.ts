import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ThemeProvider from './ThemeProvider.vue'

describe('ThemeProvider', () => {
  it('writes data-theme, density, lang, and dir onto the document element', () => {
    mount(ThemeProvider, {
      props: { density: 'comfortable', locale: 'ar', theme: 'linear' },
      slots: { default: '<span>child</span>' },
    })
    expect(document.documentElement.dataset.theme).toBe('linear')
    expect(document.documentElement.dataset.density).toBe('comfortable')
    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('writes data-color-scheme for manual dark / light switching', async () => {
    const wrapper = mount(ThemeProvider, {
      props: { colorScheme: 'light', theme: 'linear' },
      slots: { default: '<span>schemed</span>' },
    })
    expect(document.documentElement.dataset.colorScheme).toBe('light')
    await wrapper.setProps({ colorScheme: 'dark' })
    expect(document.documentElement.dataset.colorScheme).toBe('dark')
    await wrapper.setProps({ colorScheme: undefined })
    expect(document.documentElement.dataset.colorScheme).toBeUndefined()
  })

  it('scopes overlay CSS to data-theme instead of stacking :root', () => {
    mount(ThemeProvider, {
      props: {
        overlays: { linear: ':root { --cu-color-palette-brand: #111111; }' },
        theme: 'linear',
      },
      slots: { default: '<span>themed</span>' },
    })
    const style = document.getElementById('cu-theme-overlays')
    expect(style?.textContent).toContain('[data-theme="linear"]')
    expect(style?.textContent).not.toContain(':root')
  })
})
