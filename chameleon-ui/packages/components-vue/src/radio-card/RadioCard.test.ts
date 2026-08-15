import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RadioCard from './RadioCard.vue'

describe('RadioCard', () => {
  it('renders data-ai-role radio-card', () => {
    const wrapper = mount(RadioCard, {
      props: {
      options: ["A","B"],
      name: "plan",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('radio-card')
  })
})
