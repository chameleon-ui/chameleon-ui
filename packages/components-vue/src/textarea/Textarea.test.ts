import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Textarea from './Textarea.vue'

describe('Textarea', () => {
  it('renders label, textarea, and data-ai attributes', () => {
    const wrapper = mount(Textarea, {
      props: { label: 'Message', id: 'message', modelValue: 'hello' },
    })

    expect(wrapper.find('label').text()).toBe('Message')
    const textarea = wrapper.find('textarea')
    expect(textarea.classes()).toContain('cu-textarea')
    expect(textarea.element.value).toBe('hello')
    expect(wrapper.attributes('data-ai-role')).toBe('textarea')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.attributes('data-ai-intent')).toBe('enter-long-text')
  })

  it('shows invalid state and error message', () => {
    const wrapper = mount(Textarea, {
      props: { label: 'Message', invalid: true, errorMessage: 'Too short' },
    })

    expect(wrapper.attributes('data-ai-role')).toBe('textarea')
    expect(wrapper.attributes('data-ai-state')).toBe('invalid')
    expect(wrapper.find('.cu-field__error').text()).toBe('Too short')
  })
})
