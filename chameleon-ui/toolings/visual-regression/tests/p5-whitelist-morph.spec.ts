import { expect, test, type Page } from '@playwright/test'
import { expectScreenshotOrSkip } from './screenshot-policy'

test.use({ baseURL: 'http://127.0.0.1:4175' })

const widths = [390, 768, 1280] as const
const locales = [
  { locale: 'en', dir: 'ltr' },
  { locale: 'ar', dir: 'rtl' },
] as const

const whitelist = ['app-shell', 'table', 'sidebar', 'tab-bar', 'safe-area', 'navigation'] as const

async function computed(page: Page, selector: string, property: string) {
  return page.locator(selector).first().evaluate((element, prop) => getComputedStyle(element).getPropertyValue(prop), property)
}

async function gridTemplateColumns(page: Page) {
  return computed(page, '.cu-app-shell__frame', 'grid-template-columns')
}

function columnTracks(value: string) {
  return value.trim().split(/\s+/).filter(Boolean)
}

function labUrl(locale: string, overlay?: 'dialog' | 'sheet') {
  const params = new URLSearchParams({
    view: 'lab',
    lab: 'native',
    locale,
    theme: 'line',
  })
  if (overlay) params.set('overlay', overlay)
  return `/?${params.toString()}`
}

test.describe('Phase 5 whitelist morph matrix (A5.4 / A5.5 / T5.8)', () => {
  for (const { locale, dir } of locales) {
    for (const width of widths) {
      test(`${locale}/${dir} ${width}px matches contract.responsive`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(labUrl(locale))

        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('html')).toHaveAttribute('dir', dir)

        const lab = page.locator('[data-vr-lab="container-driven"]')
        await expect(lab).toBeVisible()
        for (const role of whitelist) {
          await expect(lab.locator(`[data-ai-role="${role}"]`)).toBeVisible()
        }
        await expect(lab.locator('.cu-dialog__trigger')).toBeVisible()
        await expect(lab.locator('.cu-action-sheet__trigger')).toBeVisible()

        if (width === 390) {
          expect(await computed(page, '[data-lab-slot="app-shell"] .cu-navigation__list', 'flex-direction')).toBe('row')
          expect(columnTracks(await gridTemplateColumns(page))).toHaveLength(1)
        } else {
          expect(await computed(page, '[data-lab-slot="app-shell"] .cu-navigation__list', 'flex-direction')).toBe(
            'column',
          )
          const tracks = columnTracks(await gridTemplateColumns(page))
          expect(tracks).toHaveLength(2)
          expect(Number.parseFloat(tracks[0] ?? '')).toBeCloseTo(width === 768 ? 192 : 256, 0)
        }

        await expectScreenshotOrSkip(lab, `morph-shell-${locale}-${width}.png`, testInfo, {
          maxDiffPixels: 400,
        })

        const safeArea = lab.locator('[data-lab-slot="safe-area"] [data-ai-role="safe-area"]')
        await expect(safeArea).toHaveAttribute('data-ai-intent', 'fit-safe-area')
        expect(await computed(page, '[data-lab-slot="safe-area"] [data-ai-role="safe-area"]', 'padding-block-end')).toBe(
          '0px',
        )
        await expectScreenshotOrSkip(safeArea, `morph-safe-area-${locale}-${width}.png`, testInfo)

        await page.goto(labUrl(locale, 'dialog'))
        await expect(page.locator('.cu-dialog__content')).toBeVisible()
        const dialogAlign = await computed(page, '.cu-dialog__content', 'align-self')
        if (width === 390) expect(dialogAlign).not.toBe('center')
        else expect(dialogAlign).toBe('center')
        await expectScreenshotOrSkip(
          page.locator('.cu-dialog__content'),
          `morph-dialog-${locale}-${width}.png`,
          testInfo,
        )

        await page.goto(labUrl(locale, 'sheet'))
        await expect(page.locator('.cu-action-sheet[data-ai-state="open"]')).toBeVisible()
        const handleDisplay = await computed(page, '.cu-action-sheet__handle', 'display')
        if (width === 390) expect(handleDisplay).toBe('block')
        else expect(handleDisplay).toBe('none')
        await expectScreenshotOrSkip(
          page.locator('.cu-action-sheet[data-ai-state="open"]'),
          `morph-action-sheet-${locale}-${width}.png`,
          testInfo,
        )
      })
    }
  }
})
