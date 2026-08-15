import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tag from './Tag.vue'

describe('Tag', () => {
  it('renders cu-tag and data-ai-role', () => {
    const wrapper = mount(Tag, {
      props: {
      label: "Beta",
      },
    })
    expect(wrapper.classes()).toContain('cu-tag')
    expect(wrapper.attributes('data-ai-role')).toBe('tag')
  })
})
