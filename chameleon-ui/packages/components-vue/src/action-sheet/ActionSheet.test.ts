import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ActionSheet from './ActionSheet.vue'

describe('ActionSheet', () => {
  it('opens and exposes data-ai-role', async () => {
    const wrapper = mount(ActionSheet, {
      props: {
        triggerLabel: 'More',
        title: 'Actions',
        cancelLabel: 'Cancel',
        actions: [{ value: 'edit', label: 'Edit' }],
        open: true,
      },
      attachTo: document.body,
    })
    const content = document.querySelector('[data-ai-role="action-sheet"]')
    expect(content).not.toBeNull()
    expect(content?.getAttribute('data-ai-intent')).toBe('choose-action')
    wrapper.unmount()
  })
})
