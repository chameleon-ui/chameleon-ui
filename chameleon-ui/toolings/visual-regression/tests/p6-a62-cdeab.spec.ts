import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { expectScreenshotOrSkip } from './screenshot-policy'

test.use({ baseURL: process.env.CU_VR_BASE_URL ?? 'http://127.0.0.1:5175' })

const widths = [390, 768, 1280] as const
const locales = [
  { locale: 'en', dir: 'ltr' },
  { locale: 'ar', dir: 'rtl' },
] as const

const familyC = [
  'password-input',
  'otp-input',
  'multi-select',
  'rating',
  'date-picker',
  'time-picker',
  'calendar',
  'color-picker',
  'search-bar',
  'upload',
] as const
const familyD = ['data-grid', 'tag', 'statistic', 'timeline', 'tree', 'image', 'carousel'] as const
const familyE = ['notification', 'confirm-dialog', 'result', 'loading-bar'] as const
const familyA = ['space', 'container', 'masonry'] as const
const familyB = ['navbar', 'steps', 'command-palette'] as const

const slugs = [...familyC, ...familyD, ...familyE, ...familyA, ...familyB] as const

/** Closed overlay / hidden host is enough — do not open dialogs. Still capture the section PNG. */
const closedOk = new Set(['confirm-dialog', 'command-palette'])

function galleryUrl(locale: string) {
  return `/?view=gallery&locale=${locale}&theme=line`
}

async function showSlug(page: Page, slug: string) {
  const section = page.locator(`[data-demo-slug="${slug}"]`)
  await section.scrollIntoViewIfNeeded()
  await expect(section).toBeVisible()
  return section
}

async function captureSlug(page: Page, slug: string, locale: string, width: number, testInfo: TestInfo) {
  const section = await showSlug(page, slug)
  const role = section.locator(`[data-ai-role="${slug}"]`).first()

  if (closedOk.has(slug)) {
    await expect(role).toHaveCount(slug === 'confirm-dialog' ? 0 : 1)
    if (slug === 'confirm-dialog') {
      await expect(section.locator('.cu-confirm-dialog__trigger')).toBeVisible()
    }
  } else {
    await expect(role).toBeVisible()
  }

  await expectScreenshotOrSkip(section, `p6-a62-${slug}-${locale}-${width}.png`, testInfo, {
    maxDiffPixels: 400,
  })
}

test.describe('Phase 6 A6.2 C/D/E/A/B (390/768/1280 × en/ar)', () => {
  test.describe.configure({ timeout: 180_000 })

  for (const { locale, dir } of locales) {
    for (const width of widths) {
      test(`${locale}/${dir} ${width}px C/D/E/A/B (${slugs.length} slugs)`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(galleryUrl(locale))
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('html')).toHaveAttribute('dir', dir)
        await expect(page.locator('#gallery [data-demo-slug]').first()).toBeVisible()

        for (const slug of slugs) {
          await captureSlug(page, slug, locale, width, testInfo)
        }
      })
    }
  }
})
