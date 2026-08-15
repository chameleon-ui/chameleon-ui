import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FlowNode from './FlowNode.vue'

describe('FlowNode', () => {
  it('renders cu-flow-node and data-ai-role', () => {
    const wrapper = mount(FlowNode, {
      props: {
      id: "n1",
      x: 0,
      y: 0,
      title: "Start",
      },
    })
    expect(wrapper.classes()).toContain('cu-flow-node')
    expect(wrapper.attributes('data-ai-role')).toBe('flow-node')
  })
})
