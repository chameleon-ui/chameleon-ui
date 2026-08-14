import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Spinner from './Spinner.vue'

describe('Spinner', () => {
  it('renders a status region with size classes and a default label', () => {
    const wrapper = mount(Spinner)

    expect(wrapper.classes()).toContain('cu-spinner')
    expect(wrapper.classes()).toContain('cu-spinner--md')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
    expect(wrapper.attributes('data-ai-role')).toBe('spinner')
    expect(wrapper.attributes('data-ai-state')).toBe('loading')
  })

  it('supports a custom label and size', () => {
    const wrapper = mount(Spinner, { props: { label: 'Saving', size: 'lg' } })

    expect(wrapper.classes()).toContain('cu-spinner--lg')
    expect(wrapper.attributes('aria-label')).toBe('Saving')
    expect(wrapper.attributes('data-ai-intent')).toBe('indicate-busy')
  })
})
