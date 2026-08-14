import { expect, test, type Page } from '@playwright/test'
import { expectScreenshotOrSkip } from './screenshot-policy'

test.use({ baseURL: 'http://127.0.0.1:4175' })

const widths = [390, 768, 1280] as const
const locales = [
  { locale: 'en', dir: 'ltr' },
  { locale: 'ar', dir: 'rtl' },
] as const

/** One slug per F/G/H family for the Phase 6 全工序 sample (not the full 47). */
const samples = ['chart', 'canvas-base', 'editor'] as const

function galleryUrl(locale: string) {
  return `/?view=gallery&locale=${locale}&theme=line`
}

async function showSlug(page: Page, slug: string) {
  const section = page.locator(`[data-demo-slug="${slug}"]`)
  await section.scrollIntoViewIfNeeded()
  await expect(section).toBeVisible()
  return section
}

test.describe('Phase 6 F/G/H family sample (390/768/1280 × en/ar)', () => {
  for (const { locale, dir } of locales) {
    for (const width of widths) {
      test(`${locale}/${dir} ${width}px F/G/H samples`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(galleryUrl(locale))
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('html')).toHaveAttribute('dir', dir)

        for (const slug of samples) {
          const section = await showSlug(page, slug)
          await expect(section.locator(`[data-ai-role="${slug}"]`).first()).toBeVisible()
          await expectScreenshotOrSkip(section, `p6-${slug}-${locale}-${width}.png`, testInfo, {
            maxDiffPixels: 400,
          })
        }
      })
    }
  }
})
