import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TimePicker from './TimePicker.vue'

describe('TimePicker', () => {
  it('renders data-ai-role time-picker', () => {
    const wrapper = mount(TimePicker, {
      props: {
      value: "09:30",
      label: "Time",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('time-picker')
  })
})
