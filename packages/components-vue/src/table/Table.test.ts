import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Table from './Table.vue'

const rows = [
  { name: 'Alice', status: 'Active' },
  { name: 'Bob', status: 'Away' },
]

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
]

describe('Table', () => {
  it('renders a semantic table with headers, rows, and data-ai attributes', () => {
    const wrapper = mount(Table, {
      props: { caption: 'Users', columns, rows },
    })

    expect(wrapper.classes()).toContain('cu-table')
    expect(wrapper.attributes('data-ai-role')).toBe('table')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
    expect(wrapper.find('caption').text()).toBe('Users')
    expect(wrapper.findAll('th')).toHaveLength(2)
    expect(wrapper.text()).toContain('Alice')
  })

  it('marks empty tables with data-ai-state empty', () => {
    const wrapper = mount(Table, {
      props: { columns, rows: [] },
    })

    expect(wrapper.attributes('data-ai-state')).toBe('empty')
  })
})
