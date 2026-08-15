import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ColorPicker from './ColorPicker.vue'

describe('ColorPicker', () => {
  it('renders data-ai-role color-picker', () => {
    const wrapper = mount(ColorPicker, {
      props: {
      value: "#2563eb",
      label: "Color",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('color-picker')
  })
})
