import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tooltip from './Tooltip.vue'

describe('Tooltip', () => {
  it('renders a trigger slot', () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'More information', openDelay: 0, closeDelay: 0 },
      slots: { trigger: '<button type="button">Info</button>' },
    })

    expect(wrapper.find('button').text()).toBe('Info')
  })

  it('exposes data-ai attributes on the tooltip content when open', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'More information', defaultOpen: true, openDelay: 0, closeDelay: 0 },
      slots: { trigger: '<button type="button">Info</button>' },
      attachTo: document.body,
    })

    const content = document.querySelector('[data-ai-role="tooltip"]')
    expect(content).not.toBeNull()
    expect(content?.getAttribute('data-ai-state')).toBe('open')
    expect(content?.textContent).toContain('More information')
    wrapper.unmount()
  })
})
