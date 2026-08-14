import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tabs from './Tabs.vue'

const items = [
  { value: 'account', label: 'Account', content: 'Account content' },
  { value: 'security', label: 'Security', content: 'Security content' },
]

describe('Tabs', () => {
  it('renders tabs with data-ai attributes and default content', () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'account' },
    })

    expect(wrapper.classes()).toContain('cu-tabs')
    expect(wrapper.attributes('data-ai-role')).toBe('tabs')
    expect(wrapper.attributes('data-ai-state')).toBe('account')
    expect(wrapper.attributes('data-ai-intent')).toBe('switch-view')
    expect(wrapper.text()).toContain('Account')
    expect(wrapper.text()).toContain('Account content')
  })

  it('switches content when a trigger is clicked', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'account' },
    })

    const triggers = wrapper.findAll('.cu-tabs__trigger')
    await triggers[1].trigger('click')
    expect(wrapper.text()).toContain('Security content')
  })
})
