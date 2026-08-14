import { expect, test, type Locator, type Page } from '@playwright/test'

/**
 * 三端一体 is proven by viewport/container size, not by clicking a device picker.
 * Live shell: default `/` (`[data-cu-shell]` or `[data-demo="adaptive"]`).
 * One Navigation node: phone tab-bar form; tablet/desktop sidebar form.
 */
test.use({ baseURL: process.env.CU_VR_BASE_URL ?? 'http://127.0.0.1:5175' })

type End = 'phone' | 'tablet' | 'desktop'

async function liveRoot(page: Page): Promise<Locator> {
  const marked = page.locator('[data-cu-shell]')
  if ((await marked.count()) > 0) return marked.first()
  const adaptive = page.locator('[data-demo="adaptive"]')
  if ((await adaptive.count()) > 0) return adaptive.first()
  return page.locator('[data-ai-role="app-shell"]').first()
}

function chromeNav(root: Locator) {
  return root
    .locator('.cu-app-shell')
    .first()
    .locator(':scope > .cu-app-shell__frame > .cu-app-shell__nav [data-ai-role="navigation"]')
}

function chromeFrame(root: Locator) {
  return root.locator('.cu-app-shell').first().locator(':scope > .cu-app-shell__frame')
}

async function navListDirection(root: Locator) {
  return chromeNav(root).locator('.cu-navigation__list').evaluate((element) => getComputedStyle(element).flexDirection)
}

async function frameColumns(root: Locator) {
  const value = await chromeFrame(root).evaluate((element) => getComputedStyle(element).gridTemplateColumns)
  return value.trim().split(/\s+/).filter(Boolean)
}

async function assertPhase5Chrome(root: Locator, end: End) {
  await expect(root, 'live shell is on the page').toBeVisible()
  const nav = chromeNav(root)
  await expect(nav, 'live shell mounts one Navigation (not Sidebar + TabBar)').toHaveCount(1)
  await expect(root.locator('.cu-app-shell').first().locator(':scope > .cu-app-shell__frame > .cu-app-shell__sidebar')).toHaveCount(0)
  await expect(root.locator('.cu-app-shell').first().locator(':scope > .cu-app-shell__frame > .cu-app-shell__tab-bar')).toHaveCount(0)

  if (end === 'phone') {
    expect(await navListDirection(root), 'phone: Navigation list is a row (tab-bar form)').toBe('row')
    expect((await frameColumns(root)).length, 'phone: single grid column').toBe(1)
    return
  }

  expect(await navListDirection(root), `${end}: Navigation list is a column (sidebar form)`).toBe('column')
  const tracks = await frameColumns(root)
  expect(tracks.length, `${end}: side column + main`).toBe(2)
}

async function openLiveShell(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const root = await liveRoot(page)
  await expect(root).toBeVisible()
  expect(page.url(), 'stay on the live shell — do not navigate via end= picker').not.toMatch(/[?&]end=/)
  return root
}

test.describe('三端一体 by size (live shell, no device picker)', () => {
  test('viewport 390 → 768 → 1280 morphs one Navigation per appendix C', async ({ page }) => {
    const root = await openLiveShell(page)

    await page.setViewportSize({ width: 390, height: 844 })
    await expect.poll(() => navListDirection(root)).toBe('row')
    await assertPhase5Chrome(root, 'phone')

    await page.setViewportSize({ width: 768, height: 844 })
    await expect.poll(() => navListDirection(root)).toBe('column')
    await assertPhase5Chrome(root, 'tablet')

    await page.setViewportSize({ width: 1280, height: 844 })
    await expect.poll(() => navListDirection(root)).toBe('column')
    await assertPhase5Chrome(root, 'desktop')

    expect(page.url()).not.toMatch(/[?&]end=/)
    await expect(page.locator('[data-three-end-pick]')).toHaveCount(0)
  })

  test('A5.3: 320px container on a 1280 viewport still shows phone Navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const root = await liveRoot(page)
    await expect(root).toBeVisible()

    await root.evaluate((element) => {
      element.style.inlineSize = '320px'
      element.style.maxInlineSize = '320px'
      element.style.width = '320px'
    })

    await expect.poll(() => navListDirection(root), { message: 'A5.3: narrow container keeps tab-bar form' }).toBe(
      'row',
    )
    await expect(chromeNav(root), 'A5.3: one Navigation still mounted').toBeVisible()
    expect(await page.evaluate(() => window.innerWidth)).toBe(1280)
  })
})
