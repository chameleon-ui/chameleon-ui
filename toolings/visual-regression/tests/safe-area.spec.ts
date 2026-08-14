import { expect, test } from '@playwright/test'
import { expectScreenshotOrSkip } from './screenshot-policy'

test.use({ baseURL: 'http://127.0.0.1:4175' })

const widths = [390, 768, 1280] as const
const locales = [
  { locale: 'en', dir: 'ltr' },
  { locale: 'ar', dir: 'rtl' },
] as const

/**
 * A5.4 independent SafeArea snapshots. SafeArea has no breakpoint morph;
 * these frames prove the wrapper is in the official VR lab, not a hash stub.
 * env(safe-area-inset-*, 0px) falls back to 0 in desktop Chromium — that is
 * the documented fallback, not a fake inset.
 */
test.describe('Phase 5 safe-area independent VR (A5.4)', () => {
  for (const { locale, dir } of locales) {
    for (const width of widths) {
      test(`${locale}/${dir} ${width}px safe-area wrapper`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(`/?view=lab&lab=native&locale=${locale}&theme=line`)

        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('html')).toHaveAttribute('dir', dir)

        const safeArea = page.locator('[data-lab-slot="safe-area"] [data-ai-role="safe-area"]')
        await expect(safeArea).toBeVisible()
        await expect(safeArea).toHaveAttribute('data-ai-intent', 'fit-safe-area')
        await expect(safeArea).toHaveClass(/cu-safe-area--top/)
        await expect(safeArea).toHaveClass(/cu-safe-area--bottom/)
        await expect(safeArea).toHaveClass(/cu-safe-area--start/)
        await expect(safeArea).toHaveClass(/cu-safe-area--end/)

        const padding = await safeArea.evaluate((element) => {
          const style = getComputedStyle(element)
          return {
            blockStart: style.paddingBlockStart,
            blockEnd: style.paddingBlockEnd,
            inlineStart: style.paddingInlineStart,
            inlineEnd: style.paddingInlineEnd,
          }
        })
        // Desktop Chromium has no notch; 0px fallback must win.
        expect(padding.blockStart).toBe('0px')
        expect(padding.blockEnd).toBe('0px')
        expect(padding.inlineStart).toBe('0px')
        expect(padding.inlineEnd).toBe('0px')

        await expectScreenshotOrSkip(safeArea, `safe-area-${locale}-${width}.png`, testInfo)
      })
    }
  }
})
