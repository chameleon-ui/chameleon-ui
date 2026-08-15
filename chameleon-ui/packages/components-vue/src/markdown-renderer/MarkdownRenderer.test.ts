import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MarkdownRenderer from './MarkdownRenderer.vue'

describe('MarkdownRenderer', () => {
  it('renders headings and emphasis', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { markdown: '# Title\n\nHello **world**' },
    })
    expect(wrapper.classes()).toContain('cu-markdown-renderer')
    expect(wrapper.attributes('data-ai-role')).toBe('markdown-renderer')
    expect(wrapper.find('h2').text()).toBe('Title')
    expect(wrapper.find('strong').text()).toBe('world')
  })
})
