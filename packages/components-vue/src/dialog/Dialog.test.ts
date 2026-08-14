import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Dialog from './Dialog.vue'

describe('Dialog', () => {
  it('opens from the trigger and exposes data-ai attributes on content', async () => {
    const wrapper = mount(Dialog, {
      props: {
        triggerLabel: 'Open',
        title: 'Confirm',
        description: 'Please confirm this action.',
        closeLabel: 'Close',
      },
      attachTo: document.body,
    })

    await wrapper.find('.cu-dialog__trigger').trigger('click')
    const content = document.querySelector('.cu-dialog__content')
    expect(content).not.toBeNull()
    expect(content?.getAttribute('data-ai-role')).toBe('dialog')
    expect(content?.getAttribute('data-ai-state')).toBe('open')
    expect(content?.getAttribute('data-ai-intent')).toBe('confirm-decision')
    expect(content?.textContent).toContain('Confirm')
    wrapper.unmount()
  })

  it('renders the trigger with button classes', () => {
    const wrapper = mount(Dialog, {
      props: {
        triggerLabel: 'Open',
        title: 'Title',
        description: 'Description',
        closeLabel: 'Close',
      },
    })

    const trigger = wrapper.find('.cu-dialog__trigger')
    expect(trigger.classes()).toContain('cu-button')
    expect(trigger.text()).toBe('Open')
  })
})
