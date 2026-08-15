import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NumberInput from './NumberInput.vue'

describe('NumberInput', () => {
  it('renders data-ai-role number-input', () => {
    const wrapper = mount(NumberInput, {
      props: {
      value: 1,
      label: "Qty",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('number-input')
  })
})
