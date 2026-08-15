import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Accordion from './Accordion.vue'

describe('Accordion', () => {
  it('renders cu-accordion and data-ai-role', () => {
    const wrapper = mount(Accordion, {
      props: {
      items: [{"title":"A","content":"One"}],
      },
    })
    expect(wrapper.classes()).toContain('cu-accordion')
    expect(wrapper.attributes('data-ai-role')).toBe('accordion')
  })
})
