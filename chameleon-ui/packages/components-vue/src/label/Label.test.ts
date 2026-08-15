import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Label from './Label.vue'

describe('Label', () => {
  it('renders cu-label and data-ai-role', () => {
    const wrapper = mount(Label, {
      props: {
      
      },
      slots: { default: "Email" },
    })
    expect(wrapper.classes()).toContain('cu-label')
    expect(wrapper.attributes('data-ai-role')).toBe('label')
  })
})
