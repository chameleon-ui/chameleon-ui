import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FileInput from './FileInput.vue'

describe('FileInput', () => {
  it('renders cu-file-input and data-ai-role', () => {
    const wrapper = mount(FileInput, {
      props: {
      label: "Attach",
      },
    })
    expect(wrapper.classes()).toContain('cu-file-input')
    expect(wrapper.attributes('data-ai-role')).toBe('file-input')
  })
})
