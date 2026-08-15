import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Carousel from './Carousel.vue'

describe('Carousel', () => {
  it('renders data-ai-role carousel', () => {
    const wrapper = mount(Carousel, {
      props: {
      items: ["A","B"],
      label: "Gallery",
      previousLabel: "Prev",
      nextLabel: "Next",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('carousel')
  })
})
