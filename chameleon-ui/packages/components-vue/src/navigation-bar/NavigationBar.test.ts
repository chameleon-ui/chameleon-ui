import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NavigationBar from './NavigationBar.vue'
import { useTabStacks } from './stack'

describe('NavigationBar', () => {
  it('renders the title without a back control at the root', () => {
    const wrapper = mount(NavigationBar, { props: { title: 'Home' } })
    expect(wrapper.classes()).toContain('cu-navigation-bar')
    expect(wrapper.attributes('data-ai-role')).toBe('navigation-bar')
    expect(wrapper.attributes('data-ai-state')).toBe('root')
    expect(wrapper.get('.cu-navigation-bar__title').text()).toBe('Home')
    expect(wrapper.find('.cu-navigation-bar__back').exists()).toBe(false)
  })

  it('shows a back control when onBack is provided', async () => {
    const onBack = vi.fn()
    const wrapper = mount(NavigationBar, {
      props: { title: 'Detail', backLabel: 'Home', onBack },
    })
    expect(wrapper.attributes('data-ai-state')).toBe('nested')
    await wrapper.get('.cu-navigation-bar__back').trigger('click')
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})

describe('useTabStacks', () => {
  it('switches tabs without pushing and pops only the active tab', () => {
    const stacks = useTabStacks([
      { value: 'home', title: 'Home' },
      { value: 'inbox', title: 'Inbox' },
    ])
    expect(stacks.current.title).toBe('Home')
    expect(stacks.canPop).toBe(false)
    stacks.push({ id: 'detail', title: 'Detail' })
    expect(stacks.current.title).toBe('Detail')
    expect(stacks.canPop).toBe(true)
    stacks.selectTab('inbox')
    expect(stacks.current.title).toBe('Inbox')
    expect(stacks.canPop).toBe(false)
    stacks.selectTab('home')
    expect(stacks.current.title).toBe('Detail')
    stacks.pop()
    expect(stacks.current.title).toBe('Home')
  })
})
