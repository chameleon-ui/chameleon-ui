import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Stack from './Stack.vue'

describe('Stack', () => {
  it('renders a flex container with direction and gap data attributes', () => {
    const wrapper = mount(Stack, {
      props: { direction: 'row', gap: '3' },
      slots: { default: '<span>One</span><span>Two</span>' },
    })

    expect(wrapper.classes()).toContain('cu-stack')
    expect(wrapper.classes()).toContain('cu-stack--row')
    expect(wrapper.classes()).toContain('cu-stack--gap-3')
    expect(wrapper.attributes('data-ai-role')).toBe('stack')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.attributes('data-direction')).toBe('row')
  })

  it('defaults to a column stack', () => {
    const wrapper = mount(Stack, { slots: { default: 'Item' } })

    expect(wrapper.classes()).toContain('cu-stack--column')
    expect(wrapper.attributes('data-ai-intent')).toBe('layout-flow')
  })
})
