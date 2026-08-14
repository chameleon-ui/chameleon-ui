import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Badge from './Badge.vue'

describe('Badge', () => {
  it('renders with cu-badge classes and data-ai attributes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'primary', size: 'sm' },
      slots: { default: 'New' },
    })

    expect(wrapper.classes()).toContain('cu-badge')
    expect(wrapper.classes()).toContain('cu-badge--primary')
    expect(wrapper.classes()).toContain('cu-badge--sm')
    expect(wrapper.attributes('data-ai-role')).toBe('badge')
    expect(wrapper.attributes('data-ai-state')).toBe('primary')
    expect(wrapper.text()).toBe('New')
  })

  it('defaults to the default variant', () => {
    const wrapper = mount(Badge, { slots: { default: 'Label' } })

    expect(wrapper.classes()).toContain('cu-badge--default')
    expect(wrapper.attributes('data-ai-intent')).toBe('flag-status')
  })
})
