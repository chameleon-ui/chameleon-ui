import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Heatmap from './Heatmap.vue'

describe('Heatmap', () => {
  it('renders data-ai-role heatmap', () => {
    const wrapper = mount(Heatmap, {
      props: {
      rows: ["A"],
      columns: ["1"],
      values: [[2]],
      label: "Heat",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('heatmap')
  })
})
