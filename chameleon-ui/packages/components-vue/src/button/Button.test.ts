import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from './Button.vue'

describe('Button', () => {
  it('renders with cu-button classes and data-ai attributes', () => {
    const wrapper = mount(Button, {
      props: { variant: 'outline', size: 'sm', intent: 'submit' },
      slots: { default: 'Submit' },
    })

    expect(wrapper.classes()).toContain('cu-button')
    expect(wrapper.classes()).toContain('cu-button--outline')
    expect(wrapper.classes()).toContain('cu-button--sm')
    expect(wrapper.attributes('data-ai-role')).toBe('button')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.attributes('data-ai-intent')).toBe('submit')
    expect(wrapper.text()).toBe('Submit')
  })

  it('reflects disabled state in data-ai-state', () => {
    const wrapper = mount(Button, { props: { disabled: true } })

    expect(wrapper.attributes('data-ai-role')).toBe('button')
    expect(wrapper.attributes('data-ai-state')).toBe('disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
