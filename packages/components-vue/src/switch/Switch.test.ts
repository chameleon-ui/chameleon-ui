import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Switch from './Switch.vue'

describe('Switch', () => {
  it('renders with cu-switch classes and data-ai attributes', () => {
    const wrapper = mount(Switch, {
      props: { label: 'Airplane mode', modelValue: true },
    })

    expect(wrapper.classes()).toContain('cu-switch')
    expect(wrapper.attributes('data-ai-role')).toBe('switch')
    expect(wrapper.attributes('data-ai-state')).toBe('checked')
    expect(wrapper.attributes('data-ai-intent')).toBe('toggle-setting')
    expect(wrapper.text()).toContain('Airplane mode')
  })

  it('reflects disabled state in data-ai-state', () => {
    const wrapper = mount(Switch, {
      props: { label: 'Notifications', disabled: true, modelValue: false },
    })

    expect(wrapper.attributes('data-ai-role')).toBe('switch')
    expect(wrapper.attributes('data-ai-state')).toBe('disabled')
  })
})
