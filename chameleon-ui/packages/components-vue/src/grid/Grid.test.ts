import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Grid from './Grid.vue'

describe('Grid', () => {
  it('renders with cu-grid classes and data-ai attributes', () => {
    const wrapper = mount(Grid, {
      props: { columns: 2, gap: 'lg' },
      slots: { default: 'Item' },
    })

    expect(wrapper.classes()).toContain('cu-grid')
    expect(wrapper.classes()).toContain('cu-grid--gap-lg')
    expect(wrapper.attributes('data-ai-role')).toBe('grid')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.attributes('data-ai-intent')).toBe('layout-columns')
    expect(wrapper.attributes('style')).toContain('repeat(2, minmax(0, 1fr))')
  })

  it('defaults to a single column', () => {
    const wrapper = mount(Grid, { slots: { default: 'Item' } })

    expect(wrapper.classes()).toContain('cu-grid--gap-md')
    expect(wrapper.attributes('style')).toContain('repeat(1, minmax(0, 1fr))')
  })
})
