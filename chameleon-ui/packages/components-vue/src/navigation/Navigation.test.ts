import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Navigation from './Navigation.vue'
import { splitNavigationItems } from './split'

const items = [
  { value: 'home', label: 'Home' },
  { value: 'library', label: 'Library' },
]

describe('Navigation', () => {
  it('renders one landmark with one item list — not a Sidebar + TabBar pair', () => {
    const wrapper = mount(Navigation, {
      props: { label: 'Main', items, activeValue: 'library' },
    })
    const nav = wrapper.get('nav')
    expect(nav.classes()).toContain('cu-navigation')
    expect(nav.attributes('data-ai-role')).toBe('navigation')
    expect(nav.attributes('data-ai-intent')).toBe('navigate-sections')
    expect(nav.attributes('data-ai-state')).toBe('expanded')
    expect(wrapper.find('.cu-navigation__frame').exists()).toBe(true)
    expect(wrapper.findAll('nav')).toHaveLength(1)
    expect(wrapper.find('.cu-sidebar').exists()).toBe(false)
    expect(wrapper.find('.cu-tab-bar').exists()).toBe(false)
    expect(wrapper.get('button[aria-label="Library"]').attributes('aria-current')).toBe('page')
    expect(wrapper.get('button[aria-label="Home"]').attributes('aria-current')).toBeUndefined()
  })

  it('reports selection from the single list', async () => {
    const wrapper = mount(Navigation, { props: { label: 'Main', items } })
    await wrapper.get('button[aria-label="Home"]').trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['home'])
  })

  it('keeps overflow destinations in the same tree and parks them behind More on compact', async () => {
    const many = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
      { value: 'e', label: 'E' },
      { value: 'f', label: 'F' },
    ]
    expect(splitNavigationItems(many)).toEqual({
      compact: many.slice(0, 4),
      overflow: many.slice(4),
    })
    const wrapper = mount(Navigation, { props: { label: 'Main', items: many, moreLabel: 'More' } })
    const more = wrapper.get('button[aria-expanded]')
    expect(more.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.cu-navigation__overflow-list').element.children).toHaveLength(2)
    await more.trigger('click')
    expect(more.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('nav').attributes('data-more')).toBe('open')
    await wrapper.get('button[aria-label="E"]').trigger('click')
    expect(wrapper.get('button[aria-label="E"]').attributes('aria-current')).toBe('page')
    expect(wrapper.get('nav').attributes('data-more')).toBe('closed')
  })
})
