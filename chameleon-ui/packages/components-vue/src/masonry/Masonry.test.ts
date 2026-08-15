import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Masonry from './Masonry.vue'

describe('Masonry', () => {
  it('renders cu-masonry and data-ai-role', () => {
    const wrapper = mount(Masonry, {
      props: {
      
      },
      slots: { default: "Tile" },
    })
    expect(wrapper.classes()).toContain('cu-masonry')
    expect(wrapper.attributes('data-ai-role')).toBe('masonry')
  })
})
