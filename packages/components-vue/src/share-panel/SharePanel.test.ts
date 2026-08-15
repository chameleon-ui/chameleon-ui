import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SharePanel from './SharePanel.vue'

describe('SharePanel', () => {
  it('renders data-ai-role share-panel', () => {
    const wrapper = mount(SharePanel, {
      props: {
      title: "Share",
      url: "https://example.com",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('share-panel')
  })
})
