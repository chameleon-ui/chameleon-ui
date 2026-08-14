import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function () {}
}

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/editor?theme=line')
  document.documentElement.lang = 'en'
  document.documentElement.dir = 'ltr'
  document.documentElement.dataset.theme = 'line'
})
