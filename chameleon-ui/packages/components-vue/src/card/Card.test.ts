import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Card from './Card.vue'

describe('Card', () => {
  it('renders with cu-card classes and data-ai attributes', () => {
    const wrapper = mount(Card, {
      props: { variant: 'outlined', padding: 'lg' },
      slots: { default: 'Content' },
    })

    expect(wrapper.classes()).toContain('cu-card')
    expect(wrapper.classes()).toContain('cu-card--outlined')
    expect(wrapper.classes()).toContain('cu-card--padding-lg')
    expect(wrapper.attributes('data-ai-role')).toBe('card')
    expect(wrapper.attributes('data-ai-state')).toBe('outlined')
    expect(wrapper.attributes('data-ai-intent')).toBe('group-content')
    expect(wrapper.text()).toBe('Content')
  })

  it('defaults to the default variant', () => {
    const wrapper = mount(Card, { slots: { default: 'Body' } })

    expect(wrapper.classes()).toContain('cu-card--default')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
  })
})
