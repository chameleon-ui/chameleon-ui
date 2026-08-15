import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Typography from './Typography.vue'

describe('Typography', () => {
  it('renders the default body variant as a paragraph', () => {
    const wrapper = mount(Typography, { slots: { default: 'Hello' } })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('cu-typography--body')
    expect(wrapper.attributes('data-ai-role')).toBe('typography')
  })

  it('honours as and variant', () => {
    const wrapper = mount(Typography, {
      props: { variant: 'heading-1', as: 'h1' },
      slots: { default: 'Title' },
    })
    expect(wrapper.element.tagName).toBe('H1')
    expect(wrapper.classes()).toContain('cu-typography--heading-1')
  })
})
