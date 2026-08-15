import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DescriptionList from './DescriptionList.vue'

describe('DescriptionList', () => {
  it('renders cu-description-list and data-ai-role', () => {
    const wrapper = mount(DescriptionList, {
      props: {
      items: [{"term":"Name","description":"Ada"}],
      },
    })
    expect(wrapper.classes()).toContain('cu-description-list')
    expect(wrapper.attributes('data-ai-role')).toBe('description-list')
  })
})
