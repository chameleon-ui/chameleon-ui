import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoadingBar from './LoadingBar.vue'

describe('LoadingBar', () => {
  it('renders cu-loading-bar and data-ai-role', () => {
    const wrapper = mount(LoadingBar, {
      props: {
      
      },
    })
    expect(wrapper.classes()).toContain('cu-loading-bar')
    expect(wrapper.attributes('data-ai-role')).toBe('loading-bar')
  })
})
