import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Divider from './Divider.vue'

describe('Divider', () => {
  it('renders cu-divider and data-ai-role', () => {
    const wrapper = mount(Divider, {
      props: {
      
      },
    })
    expect(wrapper.classes()).toContain('cu-divider')
    expect(wrapper.attributes('data-ai-role')).toBe('divider')
  })
})
