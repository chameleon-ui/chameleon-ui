import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Result from './Result.vue'

describe('Result', () => {
  it('renders cu-result and data-ai-role', () => {
    const wrapper = mount(Result, {
      props: {
      title: "Saved",
      },
    })
    expect(wrapper.classes()).toContain('cu-result')
    expect(wrapper.attributes('data-ai-role')).toBe('result')
  })
})
