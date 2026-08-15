import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  it('renders cu-skeleton and data-ai-role', () => {
    const wrapper = mount(Skeleton, {
      props: {
      
      },
    })
    expect(wrapper.classes()).toContain('cu-skeleton')
    expect(wrapper.attributes('data-ai-role')).toBe('skeleton')
  })
})
