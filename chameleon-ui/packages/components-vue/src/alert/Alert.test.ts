import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Alert from './Alert.vue'

describe('Alert', () => {
  it('renders a status alert with title, description, and data-ai attributes', () => {
    const wrapper = mount(Alert, {
      props: { status: 'success', title: 'Success', description: 'Profile updated' },
    })

    expect(wrapper.classes()).toContain('cu-alert')
    expect(wrapper.classes()).toContain('cu-alert--success')
    expect(wrapper.attributes('data-ai-role')).toBe('alert')
    expect(wrapper.attributes('data-ai-state')).toBe('success')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toContain('Success')
    expect(wrapper.text()).toContain('Profile updated')
  })

  it('uses an alert role for errors', () => {
    const wrapper = mount(Alert, {
      props: { status: 'error', title: 'Error', description: 'Request failed' },
    })

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.attributes('data-ai-state')).toBe('error')
  })
})
