import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NavigationTitle from './NavigationTitle.vue'
import { NavigationBar, NavigationTitle as NavigationTitleExport } from './index'
import { useTabStacks } from './stack'

function navigationTitleCss() {
  return readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )
}

describe('NavigationTitle', () => {
  it('renders the title without a back control at the root', () => {
    const wrapper = mount(NavigationTitle, { props: { title: 'Home' } })
    expect(wrapper.classes()).toContain('cu-navigation-title')
    expect(wrapper.classes()).toContain('cu-navigation-bar')
    expect(wrapper.attributes('data-ai-role')).toBe('navigation-title')
    expect(wrapper.attributes('data-ai-state')).toBe('root')
    expect(wrapper.get('.cu-navigation-title__title').text()).toBe('Home')
    expect(wrapper.find('.cu-navigation-title__back').exists()).toBe(false)
  })

  it('shows a back control when onBack is provided', async () => {
    const onBack = vi.fn()
    const wrapper = mount(NavigationTitle, {
      props: { title: 'Detail', backLabel: 'Home', onBack },
    })
    expect(wrapper.attributes('data-ai-state')).toBe('nested')
    await wrapper.get('.cu-navigation-title__back').trigger('click')
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('exports NavigationBar as a deprecated alias', () => {
    expect(NavigationBar).toBe(NavigationTitleExport)
  })

  it('chrome row height densifies with --cu-control-size-active (matches NavAccountCard)', () => {
    const css = navigationTitleCss()
    expect(css).toMatch(
      /\.cu-navigation-title__frame,\s*\n?\s*\.cu-navigation-bar__frame\s*\{[^}]*min-block-size:\s*calc\(\s*var\(--cu-control-size-active\)\s*\+\s*2\s*\*\s*var\(--cu-space-1\)\s*\)/,
    )
    expect(css).toMatch(
      /\.cu-navigation-title__back,\s*\n?\s*\.cu-navigation-bar__back\s*\{[^}]*min-block-size:\s*var\(--cu-control-size-active\)/,
    )
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
