import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppShell from './AppShell.vue'

describe('AppShell', () => {
  it('renders header and main regions with cu-* classes', () => {
    const wrapper = mount(AppShell, {
      slots: {
        header: '<span>Header</span>',
        default: '<span>Main</span>',
      },
    })

    expect(wrapper.classes()).toContain('cu-app-shell')
    expect(wrapper.attributes('data-ai-role')).toBe('app-shell')
    expect(wrapper.find('.cu-app-shell__frame').exists()).toBe(true)
    expect(wrapper.find('header.cu-app-shell__header').exists()).toBe(true)
    expect(wrapper.find('main.cu-app-shell__main').exists()).toBe(true)
    expect(wrapper.find('.cu-app-shell__tab-bar').exists()).toBe(false)
    expect(wrapper.find('.cu-app-shell__nav').exists()).toBe(false)
  })

  it('places one navigation node in a single slot — not a sidebar plus tab-bar pair', () => {
    const wrapper = mount(AppShell, {
      slots: {
        header: '<span>Header</span>',
        navigation: '<nav data-testid="shell-nav">Nav</nav>',
        default: '<span>Main</span>',
      },
    })

    expect(wrapper.find('.cu-app-shell__nav [data-testid="shell-nav"]').exists()).toBe(true)
    expect(wrapper.find('.cu-app-shell__sidebar').exists()).toBe(false)
    expect(wrapper.find('.cu-app-shell__tab-bar').exists()).toBe(false)
  })

  it('pins compact navigation to the block-end while main is the scrollport', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    )
    expect(css).toMatch(/minmax\(0,\s*1fr\)/)
    expect(css).toMatch(/block-size:\s*100%/)
    expect(css).toMatch(/min-block-size:\s*0/)
    expect(css).not.toMatch(/min-width:\s*\d+vw/)
    expect(css).toMatch(/\.cu-app-shell__nav\s*\{[^}]*position:\s*sticky/)
    expect(css).toMatch(/\.cu-app-shell__main\s*\{[^}]*overflow-y:\s*auto/)
  })
})
