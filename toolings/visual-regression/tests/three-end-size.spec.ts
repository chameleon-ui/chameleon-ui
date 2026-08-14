import { expect, test, type Locator, type Page } from '@playwright/test'

/**
 * 三端一体 is proven by viewport/container size, not by clicking a device picker.
 * Live shell: default `/` (`[data-cu-shell]` or `[data-demo="adaptive"]`).
 * Phase-5 Navigation: phone TabBar; tablet sidebar+TabBar; desktop sidebar, no TabBar.
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

function chromeTabBar(root: Locator) {
  return root
    .locator('.cu-app-shell')
    .first()
    .locator(':scope > .cu-app-shell__frame > .cu-app-shell__tab-bar [data-ai-role="tab-bar"]')
}

function chromeSidebar(root: Locator) {
  return root.locator('.cu-app-shell').first().locator(':scope > .cu-app-shell__frame > .cu-app-shell__sidebar')
}

async function sidebarDisplay(root: Locator) {
  return chromeSidebar(root).evaluate((element) => getComputedStyle(element).display)
}

async function assertPhase5Chrome(root: Locator, end: End) {
  await expect(root, 'live shell is on the page').toBeVisible()
  const tabBar = chromeTabBar(root)
  await expect(tabBar, 'live shell mounts a TabBar (hidden via CSS on desktop, not omitted by a click)').toHaveCount(1)

  if (end === 'phone') {
    expect(await sidebarDisplay(root), 'phone: sidebar hidden').toBe('none')
    await expect(tabBar, 'phone: TabBar visible').toBeVisible()
    return
  }

  if (end === 'tablet') {
    expect(await sidebarDisplay(root), 'tablet: sidebar shown').toBe('block')
    await expect(tabBar, 'tablet: TabBar visible').toBeVisible()
    return
  }

  expect(await sidebarDisplay(root), 'desktop: sidebar shown').toBe('block')
  await expect(tabBar, 'desktop: TabBar hidden').toBeHidden()
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
  test('viewport 390 → 768 → 1280 morphs TabBar / sidebar per Phase-5', async ({ page }) => {
    const root = await openLiveShell(page)

    await page.setViewportSize({ width: 390, height: 844 })
    await expect.poll(() => sidebarDisplay(root)).toBe('none')
    await assertPhase5Chrome(root, 'phone')

    await page.setViewportSize({ width: 768, height: 844 })
    await expect.poll(() => sidebarDisplay(root)).toBe('block')
    await assertPhase5Chrome(root, 'tablet')

    await page.setViewportSize({ width: 1280, height: 844 })
    await expect.poll(() => sidebarDisplay(root)).toBe('block')
    await assertPhase5Chrome(root, 'desktop')

    expect(page.url()).not.toMatch(/[?&]end=/)
    await expect(page.locator('[data-three-end-pick]')).toHaveCount(0)
  })

  test('A5.3: 320px container on a 1280 viewport still shows phone chrome', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const root = await liveRoot(page)
    await expect(root).toBeVisible()

    const existingNarrow = page.locator('[data-three-end-container="narrow"] .cu-app-shell').first()
    if ((await existingNarrow.count()) > 0) {
      await expect.poll(async () => existingNarrow.locator('.cu-app-shell__sidebar').evaluate((el) => getComputedStyle(el).display)).toBe(
        'none',
      )
    }

    await root.evaluate((element) => {
      element.style.inlineSize = '320px'
      element.style.maxInlineSize = '320px'
      element.style.width = '320px'
    })

    await expect.poll(() => sidebarDisplay(root), { message: 'A5.3: narrow container hides sidebar (phone)' }).toBe(
      'none',
    )
    await expect(chromeTabBar(root), 'A5.3: narrow container keeps TabBar (phone chrome)').toBeVisible()
    expect(await page.evaluate(() => window.innerWidth)).toBe(1280)
  })
})
