import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InlineAlert from './InlineAlert.vue'

describe('InlineAlert', () => {
  it('renders cu-inline-alert and data-ai-role', () => {
    const wrapper = mount(InlineAlert, {
      props: {
      
      },
      slots: { default: "Required" },
    })
    expect(wrapper.classes()).toContain('cu-inline-alert')
    expect(wrapper.attributes('data-ai-role')).toBe('inline-alert')
  })
})
