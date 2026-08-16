import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WorkspaceSplit } from './WorkspaceSplit.js'

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8')

/** Expected morph at common device CSS widths (@16px root). */
function expectedMorph(shellCssPx: number, nestedInShell: boolean) {
  const tabletPx = 48 * 16
  const desktopPx = 80 * 16
  const shell =
    shellCssPx >= desktopPx ? 'desktop-sidebar' : shellCssPx >= tabletPx ? 'tablet-rail' : 'compact-tabbar'
  const navCol = shell === 'desktop-sidebar' ? 16 * 16 : shell === 'tablet-rail' ? 12 * 16 : 0
  const mainPx = nestedInShell ? Math.max(0, shellCssPx - navCol) : shellCssPx
  const workspace =
    mainPx >= desktopPx ? 'three-pane' : mainPx >= tabletPx ? 'master-detail' : 'stack'
  return { shell, workspace, mainPx }
}

describe('WorkspaceSplit', () => {
  it('renders master/detail inside a frame descendant of the query container', () => {
    const { container } = render(
      <WorkspaceSplit master={<span>Queue</span>} detail={<span>Editor</span>} />,
    )
    const root = container.firstElementChild
    expect(root).toHaveClass('cu-workspace-split')
    expect(root).toHaveAttribute('data-ai-role', 'workspace-split')
    expect(root?.querySelector('.cu-workspace-split__frame')).not.toBeNull()
    expect(screen.getByText('Queue')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
  })

  it('renders an optional tools pane', () => {
    render(
      <WorkspaceSplit
        master={<span>Queue</span>}
        detail={<span>Canvas</span>}
        tools={<span>Tools</span>}
      />,
    )
    expect(screen.getByText('Tools')).toBeInTheDocument()
    expect(document.querySelector('.cu-workspace-split__tools')).not.toBeNull()
  })

  it('morphs the frame via named container queries, not the container itself', () => {
    expect(css).toMatch(/container-name:\s*workspace-split/)
    expect(css).toMatch(/@container workspace-split \(min-width: 48rem\)/)
    expect(css).toMatch(/@container workspace-split \(min-width: 80rem\)/)
    expect(css).toMatch(/\.cu-workspace-split__frame\s*\{/)
    // Spec §2: never restyle the query container from inside its own @container.
    expect(css).not.toMatch(/@container workspace-split[^{]*\{\s*\.cu-workspace-split\s*\{/)
    expect(css).toMatch(
      /@container workspace-split \(min-width: 48rem\)\s*\{[\s\S]*?\.cu-workspace-split__frame/,
    )
  })

  it('stacks to a single column on compact and opens columns from tablet', () => {
    expect(css).toMatch(/grid-template-areas:\s*"master"\s*"detail"/)
    expect(css).toMatch(/grid-template-areas:\s*"master detail"/)
    expect(css).toMatch(/"master detail tools"/)
    expect(css).toMatch(/minmax\(0,\s*1fr\)/)
    expect(css).toMatch(/overflow-x:\s*clip/)
  })

  it('defaults to scrollMode=shell without pane scroll classes', () => {
    const { container } = render(
      <WorkspaceSplit master={<span>Queue</span>} detail={<span>Editor</span>} />,
    )
    const root = container.firstElementChild
    expect(root).toHaveAttribute('data-scroll-mode', 'shell')
    expect(container.querySelector('.cu-workspace-split__pane--scroll')).toBeNull()
  })

  it('enables pane scroll under scrollMode=panes', () => {
    const { container } = render(
      <WorkspaceSplit
        scrollMode="panes"
        master={<span>Queue</span>}
        detail={<span>Editor</span>}
        tools={<span>Tools</span>}
      />,
    )
    expect(container.firstElementChild).toHaveAttribute('data-scroll-mode', 'panes')
    expect(container.querySelectorAll('.cu-workspace-split__pane--scroll')).toHaveLength(3)
  })

  it('allows per-pane scroll overrides under shell mode', () => {
    const { container } = render(
      <WorkspaceSplit
        masterScroll
        master={<span>Queue</span>}
        detail={<span>Editor</span>}
      />,
    )
    expect(container.querySelector('.cu-workspace-split__master')).toHaveClass(
      'cu-workspace-split__pane--scroll',
    )
    expect(container.querySelector('.cu-workspace-split__detail')).not.toHaveClass(
      'cu-workspace-split__pane--scroll',
    )
  })

  it('documents shell vs panes height/scroll CSS', () => {
    expect(css).toMatch(/data-scroll-mode='shell'/)
    expect(css).toMatch(/data-scroll-mode='panes'/)
    expect(css).toMatch(/scrollbar-gutter:\s*auto/)
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
    { width: 1280, nested: false, shell: 'desktop-sidebar', workspace: 'three-pane' },
    { width: 1536, nested: true, shell: 'desktop-sidebar', workspace: 'three-pane' },
  ] as const)(
    'device CSS width $width nested=$nested → shell $shell / workspace $workspace',
    ({ width, nested, shell, workspace }) => {
      const got = expectedMorph(width, nested)
      expect(got.shell).toBe(shell)
      expect(got.workspace).toBe(workspace)
      expect(css).toMatch(/min-width: 48rem/)
      expect(css).toMatch(/min-width: 80rem/)
      expect(css).not.toMatch(/@container workspace-split \(min-width: 64rem\)/)
    },
  )
})
