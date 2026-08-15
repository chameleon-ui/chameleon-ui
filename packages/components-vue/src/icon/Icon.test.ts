import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Icon from './Icon.vue'

describe('Icon', () => {
  it('renders cu-icon and data-ai-role', () => {
    const wrapper = mount(Icon, {
      props: {
      label: "Back",
      },
    })
    expect(wrapper.classes()).toContain('cu-icon')
    expect(wrapper.attributes('data-ai-role')).toBe('icon')
  })
})
