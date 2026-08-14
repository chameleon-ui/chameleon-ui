import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Popover from './Popover.vue'

describe('Popover', () => {
  it('opens from the trigger and exposes data-ai attributes', async () => {
    const wrapper = mount(Popover, {
      props: {
        title: 'Filters',
        description: 'Filter the list.',
        closeLabel: 'Close',
      },
      slots: { trigger: '<button type="button">Open</button>' },
      attachTo: document.body,
    })

    await wrapper.find('button').trigger('click')
    const content = document.querySelector('[data-ai-role="popover"]')
    expect(content).not.toBeNull()
    expect(content?.getAttribute('data-ai-state')).toBe('open')
    expect(content?.textContent).toContain('Filters')
    wrapper.unmount()
  })

  it('renders the trigger slot', () => {
    const wrapper = mount(Popover, {
      props: {
        title: 'Filters',
        description: 'Filter the list.',
        closeLabel: 'Close',
      },
      slots: { trigger: '<button type="button">Open</button>' },
    })

    expect(wrapper.find('button').text()).toBe('Open')
  })
})
