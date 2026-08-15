import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PipelineView from './PipelineView.vue'

describe('PipelineView', () => {
  it('renders cu-pipeline-view and data-ai-role', () => {
    const wrapper = mount(PipelineView, {
      props: {
      stages: [{"id":"1","name":"Build","status":"success"}],
      label: "CI",
      },
    })
    expect(wrapper.classes()).toContain('cu-pipeline-view')
    expect(wrapper.attributes('data-ai-role')).toBe('pipeline-view')
  })
})
