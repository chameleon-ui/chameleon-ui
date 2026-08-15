import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Timeline from './Timeline.vue'

describe('Timeline', () => {
  it('renders cu-timeline and data-ai-role', () => {
    const wrapper = mount(Timeline, {
      props: {
      items: [{"id":"1","title":"Shipped"}],
      },
    })
    expect(wrapper.classes()).toContain('cu-timeline')
    expect(wrapper.attributes('data-ai-role')).toBe('timeline')
  })
})
