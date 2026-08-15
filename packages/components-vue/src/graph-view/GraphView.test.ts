import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GraphView from './GraphView.vue'

describe('GraphView', () => {
  it('renders data-ai-role graph-view', () => {
    const wrapper = mount(GraphView, {
      props: {
      nodes: [{"id":"a","label":"A"}],
      links: [],
      label: "Graph",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('graph-view')
  })
})
