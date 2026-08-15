import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Slider from './Slider.vue'

describe('Slider', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    const wrapper = mount(Slider, { props: { value: 50 } })
    expect(wrapper.classes()).toContain('cu-slider')
    expect(wrapper.attributes('data-ai-role')).toBe('slider')
  })

  it('honours step and reports the snapped value', async () => {
    const wrapper = mount(Slider, { props: { max: 100, min: 0, step: 10, value: 20 } })
    await wrapper.get('input[type="range"]').setValue('40')
    expect(wrapper.emitted('change')?.[0]).toEqual([40])
  })

  it('renders a dual-thumb range pair', async () => {
    const wrapper = mount(Slider, { props: { label: 'Price', value: [20, 80] } })
    const sliders = wrapper.findAll('input[type="range"]')
    expect(sliders).toHaveLength(2)
    expect(wrapper.attributes('data-ai-state')).toBe('range')
    await sliders[0].setValue('30')
    expect(wrapper.emitted('change')?.[0]).toEqual([[30, 80]])
  })

  it('renders mark labels', () => {
    const wrapper = mount(Slider, { props: { marks: [0, 50, 100], value: 50 } })
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('50')
    expect(wrapper.text()).toContain('100')
  })
})
