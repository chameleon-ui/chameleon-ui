import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Toast from './Toast.vue'
import ToastProvider from './ToastProvider.vue'
import { useToast } from './store'

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

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: {
        open: true,
        title: 'Saved',
        description: 'Changes saved',
        closeLabel: 'Close',
        duration: 1000,
      },
    })
    vi.advanceTimersByTime(1000)
    await flushPromises()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    vi.useRealTimers()
  })
})

describe('ToastProvider', () => {
  it('queues toasts through useToast', async () => {
    const Probe = defineComponent({
      setup() {
        const toast = useToast()
        return () =>
          h('button', { type: 'button', onClick: () => toast.push({ title: 'Queued', status: 'success' }) }, 'Notify')
      },
    })
    const wrapper = mount(ToastProvider, {
      slots: { default: () => h(Probe) },
    })
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('[role="status"]').text()).toContain('Queued')
    expect(wrapper.get('[role="status"]').classes()).toContain('cu-toast--success')
  })
})
