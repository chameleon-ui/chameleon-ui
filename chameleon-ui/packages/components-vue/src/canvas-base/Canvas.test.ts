import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Canvas from './Canvas.vue'

describe('Canvas', () => {
  it('renders cu-canvas and data-ai-role', () => {
    const wrapper = mount(Canvas, { props: { label: 'Board' } })
    expect(wrapper.classes()).toContain('cu-canvas')
    expect(wrapper.attributes('data-ai-role')).toBe('canvas-base')
  })
})
