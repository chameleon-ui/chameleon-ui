import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Toast from './Toast.vue'

describe('Toast', () => {
  it('displays a toast when open with data-ai attributes', () => {
    const wrapper = mount(Toast, {
      props: {
        open: true,
        title: 'Saved',
        description: 'Changes saved',
        closeLabel: 'Close',
      },
    })

    expect(wrapper.classes()).toContain('cu-toast')
    expect(wrapper.classes()).toContain('cu-toast--info')
    expect(wrapper.attributes('data-ai-role')).toBe('toast')
    expect(wrapper.attributes('data-ai-state')).toBe('info')
    expect(wrapper.text()).toContain('Changes saved')
  })

  it('emits close and hides when open is false', async () => {
    const wrapper = mount(Toast, {
      props: {
        open: true,
        title: 'Saved',
        description: 'Changes saved',
        closeLabel: 'Close',
      },
    })

    await wrapper.find('.cu-toast__close').trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])

    await wrapper.setProps({ open: false })
    expect(wrapper.find('.cu-toast').exists()).toBe(false)
  })
})
