import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  it('renders a fallback avatar with data-ai attributes', () => {
    const wrapper = mount(Avatar, {
      props: { fallback: 'AB', size: 'lg' },
    })

    expect(wrapper.classes()).toContain('cu-avatar')
    expect(wrapper.classes()).toContain('cu-avatar--lg')
    expect(wrapper.attributes('data-ai-role')).toBe('avatar')
    expect(wrapper.attributes('data-ai-state')).toBe('fallback')
    expect(wrapper.text()).toBe('AB')
  })

  it('renders an image avatar when src is provided', () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/a.png', alt: 'Ada', fallback: 'A' },
    })

    expect(wrapper.element.tagName).toBe('IMG')
    expect(wrapper.attributes('data-ai-state')).toBe('image')
    expect(wrapper.attributes('alt')).toBe('Ada')
  })
})
