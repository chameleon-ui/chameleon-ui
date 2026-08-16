import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { directionForLocale } from '@chameleon-ui/i18n'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'

if (typeof ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function () {
    // no-op polyfill for jsdom
  }
}

afterEach(() => {
  cleanup()
  document.documentElement.lang = 'en'
  document.documentElement.dir = directionForLocale('en')
})
