import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Image from './Image.vue'

describe('Image', () => {
  it('renders cu-image and data-ai-role', () => {
    const wrapper = mount(Image, {
      props: {
      src: "/x.png",
      alt: "Chart",
      },
    })
    expect(wrapper.classes()).toContain('cu-image')
    expect(wrapper.attributes('data-ai-role')).toBe('image')
  })
})
