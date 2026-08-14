import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ActionSheet } from '../action-sheet/ActionSheet.js'
import { AppShell } from '../app-shell/AppShell.js'
import { Dialog } from '../dialog/Dialog.js'
import { Sidebar } from '../sidebar/Sidebar.js'
import { TabBar } from '../tab-bar/TabBar.js'
import { Table } from '../table/Table.js'

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Phase 5 container-query whitelist from
 * `docs/engineering/容器查询与三端规范.md` §2.
 * Descendants listed here must be the ones restyled inside `@container`,
 * not the query container itself (spec §2 rule 1).
 */
const whitelist = [
  {
    slug: 'app-shell',
    file: 'app-shell/styles.css',
    container: '.cu-app-shell',
    containerName: 'app-shell',
    descendants: ['.cu-app-shell__frame', '.cu-app-shell__sidebar', '.cu-app-shell__tab-bar'],
    queries: ['48rem', '80rem'],
  },
  {
    slug: 'dialog',
    file: 'dialog/styles.css',
    container: '.cu-dialog__positioner',
    descendants: ['.cu-dialog__content'],
    queries: ['48rem'],
  },
  {
    slug: 'action-sheet',
    file: 'action-sheet/styles.css',
    container: '.cu-action-sheet__positioner',
    containerName: 'action-sheet',
    descendants: ['.cu-action-sheet__content'],
    queries: ['48rem'],
  },
  {
    slug: 'table',
    file: 'table/styles.css',
    container: '.cu-table',
    descendants: ['.cu-table__table', '.cu-table__header', '.cu-table__cell'],
    queries: ['47.99rem'],
  },
  {
    slug: 'sidebar',
    file: 'sidebar/styles.css',
    container: '.cu-sidebar',
    containerName: 'sidebar',
    descendants: ['.cu-sidebar__label'],
    queries: ['12rem'],
  },
  {
    slug: 'tab-bar',
    file: 'tab-bar/styles.css',
    container: '.cu-tab-bar',
    containerName: 'tab-bar',
    descendants: ['.cu-tab-bar__item'],
    queries: ['20rem'],
  },
] as const

function readCss(relative: string) {
  return readFileSync(join(srcRoot, relative), 'utf8')
}

function stripComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

function hasViewportSizeMedia(css: string) {
  return /@media[^{]*\((?:min-|max-)?(?:width|height)\b/.test(css)
}

function containerQuerySection(css: string) {
  const idx = css.indexOf('@container')
  return idx === -1 ? '' : css.slice(idx)
}

function setViewportWidth(px: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: px })
  Object.defineProperty(window, 'outerWidth', { configurable: true, writable: true, value: px })
}

const navItems = [
  { value: 'home', label: 'Home' },
  { value: 'library', label: 'Library' },
]

describe('container-driven whitelist CSS (A5.3 / 规范 §7)', () => {
  it.each(whitelist)(
    '$slug: container-type is on the container; @container restyles descendants; no viewport size @media',
    (entry) => {
      const { file, container, descendants, queries } = entry
      const css = stripComments(readCss(file))

      expect(css).toMatch(
        new RegExp(`${container.replaceAll('.', '\\.')}\\s*\\{[^}]*container-type:\\s*inline-size`),
      )
      if ('containerName' in entry) {
        expect(css).toMatch(
          new RegExp(
            `${container.replaceAll('.', '\\.')}\\s*\\{[^}]*container-name:\\s*${entry.containerName}`,
          ),
        )
      }
      expect(hasViewportSizeMedia(css)).toBe(false)

      const queried = containerQuerySection(css)
      expect(queried.length).toBeGreaterThan(0)
      for (const token of queries) {
        expect(queried).toContain(token)
      }
      for (const descendant of descendants) {
        expect(queried).toContain(descendant)
      }
      const containerAsTarget = new RegExp(
        `${container.replaceAll('.', '\\.')}\\s*\\{`,
      )
      expect(queried).not.toMatch(containerAsTarget)
    },
  )
})

describe('narrow container + wide viewport vs wide container + narrow viewport', () => {
  it('hosts keep their inline size even when the viewport disagrees — morph CSS cannot follow the viewport', () => {
    setViewportWidth(1280)
    const { rerender } = render(
      <div data-container-case="narrow-in-wide" style={{ width: '20rem', maxWidth: '20rem' }}>
        <AppShell header={<span>H</span>} sidebar={<span>S</span>}>
          <Table
            caption="Users"
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'status', header: 'Status' },
            ]}
            rows={[{ name: 'Ada', status: 'Active' }]}
          />
        </AppShell>
      </div>,
    )

    const narrowHost = document.querySelector('[data-container-case="narrow-in-wide"]') as HTMLElement
    expect(window.innerWidth).toBe(1280)
    expect(narrowHost.style.width).toBe('20rem')
    expect(narrowHost.querySelector('.cu-app-shell')).not.toBeNull()
    expect(narrowHost.querySelector('.cu-table')).not.toBeNull()

    const shellCss = stripComments(readCss('app-shell/styles.css'))
    expect(shellCss).toMatch(/\.cu-app-shell__sidebar\s*\{[^}]*display:\s*none/)
    expect(containerQuerySection(shellCss)).toMatch(/\.cu-app-shell__sidebar\s*\{[^}]*display:\s*block/)
    expect(hasViewportSizeMedia(shellCss)).toBe(false)

    setViewportWidth(390)
    rerender(
      <div data-container-case="wide-in-narrow" style={{ width: '80rem', minWidth: '80rem' }}>
        <AppShell header={<span>H</span>} sidebar={<span>S</span>}>
          <Table
            caption="Users"
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'status', header: 'Status' },
            ]}
            rows={[{ name: 'Ada', status: 'Active' }]}
          />
        </AppShell>
      </div>,
    )

    const wideHost = document.querySelector('[data-container-case="wide-in-narrow"]') as HTMLElement
    expect(window.innerWidth).toBe(390)
    expect(wideHost.style.width).toBe('80rem')
    expect(wideHost.querySelector('.cu-app-shell')).not.toBeNull()
    expect(document.querySelector('[data-container-case="narrow-in-wide"]')).toBeNull()
  })

  it('overlay and navigation whitelist members render inside independently sized hosts', () => {
    setViewportWidth(1280)
    render(
      <div data-container-case="narrow-overlays" style={{ width: '20rem' }}>
        <Sidebar label="Main" items={navItems} />
        <TabBar label="Main navigation" items={navItems} />
        <Dialog
          closeLabel="Close"
          description="Body"
          title="Title"
          triggerLabel="Open dialog"
          defaultOpen
        />
        <ActionSheet
          triggerLabel="Open sheet"
          title="Actions"
          cancelLabel="Cancel"
          actions={[{ value: 'share', label: 'Share' }]}
          open
        />
      </div>,
    )

    expect(window.innerWidth).toBe(1280)
    expect(document.querySelector('.cu-sidebar')).not.toBeNull()
    expect(document.querySelector('.cu-tab-bar')).not.toBeNull()
    expect(document.querySelector('.cu-dialog__positioner')).not.toBeNull()
    expect(document.querySelector('.cu-action-sheet__positioner')).not.toBeNull()

    for (const { file } of whitelist.filter((entry) =>
      ['dialog', 'action-sheet', 'sidebar', 'tab-bar'].includes(entry.slug),
    )) {
      expect(hasViewportSizeMedia(stripComments(readCss(file)))).toBe(false)
    }
  })
})

describe('Phase 5 navigation chrome follows container size (not a device picker)', () => {
  it('app-shell sidebar morph is @container 48rem / 80rem with compact display:none — no viewport width @media', () => {
    const css = stripComments(readCss('app-shell/styles.css'))
    expect(hasViewportSizeMedia(css)).toBe(false)
    expect(css).toMatch(/\.cu-app-shell__sidebar\s*\{[^}]*display:\s*none/)
    const queried = containerQuerySection(css)
    expect(queried).toContain('48rem')
    expect(queried).toContain('80rem')
    expect(queried).toMatch(/\.cu-app-shell__sidebar\s*\{[^}]*display:\s*block/)
    expect(queried).toMatch(/grid-template-columns:\s*16rem/)
    expect(queried).toMatch(/\.cu-app-shell__tab-bar\s*\{[^}]*display:\s*none/)
  })

  it('tab-bar does not switch visibility with viewport width @media (A5.3: container must win)', () => {
    expect(hasViewportSizeMedia(stripComments(readCss('tab-bar/styles.css')))).toBe(false)
  })

  it('A5.3 host: 20rem shell inside a 1280 viewport still mounts TabBar + sidebar members', () => {
    setViewportWidth(1280)
    render(
      <div data-three-end-size="narrow-in-wide" style={{ width: '20rem', maxWidth: '20rem' }}>
        <AppShell
          header={<span>H</span>}
          sidebar={<Sidebar label="Main" items={navItems} />}
          tabBar={<TabBar label="Main navigation" items={navItems} />}
        >
          <span>Main</span>
        </AppShell>
      </div>,
    )

    expect(window.innerWidth).toBe(1280)
    const host = document.querySelector('[data-three-end-size="narrow-in-wide"]') as HTMLElement
    expect(host.style.width).toBe('20rem')
    expect(host.querySelector('.cu-app-shell__sidebar')).not.toBeNull()
    expect(host.querySelector('.cu-app-shell__tab-bar [data-ai-role="tab-bar"]')).not.toBeNull()
  })
})
