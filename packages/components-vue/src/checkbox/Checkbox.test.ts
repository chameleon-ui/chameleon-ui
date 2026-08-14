import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Checkbox from './Checkbox.vue'

describe('Checkbox', () => {
  it('renders with cu-checkbox classes and data-ai attributes', () => {
    const wrapper = mount(Checkbox, {
      props: { label: 'Subscribe', modelValue: true },
    })

    expect(wrapper.classes()).toContain('cu-checkbox')
    expect(wrapper.attributes('data-ai-role')).toBe('checkbox')
    expect(wrapper.attributes('data-ai-state')).toBe('checked')
    expect(wrapper.attributes('data-ai-intent')).toBe('toggle-option')
    expect(wrapper.text()).toContain('Subscribe')
  })

  it('reflects disabled state in data-ai-state', () => {
    const wrapper = mount(Checkbox, {
      props: { label: 'Agree', disabled: true, modelValue: false },
    })

    expect(wrapper.attributes('data-ai-role')).toBe('checkbox')
    expect(wrapper.attributes('data-ai-state')).toBe('disabled')
  })
})
