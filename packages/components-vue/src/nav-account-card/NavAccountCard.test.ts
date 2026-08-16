import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Navigation from '../navigation/Navigation.vue'
import NavAccountCard from './NavAccountCard.vue'

function navigationCss() {
  return readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../navigation/styles.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )
}

describe('NavAccountCard', () => {
  it('renders avatar, username, nickname, and logout', async () => {
    const wrapper = mount(NavAccountCard, {
      props: {
        username: 'Ada',
        nickname: 'admin',
        avatarSrc: '/ada.png',
        logoutLabel: '登出',
      },
    })
    expect(wrapper.classes()).toContain('cu-nav-account-card')
    expect(wrapper.attributes('data-ai-role')).toBe('nav-account-card')
    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.text()).toContain('admin')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('logout')).toHaveLength(1)
  })

  it('is the official Navigation footer path; footer suppresses toggle', () => {
    const wrapper = mount(Navigation, {
      props: {
        label: 'Main',
        items: [{ value: 'home', label: 'Home' }],
      },
      slots: {
        footer: '<NavAccountCard username="Ada" />',
      },
      global: { components: { NavAccountCard } },
    })
    expect(wrapper.find('.cu-navigation__footer .cu-nav-account-card').exists()).toBe(true)
    expect(wrapper.find('.cu-navigation__toggle').exists()).toBe(false)
    const css = navigationCss()
    expect(css).toMatch(/\.cu-navigation__footer[\s\S]*?display:\s*none/)
  })

  it('row height matches NavigationTitle via --cu-control-size-active + space-1', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    )
    expect(css).toMatch(
      /\.cu-nav-account-card\s*\{[^}]*min-block-size:\s*calc\(\s*var\(--cu-control-size-active\)\s*\+\s*2\s*\*\s*var\(--cu-space-1\)\s*\)/,
    )
    expect(css).toMatch(/\.cu-nav-account-card\s*\{[^}]*padding-block:\s*var\(--cu-space-1\)/)
  })
})
