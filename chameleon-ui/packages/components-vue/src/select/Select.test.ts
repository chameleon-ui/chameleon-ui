import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Select from './Select.vue'

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
]

describe('Select', () => {
  it('renders with cu-select classes and data-ai attributes', () => {
    const wrapper = mount(Select, {
      props: { label: 'Number', options, modelValue: 'one' },
      attachTo: document.body,
    })

    expect(wrapper.classes()).toContain('cu-select')
    expect(wrapper.attributes('data-ai-role')).toBe('select')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.attributes('data-ai-intent')).toBe('choose-option')
    expect(wrapper.find('.cu-select__label').text()).toBe('Number')
    wrapper.unmount()
  })

  it('reflects disabled state in data-ai-state', () => {
    const wrapper = mount(Select, {
      props: { label: 'Number', options, disabled: true },
    })

    expect(wrapper.attributes('data-ai-role')).toBe('select')
    expect(wrapper.attributes('data-ai-state')).toBe('disabled')
  })
})
