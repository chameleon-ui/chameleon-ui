import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Link from './Link.vue'

describe('Link', () => {
  it('renders cu-link and data-ai-role', () => {
    const wrapper = mount(Link, {
      props: {
      href: "/docs",
      },
      slots: { default: "Docs" },
    })
    expect(wrapper.classes()).toContain('cu-link')
    expect(wrapper.attributes('data-ai-role')).toBe('link')
  })
})
