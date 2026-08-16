import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WorkspaceSplit from './WorkspaceSplit.vue'

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8')

function expectedMorph(shellCssPx: number, nestedInShell: boolean) {
  const tabletPx = 48 * 16
  const desktopPx = 80 * 16
  const shell =
    shellCssPx >= desktopPx ? 'desktop-sidebar' : shellCssPx >= tabletPx ? 'tablet-rail' : 'compact-tabbar'
  const navCol = shell === 'desktop-sidebar' ? 16 * 16 : shell === 'tablet-rail' ? 12 * 16 : 0
  const mainPx = nestedInShell ? Math.max(0, shellCssPx - navCol) : shellCssPx
  const workspace =
    mainPx >= desktopPx ? 'three-pane' : mainPx >= tabletPx ? 'master-detail' : 'stack'
  return { shell, workspace }
}

describe('WorkspaceSplit', () => {
  it('renders master/detail inside a frame', () => {
    const wrapper = mount(WorkspaceSplit, {
      slots: {
        master: '<span>Queue</span>',
        detail: '<span>Editor</span>',
      },
    })
    expect(wrapper.classes()).toContain('cu-workspace-split')
    expect(wrapper.find('.cu-workspace-split__frame').exists()).toBe(true)
    expect(wrapper.text()).toContain('Queue')
    expect(wrapper.text()).toContain('Editor')
  })

  it('renders optional tools slot', () => {
    const wrapper = mount(WorkspaceSplit, {
      slots: {
        master: '<span>Queue</span>',
        detail: '<span>Canvas</span>',
        tools: '<span>Tools</span>',
      },
    })
    expect(wrapper.find('.cu-workspace-split__tools').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tools')
  })

  it('morphs the frame via named container queries', () => {
    expect(css).toMatch(/container-name:\s*workspace-split/)
    expect(css).toMatch(/@container workspace-split \(min-width: 48rem\)/)
    expect(css).toMatch(/@container workspace-split \(min-width: 80rem\)/)
    expect(css).not.toMatch(/@container workspace-split[^{]*\{\s*\.cu-workspace-split\s*\{/)
  })

  it('defaults to scrollMode=shell without pane scroll classes', () => {
    const wrapper = mount(WorkspaceSplit, {
      slots: {
        master: '<span>Queue</span>',
        detail: '<span>Editor</span>',
      },
    })
    expect(wrapper.attributes('data-scroll-mode')).toBe('shell')
    expect(wrapper.find('.cu-workspace-split__pane--scroll').exists()).toBe(false)
  })

  it('enables pane scroll under scrollMode=panes', () => {
    const wrapper = mount(WorkspaceSplit, {
      props: { scrollMode: 'panes' },
      slots: {
        master: '<span>Queue</span>',
        detail: '<span>Canvas</span>',
        tools: '<span>Tools</span>',
      },
    })
    expect(wrapper.attributes('data-scroll-mode')).toBe('panes')
    expect(wrapper.findAll('.cu-workspace-split__pane--scroll')).toHaveLength(3)
  })

  it('allows per-pane scroll overrides under shell mode', () => {
    const wrapper = mount(WorkspaceSplit, {
      props: { masterScroll: true },
      slots: {
        master: '<span>Queue</span>',
        detail: '<span>Editor</span>',
      },
    })
    expect(wrapper.find('.cu-workspace-split__master').classes()).toContain(
      'cu-workspace-split__pane--scroll',
    )
    expect(wrapper.find('.cu-workspace-split__detail').classes()).not.toContain(
      'cu-workspace-split__pane--scroll',
    )
  })

  it('forces nested WorkspaceSplit frames to stay stacked', () => {
    expect(css).toMatch(
      /\.cu-workspace-split\s+\.cu-workspace-split\s+\.cu-workspace-split__frame/,
    )
  })

  it.each([
    { width: 375, nested: true, shell: 'compact-tabbar', workspace: 'stack' },
    { width: 768, nested: true, shell: 'tablet-rail', workspace: 'stack' },
    { width: 1024, nested: true, shell: 'tablet-rail', workspace: 'master-detail' },
    { width: 1280, nested: true, shell: 'desktop-sidebar', workspace: 'master-detail' },
    { width: 1536, nested: true, shell: 'desktop-sidebar', workspace: 'three-pane' },
  ] as const)(
    'device CSS width $width nested=$nested → $shell / $workspace',
    ({ width, nested, shell, workspace }) => {
      const got = expectedMorph(width, nested)
      expect(got.shell).toBe(shell)
      expect(got.workspace).toBe(workspace)
      expect(css).not.toMatch(/@container workspace-split \(min-width: 64rem\)/)
    },
  )
})
