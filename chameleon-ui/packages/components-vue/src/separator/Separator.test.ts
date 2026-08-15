import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Separator from './Separator.vue'

describe('Separator', () => {
  it('renders cu-separator and data-ai-role', () => {
    const wrapper = mount(Separator, {
      props: {
      
      },
    })
    expect(wrapper.classes()).toContain('cu-separator')
    expect(wrapper.attributes('data-ai-role')).toBe('separator')
  })
})
