import { expect, test } from '@playwright/test'

test.use({ baseURL: 'http://127.0.0.1:4173' })

const widths = ['390', '768', '1280'] as const

async function setArabicRtl(page: import('@playwright/test').Page) {
  await page.locator('select').first().selectOption('ar')
  await page.locator('input[name="direction"][value="rtl"]').check()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
}

test.describe('POC Ark ar RTL visual baselines (comparison only)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await setArabicRtl(page)
  })

  for (const width of widths) {
    test(`poc ark ar/rtl breakpoint ${width}px preview`, async ({ page }) => {
      const preview = page.locator(`[data-preview-width="${width}"]`)
      await expect(preview).toBeVisible()
      await expect(preview).toHaveAttribute('lang', 'ar')
      await expect(preview).toHaveAttribute('dir', 'rtl')
      await expect(preview).toHaveScreenshot(`ar-rtl-${width}.png`)
    })
  }
})
