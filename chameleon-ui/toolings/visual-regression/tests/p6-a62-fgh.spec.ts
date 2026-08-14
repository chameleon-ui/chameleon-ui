import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test'
import { expectScreenshotOrSkip } from './screenshot-policy'

test.use({ baseURL: process.env.CU_VR_BASE_URL ?? 'http://127.0.0.1:4175' })

const widths = [390, 768, 1280] as const
/** Sample F/G/H VR used en+ar; keep the same locale matrix. */
const locales = [
  { locale: 'en', dir: 'ltr' },
  { locale: 'ar', dir: 'rtl' },
] as const

const familyF = ['chart', 'kpi-dashboard', 'ticker', 'sparkline', 'heatmap', 'gauge'] as const
const familyG = [
  'canvas-base',
  'flow-node',
  'edge',
  'mind-map',
  'graph-view',
  'pipeline-view',
  'canvas-toolbar',
] as const
const familyH = [
  'editor',
  'markdown-renderer',
  'comment-thread',
  'chat-bubble',
  'code-block',
  'article-card',
  'share-panel',
] as const

const slugs = [...familyF, ...familyG, ...familyH] as const

/**
 * Gallery overlays portal while closed — PNG of the section would be a closed trigger.
 * None of F/G/H are overlay slugs today; the skip stays so a future overlay is not faked.
 */
const overlaySlugs = new Set([
  'dialog',
  'tooltip',
  'popover',
  'drawer',
  'sheet',
  'action-sheet',
  'confirm-dialog',
  'hover-card',
  'menu',
])

function galleryUrl(locale: string) {
  return `/?view=gallery&locale=${locale}&theme=line`
}

async function openGallery(page: Page, locale: string, dir: string) {
  await page.goto(galleryUrl(locale), { waitUntil: 'domcontentloaded' })
  const html = page.locator('html')
  const localeSelect = page.locator('[data-demo="locale"]')
  await expect(localeSelect).toBeAttached()
  if ((await html.getAttribute('lang')) !== locale) {
    await localeSelect.selectOption(locale)
  }
  await expect(html).toHaveAttribute('lang', locale)
  await expect(html).toHaveAttribute('dir', dir)
  await expect(page.locator('#gallery [data-demo-slug]').first()).toBeVisible()
}

async function showSlug(page: Page, slug: string) {
  const section = page.locator(`[data-demo-slug="${slug}"]`)
  await section.scrollIntoViewIfNeeded()
  await expect(section).toBeVisible()
  return section
}

async function canvas2dAvailable(section: Locator) {
  const canvas = section.locator('canvas').first()
  if ((await canvas.count()) === 0) return true
  try {
    return await canvas.evaluate((element) => {
      try {
        return Boolean((element as HTMLCanvasElement).getContext('2d'))
      } catch {
        return false
      }
    })
  } catch {
    return false
  }
}

async function captureSlug(page: Page, slug: string, locale: string, width: number, testInfo: TestInfo) {
  if (overlaySlugs.has(slug)) {
    testInfo.annotations.push({
      type: 'skip-screenshot',
      description: `overlay slug ${slug}: closed overlay body is portaled; PNG skipped (no fake hash)`,
    })
    const section = page.locator(`[data-demo-slug="${slug}"]`)
    await expect(section).toBeVisible()
    return
  }

  const section = await showSlug(page, slug)
  await expect(section.locator(`[data-ai-role="${slug}"]`).first()).toBeVisible()

  if (slug === 'canvas-base' && !(await canvas2dAvailable(section))) {
    testInfo.annotations.push({
      type: 'skip-screenshot',
      description: 'canvas-base: CanvasRenderingContext2D getContext unavailable; PNG skipped (no fake hash)',
    })
    return
  }

  await expectScreenshotOrSkip(section, `p6-a62-${slug}-${locale}-${width}.png`, testInfo, {
    maxDiffPixels: 400,
  })
}

test.describe('Phase 6 A6.2 F/G/H (390/768/1280 × en/ar)', () => {
  test.describe.configure({ timeout: 180_000 })

  for (const { locale, dir } of locales) {
    for (const width of widths) {
      test(`${locale}/${dir} ${width}px F/G/H (${slugs.length} slugs)`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 844 })
        await openGallery(page, locale, dir)

        for (const slug of slugs) {
          await captureSlug(page, slug, locale, width, testInfo)
        }
      })
    }
  }
})
