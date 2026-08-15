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

  it('defaults data-ai-intent to submit like React', () => {
    const wrapper = mount(Button, { slots: { default: 'OK' } })
    expect(wrapper.attributes('data-ai-intent')).toBe('submit')
    expect(wrapper.text()).toBe('OK')
  })

  it('reflects disabled state in data-ai-state', () => {
    const wrapper = mount(Button, { props: { disabled: true } })

    expect(wrapper.attributes('data-ai-role')).toBe('button')
    expect(wrapper.attributes('data-ai-state')).toBe('disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('blocks interaction and marks loading state', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: 'Save' },
    })

    expect(wrapper.attributes('data-ai-state')).toBe('loading')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.cu-button__spinner').exists()).toBe(true)
  })

  it('applies danger tone and ghost variant', () => {
    const wrapper = mount(Button, {
      props: { tone: 'danger', variant: 'ghost' },
      slots: { default: 'Delete' },
    })

    expect(wrapper.classes()).toContain('cu-button--ghost')
    expect(wrapper.classes()).toContain('cu-button--tone-danger')
    expect(wrapper.attributes('data-tone')).toBe('danger')
  })
})
