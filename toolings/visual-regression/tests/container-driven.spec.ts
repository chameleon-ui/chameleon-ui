import { expect, test, type Page } from '@playwright/test'
import { expectScreenshotOrSkip } from './screenshot-policy'

test.use({ baseURL: process.env.CU_VR_BASE_URL ?? 'http://127.0.0.1:4175' })

async function computed(page: Page, selector: string, property: string) {
  return page.locator(selector).first().evaluate((element, prop) => getComputedStyle(element).getPropertyValue(prop), property)
}

async function gridTemplateColumns(page: Page) {
  return computed(page, '.cu-app-shell__frame', 'grid-template-columns')
}

function columnTracks(value: string) {
  return value.trim().split(/\s+/).filter(Boolean)
}

test.describe('Phase 5 container-driven pairing (A5.3)', () => {
  test('narrow container + wide viewport: compact morph wins', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/?view=lab&lab=narrow&locale=en&theme=line')

    await expect(page.locator('[data-vr-lab="container-driven"]')).toHaveAttribute('data-lab-case', 'narrow')
    await expect(page.locator('[data-lab-host]')).toBeVisible()

    expect(await computed(page, '.cu-app-shell__sidebar', 'display')).toBe('none')
    expect(columnTracks(await gridTemplateColumns(page))).toHaveLength(1)
    await expect(page.locator('[data-ai-role="tab-bar"]'), 'A5.3 phone chrome: TabBar stays up in a 20rem host').toBeVisible()
    expect(await computed(page, '.cu-tab-bar', 'display')).not.toBe('none')

    expect(await computed(page, '[data-lab-slot="sidebar-rail"] .cu-sidebar__label', 'display')).toBe('none')
    expect(Number.parseFloat(await computed(page, '.cu-tab-bar__item', 'font-size'))).toBeCloseTo(12, 0)

    await page.goto('/?view=lab&lab=narrow&locale=en&theme=line&overlay=dialog')
    await expect(page.locator('.cu-dialog__content')).toBeVisible()
    expect(await computed(page, '.cu-dialog__content', 'align-self')).not.toBe('center')

    await page.goto('/?view=lab&lab=narrow&locale=en&theme=line&overlay=sheet')
    await expect(page.locator('.cu-action-sheet[data-ai-state="open"]')).toBeVisible()
    expect(await computed(page, '.cu-action-sheet__handle', 'display')).toBe('block')

    await expectScreenshotOrSkip(page.locator('[data-lab-host]'), 'narrow-container-wide-viewport.png', testInfo)
  })

  test('wide container + narrow viewport: expanded morph wins', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/?view=lab&lab=wide&locale=en&theme=line')

    await expect(page.locator('[data-vr-lab="container-driven"]')).toHaveAttribute('data-lab-case', 'wide')

    expect(await computed(page, '.cu-app-shell__sidebar', 'display')).toBe('block')
    const wideTracks = columnTracks(await gridTemplateColumns(page))
    expect(wideTracks).toHaveLength(2)
    expect(Number.parseFloat(wideTracks[0] ?? '')).toBeCloseTo(256, 0)

    expect(await computed(page, '[data-lab-slot="sidebar-rail"] .cu-sidebar__label', 'display')).not.toBe('none')
    expect(Number.parseFloat(await computed(page, '.cu-tab-bar__item', 'font-size'))).toBeCloseTo(14, 0)

    await page.goto('/?view=lab&lab=wide&locale=en&theme=line&overlay=dialog')
    await expect(page.locator('.cu-dialog__content')).toBeVisible()
    expect(await computed(page, '.cu-dialog__content', 'align-self')).toBe('center')

    await page.goto('/?view=lab&lab=wide&locale=en&theme=line&overlay=sheet')
    await expect(page.locator('.cu-action-sheet[data-ai-state="open"]')).toBeVisible()
    expect(await computed(page, '.cu-action-sheet__handle', 'display')).toBe('none')

    await expectScreenshotOrSkip(page.locator('[data-lab-host]'), 'wide-container-narrow-viewport.png', testInfo)
  })
})
