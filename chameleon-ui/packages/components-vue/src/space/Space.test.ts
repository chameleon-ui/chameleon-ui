import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Space from './Space.vue'

describe('Space', () => {
  it('renders cu-space and data-ai-role', () => {
    const wrapper = mount(Space, {
      props: {
      
      },
    })
    expect(wrapper.classes()).toContain('cu-space')
    expect(wrapper.attributes('data-ai-role')).toBe('space')
  })
})
