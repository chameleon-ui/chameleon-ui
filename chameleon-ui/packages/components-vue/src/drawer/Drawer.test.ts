import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Drawer from './Drawer.vue'

describe('Drawer', () => {
  it('opens from the trigger and exposes data-ai-role', async () => {
    const wrapper = mount(Drawer, {
      props: { triggerLabel: 'Open', title: 'Drawer', closeLabel: 'Close', open: true },
      attachTo: document.body,
    })
    const content = document.querySelector('[data-ai-role="drawer"]')
    expect(content).not.toBeNull()
    expect(content?.getAttribute('data-ai-intent')).toBe('reveal-detail')
    wrapper.unmount()
  })
})
