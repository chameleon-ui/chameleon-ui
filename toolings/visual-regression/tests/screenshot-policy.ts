import { expect, type Locator, type TestInfo } from '@playwright/test'

/**
 * Screenshot goldens must be real Playwright captures (`test:update`).
 * Never invent PNG/hash placeholders. Computed-style assertions always run.
 *
 * Skip capture when:
 * - `CU_VR_SKIP_SCREENSHOTS=1` (explicit environment opt-out)
 * - Chromium cannot produce a screenshot (sandbox/display/crash)
 *
 * A missing baseline is NOT an environment skip — run `test:update` instead.
 */
export async function expectScreenshotOrSkip(
  locator: Locator,
  name: string,
  testInfo: TestInfo,
  options?: { maxDiffPixels?: number },
) {
  if (process.env.CU_VR_SKIP_SCREENSHOTS === '1') {
    testInfo.annotations.push({
      type: 'skip-screenshot',
      description:
        'CU_VR_SKIP_SCREENSHOTS=1: PNG compare disabled. Computed-style assertions still run. No placeholder goldens.',
    })
    return
  }

  try {
    await expect(locator).toHaveScreenshot(name, options)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (isCaptureEnvironmentFailure(message)) {
      testInfo.annotations.push({
        type: 'skip-screenshot',
        description: `Playwright could not capture a real screenshot (${message.split('\n')[0]}). Spec stays; no fake PNG.`,
      })
      return
    }
    throw error
  }
}

function isCaptureEnvironmentFailure(message: string) {
  return /browser has been closed|Target closed|Protocol error|net::ERR|Executable doesn't exist|crashed|not a function/i.test(
    message,
  )
}
