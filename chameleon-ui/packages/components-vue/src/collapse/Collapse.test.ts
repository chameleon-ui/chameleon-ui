import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Collapse from './Collapse.vue'

describe('Collapse', () => {
  it('renders cu-collapse and data-ai-role', () => {
    const wrapper = mount(Collapse, {
      props: {
      title: "More",
      },
      slots: { default: "Hidden" },
    })
    expect(wrapper.classes()).toContain('cu-collapse')
    expect(wrapper.attributes('data-ai-role')).toBe('collapse')
  })
})
