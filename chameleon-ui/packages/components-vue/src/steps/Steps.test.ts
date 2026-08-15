import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Steps from './Steps.vue'

describe('Steps', () => {
  it('renders cu-steps and data-ai-role', () => {
    const wrapper = mount(Steps, {
      props: {
      items: [{"value":"a","label":"One"}],
      currentValue: "a",
      label: "Progress",
      },
    })
    expect(wrapper.classes()).toContain('cu-steps')
    expect(wrapper.attributes('data-ai-role')).toBe('steps')
  })
})
