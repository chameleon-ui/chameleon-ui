import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import List from './List.vue'

describe('List', () => {
  it('renders cu-list and data-ai-role', () => {
    const wrapper = mount(List, {
      props: {
      items: ["One","Two"],
      },
    })
    expect(wrapper.classes()).toContain('cu-list')
    expect(wrapper.attributes('data-ai-role')).toBe('list')
  })
})
