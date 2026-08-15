import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Sheet from './Sheet.vue'

describe('Sheet', () => {
  it('opens from the trigger and exposes data-ai-role', async () => {
    const wrapper = mount(Sheet, {
      props: { triggerLabel: 'Open', title: 'Sheet', closeLabel: 'Close', open: true },
      attachTo: document.body,
    })
    const content = document.querySelector('[data-ai-role="sheet"]')
    expect(content).not.toBeNull()
    expect(content?.getAttribute('data-ai-intent')).toBe('present-overlay')
    wrapper.unmount()
  })
})
