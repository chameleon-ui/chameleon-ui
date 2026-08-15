import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Calendar from './Calendar.vue'

describe('Calendar', () => {
  it('renders cu-calendar and data-ai-role', () => {
    const wrapper = mount(Calendar, { props: { label: 'Pick a day', value: '2024-01-15' } })
    expect(wrapper.classes()).toContain('cu-calendar')
    expect(wrapper.attributes('data-ai-role')).toBe('calendar')
    expect(wrapper.findAll('.cu-calendar__day').length).toBeGreaterThan(27)
  })
})
