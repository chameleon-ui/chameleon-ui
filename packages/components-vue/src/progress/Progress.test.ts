import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Progress from './Progress.vue'

describe('Progress', () => {
  it('renders with cu-progress classes and data-ai attributes', () => {
    const wrapper = mount(Progress, { props: { value: 50 } })

    expect(wrapper.classes()).toContain('cu-progress')
    expect(wrapper.attributes('data-ai-role')).toBe('progress')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.attributes('data-ai-intent')).toBe('show-progress')
    expect(wrapper.attributes('value')).toBe('50')
  })

  it('supports a small size and custom max', () => {
    const wrapper = mount(Progress, { props: { value: 2, max: 5, size: 'sm' } })

    expect(wrapper.classes()).toContain('cu-progress--sm')
    expect(wrapper.attributes('max')).toBe('5')
  })
})
