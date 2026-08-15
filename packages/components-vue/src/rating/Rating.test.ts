import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Rating from './Rating.vue'

describe('Rating', () => {
  it('renders data-ai-role rating', () => {
    const wrapper = mount(Rating, {
      props: {
      value: 3,
      label: "Score",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('rating')
  })
})
