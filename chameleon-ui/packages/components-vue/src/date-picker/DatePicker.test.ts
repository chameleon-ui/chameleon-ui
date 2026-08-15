import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DatePicker from './DatePicker.vue'

describe('DatePicker', () => {
  it('renders cu-date-picker and data-ai-role', () => {
    const wrapper = mount(DatePicker, { props: { value: '2024-01-15', label: 'Date' } })
    expect(wrapper.classes()).toContain('cu-date-picker')
    expect(wrapper.attributes('data-ai-role')).toBe('date-picker')
  })
})
