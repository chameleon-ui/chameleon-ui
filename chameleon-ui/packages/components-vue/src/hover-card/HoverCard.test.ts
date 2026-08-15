import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HoverCard from './HoverCard.vue'

describe('HoverCard', () => {
  it('renders data-ai-role hover-card', () => {
    const wrapper = mount(HoverCard, {
      props: {
      
      },
      slots: { default: "Preview" },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('hover-card')
  })
})
