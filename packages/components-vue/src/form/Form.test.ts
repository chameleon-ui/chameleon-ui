import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Form from './Form.vue'

describe('Form', () => {
  it('renders with data-ai attributes and a submit button', () => {
    const wrapper = mount(Form, {
      props: { submitLabel: 'Send' },
      slots: { default: '<input name="email" type="text" />' },
    })

    expect(wrapper.classes()).toContain('cu-form')
    expect(wrapper.attributes('data-ai-role')).toBe('form')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Send')
  })

  it('emits submit when the form is submitted', async () => {
    const wrapper = mount(Form, {
      props: { submitLabel: 'Send' },
    })

    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })
})
