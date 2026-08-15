import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Edge from './Edge.vue'

describe('Edge', () => {
  it('renders cu-edge and data-ai-role', () => {
    const wrapper = mount(Edge, {
      props: {
      x1: 0,
      y1: 0,
      x2: 40,
      y2: 20,
      },
    })
    expect(wrapper.classes()).toContain('cu-edge')
    expect(wrapper.attributes('data-ai-role')).toBe('edge')
  })
})
