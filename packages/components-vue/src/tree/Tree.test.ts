import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tree from './Tree.vue'

describe('Tree', () => {
  it('renders data-ai-role tree', () => {
    const wrapper = mount(Tree, {
      props: {
      nodes: [{"id":"1","label":"Root"}],
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('tree')
  })
})
