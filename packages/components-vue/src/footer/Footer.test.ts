import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppShell from '../app-shell/AppShell.vue'
import Footer from './Footer.vue'

describe('Footer', () => {
  it('renders a recognizable attribution root', () => {
    const wrapper = mount(Footer, { slots: { default: 'Credits' } })
    expect(wrapper.classes()).toContain('cu-footer')
    expect(wrapper.attributes('data-ai-role')).toBe('footer')
    expect(wrapper.attributes('data-ai-intent')).toBe('show-attribution')
    expect(wrapper.text()).toContain('Credits')
  })

  it('is the official AppShell footer child path', () => {
    const wrapper = mount(AppShell, {
      props: { footerPlacement: 'shell' },
      slots: {
        header: 'H',
        default: 'Main',
        footer: '<Footer>Thanks</Footer>',
      },
      global: { components: { Footer } },
    })
    expect(wrapper.find('.cu-app-shell__footer .cu-footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Thanks')
  })
})
