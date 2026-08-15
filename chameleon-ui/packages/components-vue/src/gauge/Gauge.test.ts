import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Gauge from './Gauge.vue'

describe('Gauge', () => {
  it('renders cu-gauge and data-ai-role', () => {
    const wrapper = mount(Gauge, {
      props: {
      value: 40,
      label: "CPU",
      },
    })
    expect(wrapper.classes()).toContain('cu-gauge')
    expect(wrapper.attributes('data-ai-role')).toBe('gauge')
  })
})
