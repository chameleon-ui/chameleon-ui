import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CommentThread from './CommentThread.vue'

describe('CommentThread', () => {
  it('renders data-ai-role comment-thread', () => {
    const wrapper = mount(CommentThread, {
      props: {
      comments: [{"id":"1","author":"Ada","time":"now","text":"Hi"}],
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('comment-thread')
  })
})
