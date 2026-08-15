import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MindMap from './MindMap.vue'

describe('MindMap', () => {
  it('renders data-ai-role mind-map', () => {
    const wrapper = mount(MindMap, {
      props: {
      root: {"id":"root","label":"Idea"},
      label: "Map",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('mind-map')
  })
})
