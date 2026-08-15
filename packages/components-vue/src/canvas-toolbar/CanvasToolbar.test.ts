import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CanvasToolbar from './CanvasToolbar.vue'

describe('CanvasToolbar', () => {
  it('renders cu-canvas-toolbar and data-ai-role', () => {
    const wrapper = mount(CanvasToolbar, {
      props: {
      label: "Canvas",
      zoomInLabel: "In",
      zoomOutLabel: "Out",
      resetLabel: "Reset",
      fitLabel: "Fit",
      },
    })
    expect(wrapper.classes()).toContain('cu-canvas-toolbar')
    expect(wrapper.attributes('data-ai-role')).toBe('canvas-toolbar')
  })
})
