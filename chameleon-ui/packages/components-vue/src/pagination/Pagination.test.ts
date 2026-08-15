import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pagination from './Pagination.vue'

describe('Pagination', () => {
  it('renders cu-pagination and data-ai-role', () => {
    const wrapper = mount(Pagination, {
      props: {
      currentPage: 1,
      totalPages: 3,
      },
    })
    expect(wrapper.classes()).toContain('cu-pagination')
    expect(wrapper.attributes('data-ai-role')).toBe('pagination')
  })
})
