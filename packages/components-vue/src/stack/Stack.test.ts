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
    expect(wrapper.classes()).toContain('cu-stack--align-stretch')
    expect(wrapper.classes()).toContain('cu-stack--justify-start')
    expect(wrapper.attributes('data-ai-role')).toBe('stack')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.attributes('data-direction')).toBe('row')
  })

  it('applies align start as a real class (not stuck on stretch)', () => {
    const wrapper = mount(Stack, {
      props: { align: 'start', justify: 'between' },
      slots: { default: 'Item' },
    })

    expect(wrapper.classes()).toContain('cu-stack--align-start')
    expect(wrapper.classes()).toContain('cu-stack--justify-between')
    expect(wrapper.classes()).not.toContain('cu-stack--align-stretch')
    expect(wrapper.attributes('data-align')).toBe('start')
  })

  it('grows when grow is set', () => {
    const wrapper = mount(Stack, {
      props: { grow: true },
      slots: { default: 'Pane' },
    })

    expect(wrapper.classes()).toContain('cu-stack--grow')
    expect(wrapper.attributes('data-grow')).toBe('true')
  })

  it('defaults to a column stack', () => {
    const wrapper = mount(Stack, { slots: { default: 'Item' } })

    expect(wrapper.classes()).toContain('cu-stack--column')
    expect(wrapper.attributes('data-ai-intent')).toBe('layout-flow')
  })
})
