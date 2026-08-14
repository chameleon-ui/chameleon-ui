import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Radio from './Radio.vue'

const options = [
  { value: 'card', label: 'Credit card' },
  { value: 'bank', label: 'Bank transfer' },
]

describe('Radio', () => {
  it('renders options with cu-radio classes and data-ai attributes', () => {
    const wrapper = mount(Radio, {
      props: { label: 'Payment', options, modelValue: 'card' },
    })

    expect(wrapper.classes()).toContain('cu-radio')
    expect(wrapper.attributes('data-ai-role')).toBe('radio')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.attributes('data-ai-intent')).toBe('select-single')
    expect(wrapper.text()).toContain('Credit card')
    expect(wrapper.findAll('.cu-radio__item')).toHaveLength(2)
  })

  it('reflects disabled state in data-ai-state', () => {
    const wrapper = mount(Radio, {
      props: { label: 'Payment', options, disabled: true },
    })

    expect(wrapper.attributes('data-ai-role')).toBe('radio')
    expect(wrapper.attributes('data-ai-state')).toBe('disabled')
  })
})
