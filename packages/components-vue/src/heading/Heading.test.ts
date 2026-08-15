import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Heading from './Heading.vue'

describe('Heading', () => {
  it('defaults to level-2 as h2', () => {
    const wrapper = mount(Heading, { slots: { default: 'Section' } })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('cu-heading--level-2')
    expect(wrapper.attributes('data-ai-role')).toBe('heading')
  })

  it('maps level-1 to h1', () => {
    const wrapper = mount(Heading, { props: { level: 'level-1' }, slots: { default: 'Page' } })
    expect(wrapper.element.tagName).toBe('H1')
    expect(wrapper.attributes('data-ai-state')).toBe('level-1')
  })
})
