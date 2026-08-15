import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Sparkline from './Sparkline.vue'

describe('Sparkline', () => {
  it('renders data-ai-role sparkline', () => {
    const wrapper = mount(Sparkline, {
      props: {
      data: [1,3,2],
      label: "Trend",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('sparkline')
  })
})
