import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TabBar from './TabBar.vue'

describe('TabBar', () => {
  it('renders data-ai-role tab-bar', () => {
    const wrapper = mount(TabBar, {
      props: {
      label: "Tabs",
      items: [{"value":"home","label":"Home"}],
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('tab-bar')
  })
})
