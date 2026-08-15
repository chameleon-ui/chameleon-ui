import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Kbd from './Kbd.vue'

describe('Kbd', () => {
  it('renders cu-kbd and data-ai-role', () => {
    const wrapper = mount(Kbd, {
      props: {
      
      },
      slots: { default: "⌘K" },
    })
    expect(wrapper.classes()).toContain('cu-kbd')
    expect(wrapper.attributes('data-ai-role')).toBe('kbd')
  })
})
