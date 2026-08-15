import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Container from './Container.vue'

describe('Container', () => {
  it('renders cu-container and data-ai-role', () => {
    const wrapper = mount(Container, {
      props: {
      
      },
      slots: { default: "Body" },
    })
    expect(wrapper.classes()).toContain('cu-container')
    expect(wrapper.attributes('data-ai-role')).toBe('container')
  })
})
