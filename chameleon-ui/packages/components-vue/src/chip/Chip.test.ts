import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Chip from './Chip.vue'

describe('Chip', () => {
  it('renders cu-chip and data-ai-role', () => {
    const wrapper = mount(Chip, {
      props: {
      
      },
      slots: { default: "Filter" },
    })
    expect(wrapper.classes()).toContain('cu-chip')
    expect(wrapper.attributes('data-ai-role')).toBe('chip')
  })
})
