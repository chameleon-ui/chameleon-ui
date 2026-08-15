import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MultiSelect from './MultiSelect.vue'

describe('MultiSelect', () => {
  it('renders data-ai-role multi-select', () => {
    const wrapper = mount(MultiSelect, {
      props: {
      options: [{"value":"a","label":"A"}],
      values: [],
      label: "Tags",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('multi-select')
  })
})
