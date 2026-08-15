import { expect, test, type Page } from '@playwright/test'
import { expectScreenshotOrSkip } from './screenshot-policy'

test.use({ baseURL: 'http://127.0.0.1:4175' })

const widths = [390, 768, 1280] as const
const locales = [
  { locale: 'en', dir: 'ltr' },
  { locale: 'ar', dir: 'rtl' },
] as const

const blocks = [
  'login',
  'register',
  'crud-page',
  'kanban',
  'gantt',
  'ticket-flow',
  'approval-flow',
  'im-chat',
  'data-screen',
  'trading-terminal',
  'iot-panel',
  'marketing-site',
] as const

function blocksUrl(locale: string) {
  return `/?view=blocks&locale=${locale}&theme=line`
}

async function showBlock(page: Page, slug: string) {
  const section = page.locator(`[data-demo-block="${slug}"]`)
  await section.scrollIntoViewIfNeeded()
  await expect(section).toBeVisible()
  return section
}

test.describe('Phase 7 blocks (390/768/1280 × en/ar)', () => {
  for (const { locale, dir } of locales) {
    for (const width of widths) {
      test(`${locale}/${dir} ${width}px all twelve blocks`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(blocksUrl(locale))
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('html')).toHaveAttribute('dir', dir)

        for (const slug of blocks) {
          const section = await showBlock(page, slug)
          await expectScreenshotOrSkip(section, `p7-${slug}-${locale}-${width}.png`, testInfo, {
            maxDiffPixels: 500,
          })
        }
      })
    }
  }
})
