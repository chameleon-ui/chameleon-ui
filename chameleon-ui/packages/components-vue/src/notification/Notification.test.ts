import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Notification from './Notification.vue'

describe('Notification', () => {
  it('renders cu-notification and data-ai-role', () => {
    const wrapper = mount(Notification, {
      props: {
      title: "Saved",
      message: "Draft stored",
      },
    })
    expect(wrapper.classes()).toContain('cu-notification')
    expect(wrapper.attributes('data-ai-role')).toBe('notification')
  })
})
