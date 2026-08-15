import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Statistic from './Statistic.vue'

describe('Statistic', () => {
  it('renders cu-statistic and data-ai-role', () => {
    const wrapper = mount(Statistic, {
      props: {
      label: "Users",
      value: "12",
      },
    })
    expect(wrapper.classes()).toContain('cu-statistic')
    expect(wrapper.attributes('data-ai-role')).toBe('statistic')
  })
})
