import { expect, test } from '@playwright/test'

test.use({ baseURL: 'http://127.0.0.1:4175' })

const widths = [390, 768, 1280] as const
const common10 = [
  'button',
  'icon',
  'typography',
  'input',
  'select',
  'checkbox',
  'dialog',
  'tabs',
  'stack',
  'spinner',
] as const

test.describe('Official AppShell + common-10 ar RTL', () => {
  for (const width of widths) {
    test(`official demo ar/rtl ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/?view=suite&locale=ar&theme=line')
      await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'line')

      const suite = page.locator('[data-vr-suite="appshell-common10"]')
      await expect(suite).toBeVisible()
      await expect(suite.locator('[data-ai-role="app-shell"]')).toBeVisible()
      for (const role of common10) {
        if (role === 'dialog') {
          await expect(suite.locator('.cu-dialog__trigger')).toBeVisible()
          continue
        }
        await expect(suite.locator(`[data-ai-role="${role}"]`).first()).toBeVisible()
      }

      await expect(suite).toHaveScreenshot(`official-ar-rtl-${width}.png`, {
        maxDiffPixels: 400,
      })
    })
  }
})
