import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ChatBubble from './ChatBubble.vue'

describe('ChatBubble', () => {
  it('renders cu-chat-bubble and data-ai-role', () => {
    const wrapper = mount(ChatBubble, {
      props: {
      
      },
      slots: { default: "Hello" },
    })
    expect(wrapper.classes()).toContain('cu-chat-bubble')
    expect(wrapper.attributes('data-ai-role')).toBe('chat-bubble')
  })
})
