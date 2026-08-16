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

  it('renders an optional footer slot outside main so it adheres to the shell bottom', () => {
    const wrapper = mount(AppShell, {
      props: { footerPlacement: 'shell' },
      slots: {
        header: '<span>Header</span>',
        navigation: '<nav>Nav</nav>',
        footer: '<span data-testid="shell-footer">Credits</span>',
        default: '<span>Main</span>',
      },
    })

    expect(wrapper.attributes('data-cu-shell')).toBeDefined()
    expect(wrapper.attributes('data-footer-placement')).toBe('shell')
    expect(wrapper.find('footer.cu-app-shell__footer--chrome [data-testid="shell-footer"]').exists()).toBe(true)
    expect(wrapper.find('main.cu-app-shell__main [data-testid="shell-footer"]').exists()).toBe(false)
  })

  it('defaults footerPlacement auto with dual hosts for compact↔wide morph', () => {
    const wrapper = mount(AppShell, {
      slots: {
        header: '<span>Header</span>',
        footer: '<span data-testid="credits">Credits</span>',
        default: '<span>Main</span>',
      },
    })
    expect(wrapper.attributes('data-footer-placement')).toBe('auto')
    expect(wrapper.find('.cu-app-shell__footer--flow [data-testid="credits"]').exists()).toBe(true)
    expect(wrapper.find('.cu-app-shell__footer--chrome [data-testid="credits"]').exists()).toBe(true)
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
    expect(css).toMatch(/\.cu-app-shell__footer\s*\{/)
    expect(css).toMatch(/grid-area:\s*footer/)
    expect(css).toMatch(/inline-size:\s*100%/)
    expect(css).toMatch(/\.cu-app-shell\s*\{[^}]*margin:\s*0/)
    expect(css).toMatch(/\.cu-app-shell\s*\{[^}]*padding:\s*0/)
    expect(css).toMatch(/\.cu-app-shell\s*\{[^}]*border-radius:\s*0/)
    expect(css).toMatch(/\.cu-app-shell__main\s*>\s*\.cu-workspace-split/)
    expect(css).toMatch(/cu-navigation--collapsed/)
    expect(css).toMatch(/\.cu-app-shell__nav\s*\{[^}]*overflow:\s*hidden/)
  })
})
