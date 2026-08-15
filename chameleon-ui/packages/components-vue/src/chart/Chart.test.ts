import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Chart from './Chart.vue'

describe('Chart', () => {
  it('renders cu-chart and data-ai-role', () => {
    const wrapper = mount(Chart, {
      props: { label: 'Revenue', series: [{ name: 'A', data: [1, 2, 3] }] },
    })
    expect(wrapper.classes()).toContain('cu-chart')
    expect(wrapper.attributes('data-ai-role')).toBe('chart')
  })
})
