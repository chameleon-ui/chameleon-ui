import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SearchBar from './SearchBar.vue'

describe('SearchBar', () => {
  it('renders data-ai-role search-bar', () => {
    const wrapper = mount(SearchBar, {
      props: {
      value: "",
      label: "Search",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('search-bar')
  })
})
