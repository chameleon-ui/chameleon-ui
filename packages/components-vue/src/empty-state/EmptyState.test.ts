import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  it('renders title, description, and action slot', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Nothing yet', description: 'Create a project to start.' },
      slots: { action: '<button type="button">New</button>' },
    })
    expect(wrapper.classes()).toContain('cu-empty-state')
    expect(wrapper.attributes('data-ai-role')).toBe('empty-state')
    expect(wrapper.attributes('data-ai-intent')).toBe('prompt-first-action')
    expect(wrapper.get('.cu-empty-state__title').text()).toBe('Nothing yet')
    expect(wrapper.get('.cu-empty-state__description').text()).toBe('Create a project to start.')
    expect(wrapper.find('.cu-empty-state__action button').exists()).toBe(true)
  })
})
