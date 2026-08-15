import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DataGrid from './DataGrid.vue'

describe('DataGrid', () => {
  it('renders cu-data-grid and data-ai-role', () => {
    const wrapper = mount(DataGrid, {
      props: {
        label: 'Rows',
        columns: [{ key: 'name', header: 'Name' }],
        rows: [{ name: 'Ada' }],
      },
    })
    expect(wrapper.classes()).toContain('cu-data-grid')
    expect(wrapper.attributes('data-ai-role')).toBe('data-grid')
  })
})
