import catalog from '@chameleon-ui/components/catalog.json'
import { themeIds } from '@chameleon-ui/themes'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { BLIND_TRIAL_COUNT } from './blind-test'
import { GALLERY_PREVIEW_SLUGS, OVERLAY_SLUGS, STUB_SLUGS } from './gallery-previews'
import { installThemeStyles } from './theme'

const cupertinoDistCss = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../packages/themes/dist/cupertino/variables.css'),
  'utf8',
)

describe('Phase 2 inner demo', () => {
  it('exposes 21 product locales and 8 themes in chrome selectors', () => {
    window.history.replaceState(null, '', '/?view=gallery&locale=en&theme=line')
    render(<App />)
    expect(document.querySelectorAll('[data-demo="locale"] option')).toHaveLength(21)
    expect(document.querySelectorAll('[data-demo="theme"] option')).toHaveLength(8)
  })

  it('installs scoped theme overlays once', () => {
    installThemeStyles()
    installThemeStyles()
    expect(document.querySelectorAll('#cu-theme-overlays')).toHaveLength(1)
  })

  it('ships cupertino frosted-glass overlay in the scoped theme CSS', () => {
    expect(cupertinoDistCss).toContain('backdrop-filter')
    expect(cupertinoDistCss).toContain('-webkit-backdrop-filter')
    expect(cupertinoDistCss).toContain('--cu-blur-frost')
    expect(cupertinoDistCss).toContain('--cu-radius-xl')
    expect(cupertinoDistCss).toContain('.cu-app-shell__header')
    expect(cupertinoDistCss).toContain('.cu-tab-bar')
    expect(cupertinoDistCss).toContain('.cu-dialog__content')
  })

  it('renders every catalog slug from the official package', () => {
    window.history.replaceState(null, '', '/?view=gallery&locale=en&theme=line')
    render(<App />)
    const slugs = catalog.components.map((entry) => entry.slug)
    expect(slugs.length).toBeGreaterThanOrEqual(101)
    expect(new Set(GALLERY_PREVIEW_SLUGS)).toEqual(new Set(slugs))
    expect(document.querySelector('[data-demo="catalog-count"]')?.textContent).toBe(String(slugs.length))
    expect(document.querySelectorAll('#gallery [data-demo-slug]')).toHaveLength(slugs.length)
    expect(document.querySelectorAll('[data-demo-kind="missing"]')).toHaveLength(0)
    expect(document.querySelectorAll('[data-demo-kind="stub"]')).toHaveLength(STUB_SLUGS.size)
    for (const family of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
      expect(document.querySelector(`[data-demo-family="${family}"]`), family).not.toBeNull()
    }
    expect(document.querySelector('[data-demo="data-grid-10k"]')).not.toBeNull()
    expect(document.querySelector('[data-demo-slug="canvas-base"] [data-ai-role="canvas-base"]')).not.toBeNull()

    for (const item of catalog.components) {
      const section = document.querySelector(`[data-demo-slug="${item.slug}"]`)
      expect(section, item.slug).not.toBeNull()
      if (OVERLAY_SLUGS.has(item.slug)) continue
      const inSection = section?.querySelector(`[data-ai-role="${item.slug}"]`)
      const anywhere = document.querySelector(`[data-ai-role="${item.slug}"]`)
      expect(inSection ?? anywhere, item.slug).not.toBeNull()
    }
  })

  it('renders the container-driven lab used by Phase 5 visual regression', () => {
    window.history.replaceState(null, '', '/?view=lab&lab=narrow&locale=en&theme=line')
    render(<App />)
    const lab = document.querySelector('[data-vr-lab="container-driven"]')
    expect(lab).not.toBeNull()
    expect(lab).toHaveAttribute('data-lab-case', 'narrow')
    expect(document.documentElement.classList.contains('cu-demo-lab')).toBe(true)
    expect(lab?.querySelector('[data-ai-role="app-shell"]')).not.toBeNull()
    expect(lab?.querySelector('[data-ai-role="table"]')).not.toBeNull()
    expect(lab?.querySelector('[data-ai-role="sidebar"]')).not.toBeNull()
    expect(lab?.querySelector('[data-ai-role="tab-bar"]')).not.toBeNull()
    expect(lab?.querySelector('[data-ai-role="safe-area"]')).not.toBeNull()
    expect(lab?.querySelector('.cu-dialog__trigger')).not.toBeNull()
    expect(lab?.querySelector('.cu-action-sheet__trigger')).not.toBeNull()
  })

  it('renders the AppShell + common-10 suite used by official visual regression', () => {
    window.history.replaceState(null, '', '/?view=suite&locale=ar&theme=line')
    render(<App />)
    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.dataset.theme).toBe('line')
    const suite = document.querySelector('[data-vr-suite="appshell-common10"]')
    expect(suite).not.toBeNull()
    expect(suite?.querySelector('[data-ai-role="app-shell"]')).not.toBeNull()
    for (const slug of catalog.s5Suite.common10) {
      if (slug === 'dialog') {
        expect(suite?.querySelector('.cu-dialog__trigger'), slug).not.toBeNull()
        continue
      }
      expect(suite?.querySelector(`[data-ai-role="${slug}"]`), slug).not.toBeNull()
    }
  })

  it('runs a blind session without leaking the theme name in chrome or the URL', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    window.history.replaceState(null, '', '/?view=blind&locale=en&theme=cupertino')
    render(<App />)

    expect(new URLSearchParams(window.location.search).get('view')).toBe('blind')
    expect(new URLSearchParams(window.location.search).get('theme')).toBeNull()
    expect(document.querySelector('[data-demo="theme"]')).toBeNull()
    expect(document.querySelector('[data-blind-phase="intro"]')).not.toBeNull()

    fireEvent.click(document.querySelector('[data-blind-action="begin"]') as HTMLButtonElement)

    expect(document.querySelector('[data-blind-phase="trial"]')).not.toBeNull()
    expect(document.querySelector('[data-vr-suite="appshell-common10"]')).not.toBeNull()
    expect(document.querySelector('[data-demo="theme"]')).toBeNull()
    expect(new URLSearchParams(window.location.search).get('theme')).toBeNull()
    expect(document.querySelectorAll('[data-blind-guess]')).toHaveLength(themeIds.length + 1)

    for (let step = 0; step < BLIND_TRIAL_COUNT; step += 1) {
      const themeId = document.documentElement.dataset.theme
      expect(themeIds.includes(themeId as (typeof themeIds)[number]), `trial ${step}`).toBe(true)
      fireEvent.click(document.querySelector(`[data-blind-guess="${themeId}"]`) as HTMLButtonElement)
      fireEvent.click(document.querySelector('[data-blind-action="submit"]') as HTMLButtonElement)
      expect(new URLSearchParams(window.location.search).get('theme')).toBeNull()
    }

    expect(document.querySelector('[data-blind-phase="done"]')).not.toBeNull()
    const exported = (document.querySelector('[data-blind="export"]') as HTMLTextAreaElement).value
    const parsed = JSON.parse(exported) as {
      status: string
      rate: number | null
      trials: Array<{ themeId: string; guess: string; correct: boolean; timestamp: string }>
    }
    expect(parsed.status).toBe('complete')
    expect(parsed.trials).toHaveLength(16)
    expect(parsed.trials.every((trial) => trial.correct && trial.timestamp && trial.guess === trial.themeId)).toBe(true)
    expect(parsed.rate).toBe(parsed.trials.filter((trial) => trial.correct).length / parsed.trials.length)

    fireEvent.click(document.querySelector('[data-blind-action="copy"]') as HTMLButtonElement)
    await waitFor(() => expect(writeText).toHaveBeenCalled())
  })

  it('renders adaptive chrome on the default live shell without a device picker', () => {
    window.history.replaceState(null, '', '/?locale=zh-CN&theme=line')
    render(<App />)

    expect(document.querySelector('[data-demo="adaptive"]')).not.toBeNull()
    expect(document.querySelector('[data-cu-shell]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="app-shell"]')).not.toBeNull()
    expect(document.querySelector('.cu-app-shell__tab-bar [data-ai-role="tab-bar"]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="sidebar"]')).not.toBeNull()
    expect(document.querySelector('[data-three-end-pick]')).toBeNull()
    expect(document.body.textContent).toMatch(/拖动窗口宽度/)
  })

  it('renders a live three-end shell and keeps freeze frames behind a closed lab', () => {
    window.history.replaceState(null, '', '/?view=three-end&locale=zh-CN&theme=line')
    render(<App />)

    expect(document.documentElement.classList.contains('cu-demo-three-end')).toBe(true)
    expect(document.querySelector('[data-three-end="playground"]')).not.toBeNull()
    expect(document.querySelector('[data-three-end="live"]')).not.toBeNull()
    expect(document.querySelector('[data-three-end="stage"]')).not.toBeNull()
    expect(document.querySelector('[data-three-end-pick]')).toBeNull()
    expect(document.querySelector('[data-ai-role="tab-bar"]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="sidebar"]')).not.toBeNull()
    expect(document.querySelector('[data-three-end-container="narrow"] [data-ai-role="app-shell"]')).not.toBeNull()

    const freeze = document.querySelector('[data-three-end="freeze-lab"]')
    expect(freeze).not.toBeNull()
    expect(freeze?.textContent).toMatch(/演示冻结/)
    expect((freeze as HTMLDetailsElement).open).toBe(false)

    const frames = [...(freeze?.querySelectorAll<HTMLIFrameElement>('iframe') ?? [])]
    expect(frames).toHaveLength(4)
    expect(frames[0]?.getAttribute('src')).toContain('view=three-end-stage')
    expect(frames[0]?.getAttribute('src')).toContain('end=phone')
    expect(frames[0]?.getAttribute('width')).toBe('390')
    expect(frames[1]?.getAttribute('width')).toBe('768')
    expect(frames[2]?.getAttribute('width')).toBe('1280')
    expect(frames[3]?.getAttribute('src')).toContain('end=proof')
    expect(frames[3]?.getAttribute('width')).toBe('1280')
  })

  it('notes cupertino frosted chrome on the three-end playground', () => {
    window.history.replaceState(null, '', '/?view=three-end&locale=en&theme=cupertino')
    render(<App />)
    expect(document.querySelector('[data-three-end="cupertino-frost"]')?.textContent).toMatch(/frosted glass/i)
  })

  it('keeps TabBar and Sidebar in the stage DOM so CSS can morph them with container width', () => {
    window.history.replaceState(null, '', '/?view=three-end-stage&end=phone&locale=zh-CN&theme=line')
    const phone = render(<App />)
    expect(document.documentElement.dataset.end).toBe('phone')
    expect(document.querySelector('[data-three-end="stage"]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="app-shell"]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="tab-bar"]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="sidebar"]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="action-sheet"]')).not.toBeNull()
    expect(document.querySelector('.cu-dialog__trigger')).not.toBeNull()
    expect(document.querySelector('[data-three-end="density"]')).not.toBeNull()
    phone.unmount()

    window.history.replaceState(null, '', '/?view=three-end-stage&end=desktop&locale=zh-CN&theme=line')
    render(<App />)
    expect(document.documentElement.dataset.end).toBe('desktop')
    expect(document.querySelector('[data-ai-role="sidebar"]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="tab-bar"]')).not.toBeNull()
    expect(document.querySelector('.cu-dialog__trigger')).not.toBeNull()
  })

  it('proves A5.3 with a 320px container inside a 1280 proof stage', () => {
    window.history.replaceState(null, '', '/?view=three-end-stage&end=proof&locale=zh-CN&theme=line')
    render(<App />)
    expect(document.querySelector('[data-three-end="proof"]')).not.toBeNull()
    expect(document.querySelector('[data-three-end-container="wide"] [data-ai-role="app-shell"]')).not.toBeNull()
    expect(document.querySelector('[data-three-end-container="narrow"] [data-ai-role="app-shell"]')).not.toBeNull()
    expect(document.querySelector('[data-ai-role="dialog"]')).not.toBeNull()
  })
})
