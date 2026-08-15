import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ConfirmDialog from './ConfirmDialog.vue'

describe('ConfirmDialog', () => {
  it('opens from the trigger and exposes data-ai-role', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        triggerLabel: 'Delete',
        title: 'Sure?',
        description: 'Cannot undo',
        confirmLabel: 'Yes',
        cancelLabel: 'No',
      },
      attachTo: document.body,
    })
    await wrapper.find('.cu-confirm-dialog__trigger').trigger('click')
    const content = document.querySelector('[data-ai-role="confirm-dialog"]')
    expect(content).not.toBeNull()
    expect(content?.getAttribute('data-ai-intent')).toBe('confirm-decision')
    wrapper.unmount()
  })
})
