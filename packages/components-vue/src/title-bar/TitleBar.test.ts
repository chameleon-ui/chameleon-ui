import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TitleBar from './TitleBar.vue'
import Navigation from '../navigation/Navigation.vue'

describe('TitleBar', () => {
  it('renders logo, title, and subtitle with brand chrome defaults', () => {
    const wrapper = mount(TitleBar, {
      props: { title: 'EraseLab', subtitle: '智能去水印', logoSrc: '/logo.png' },
    })
    const root = wrapper.get('[data-ai-role="title-bar"]')
    expect(root.classes()).toContain('cu-title-bar')
    expect(root.classes()).toContain('cu-title-bar--no-select')
    expect(root.classes()).toContain('cu-title-bar--interactive')
    expect(root.attributes('data-ai-intent')).toBe('navigate')
    expect(root.attributes('role')).toBe('button')
    expect(wrapper.get('img').attributes('src')).toBe('/logo.png')
    expect(wrapper.text()).toContain('智能去水印')
  })

  it('uses homeHref as a link and emits brandClick', async () => {
    const wrapper = mount(TitleBar, {
      props: { title: 'EraseLab', homeHref: '/' },
    })
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/')
    await link.trigger('click')
    expect(wrapper.emitted('brandClick')).toHaveLength(1)
  })

  it('suppresses context menu by default', () => {
    const wrapper = mount(TitleBar, { props: { title: 'EraseLab' } })
    const native = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    wrapper.element.dispatchEvent(native)
    expect(native.defaultPrevented).toBe(true)
  })

  it('supports #logo slot and mounts inside Navigation header', () => {
    const wrapper = mount(Navigation, {
      props: { label: 'Main', items: [{ value: 'home', label: 'Home' }] },
      slots: {
        header: {
          template: `<TitleBar title="EraseLab"><template #logo><span class="custom-logo">S</span></template></TitleBar>`,
          components: { TitleBar },
        },
      },
      global: { components: { TitleBar } },
    })
    expect(wrapper.find('.cu-navigation__header .cu-title-bar').exists()).toBe(true)
    expect(wrapper.find('.custom-logo').exists()).toBe(true)
  })
})
