import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SafeArea from './SafeArea.vue'

describe('SafeArea', () => {
  it('renders cu-safe-area and data-ai-role', () => {
    const wrapper = mount(SafeArea, {
      props: {
      
      },
      slots: { default: "Page" },
    })
    expect(wrapper.classes()).toContain('cu-safe-area')
    expect(wrapper.attributes('data-ai-role')).toBe('safe-area')
  })
})
