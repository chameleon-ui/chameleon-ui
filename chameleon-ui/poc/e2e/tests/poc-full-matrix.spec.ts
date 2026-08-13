import { expect, test, type Locator, type Page } from '@playwright/test'

const locales = ['en', 'en-XA'] as const
const directions = ['ltr', 'rtl'] as const
const widths = ['390', '768', '1280'] as const

type Locale = (typeof locales)[number]
type Direction = (typeof directions)[number]

async function setLocale(page: Page, locale: Locale) {
  await page.locator('select').first().selectOption(locale)
}

async function setDirection(page: Page, direction: Direction) {
  await page.locator(`input[name="direction"][value="${direction}"]`).check()
}

async function assertDocument(page: Page, locale: Locale, direction: Direction) {
  await expect(page.locator('html')).toHaveAttribute('lang', locale)
  await expect(page.locator('html')).toHaveAttribute('dir', direction)
}

async function assertNoAiMarkers(page: Page) {
  await expect(page.locator('[data-ai-role], [data-ai-id], [data-ai-action]')).toHaveCount(0)
}

async function assertComputedDirection(locator: Locator, direction: Direction) {
  await expect
    .poll(async () => locator.evaluate((node) => getComputedStyle(node).direction))
    .toBe(direction)
}

async function exerciseDialog(page: Page, trigger: Locator, direction: Direction) {
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await assertComputedDirection(dialog, direction)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
}

test.describe('Ark UI POC full browser matrix', () => {
  for (const locale of locales) {
    for (const direction of directions) {
      test(`${locale} / ${direction}: Button, Input, Dialog, breakpoints, portal dir, no data-ai`, async ({
        page,
      }) => {
        await page.goto('http://127.0.0.1:4173/')
        await setLocale(page, locale)
        await setDirection(page, direction)
        await assertDocument(page, locale, direction)

        const components = page.locator('.cu-components')
        const solid = components.locator('.cu-demo-card').nth(0).locator('button.cu-button--solid')
        const outline = components.locator('.cu-demo-card').nth(0).locator('button.cu-button--outline')
        await solid.click()
        await outline.focus()
        await page.keyboard.press('Enter')
        await expect(components.locator('output.cu-counter')).toContainText('2')

        const input = components.locator('.cu-demo-card').nth(1).locator('input')
        await input.fill('ab')
        await expect(components.locator('.cu-field__error')).toBeVisible()
        await input.fill('abc')
        await expect(components.locator('.cu-field__error')).toHaveCount(0)

        const trigger = components.locator('.cu-demo-card').nth(2).locator('button')
        await exerciseDialog(page, trigger, direction)

        const previews = page.locator('[data-preview-width]')
        await expect(previews).toHaveCount(3)
        for (const [index, width] of widths.entries()) {
          const preview = previews.nth(index)
          await expect(preview).toHaveAttribute('data-preview-width', width)
          await expect(preview).toHaveAttribute('lang', locale)
          await expect(preview).toHaveAttribute('dir', direction)
        }

        await assertNoAiMarkers(page)
      })
    }
  }
})

test.describe('Base UI POC full browser matrix', () => {
  for (const locale of locales) {
    for (const direction of directions) {
      test(`${locale} / ${direction}: every width plus show-all, Dialog portal dir, no data-ai`, async ({
        page,
      }) => {
        await page.goto('http://127.0.0.1:4174/')
        await setLocale(page, locale)
        await setDirection(page, direction)
        await assertDocument(page, locale, direction)

        const viewport = page.locator('.cu-controls select').nth(1)
        for (const width of widths) {
          await viewport.selectOption(width)
          const preview = page.locator('.cu-preview')
          const shell = page.locator('.cu-preview-shell')
          await expect(preview).toHaveCount(1)
          await expect(preview).toHaveAttribute('data-preview-width', width)
          await expect(shell).toHaveAttribute('dir', direction)
          await expect(shell).toHaveAttribute('lang', locale)

          const solid = preview.locator('.cu-demo-card').nth(0).locator('button.cu-button--solid')
          const before = await preview.locator('output').textContent()
          await solid.click()
          await expect(preview.locator('output')).not.toHaveText(before ?? '')

          const invalidToggle = preview.locator('.cu-check input[type="checkbox"]')
          await invalidToggle.check()
          await expect(preview.locator('.cu-field__error')).toBeVisible()
          await invalidToggle.uncheck()
          await expect(preview.locator('.cu-field__error')).toHaveCount(0)

          const trigger = preview.locator('.cu-demo-card').nth(2).locator('button')
          await exerciseDialog(page, trigger, direction)
        }

        await page.locator('.cu-check--panel input[type="checkbox"]').check()
        const allPreviews = page.locator('[data-preview-width]')
        await expect(allPreviews).toHaveCount(3)
        for (const [index, width] of widths.entries()) {
          await expect(allPreviews.nth(index)).toHaveAttribute('data-preview-width', width)
        }

        await assertNoAiMarkers(page)
      })
    }
  }
})
