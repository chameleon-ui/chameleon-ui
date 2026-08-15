import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Editor from './Editor.vue'

describe('Editor', () => {
  it('renders cu-editor and data-ai-role', () => {
    const wrapper = mount(Editor, { props: { label: 'Notes' } })
    expect(wrapper.classes()).toContain('cu-editor')
    expect(wrapper.attributes('data-ai-role')).toBe('editor')
  })
})
