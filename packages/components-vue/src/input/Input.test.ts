import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from './Input.vue'

describe('Input', () => {
  it('renders label, input, and data-ai attributes', () => {
    const wrapper = mount(Input, {
      props: { label: 'Project name', id: 'project', modelValue: 'alpha' },
    })

    expect(wrapper.find('label').text()).toBe('Project name')
    const input = wrapper.find('input')
    expect(input.classes()).toContain('cu-input')
    expect(input.attributes('id')).toBe('project')
    expect(input.element.value).toBe('alpha')
    expect(wrapper.attributes('data-ai-role')).toBe('input')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
  })

  it('shows invalid state and error message', () => {
    const wrapper = mount(Input, {
      props: { label: 'Email', invalid: true, errorMessage: 'Invalid email' },
    })

    expect(wrapper.attributes('data-ai-role')).toBe('input')
    expect(wrapper.attributes('data-ai-state')).toBe('invalid')
    expect(wrapper.find('.cu-field__error').text()).toBe('Invalid email')
  })
})
