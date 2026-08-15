import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Menu from './Menu.vue'

describe('Menu', () => {
  it('renders data-ai-role menu', () => {
    const wrapper = mount(Menu, {
      props: {
      triggerLabel: "Open",
      items: [],
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('menu')
  })
})
