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
  window.history.replaceState(null, '', '/')
  document.documentElement.lang = 'en'
  document.documentElement.dir = 'ltr'
  document.documentElement.dataset.theme = 'line'
  document.documentElement.classList.remove(
    'cu-demo-vr',
    'cu-demo-lab',
    'cu-demo-blind',
    'cu-demo-three-end',
    'cu-demo-three-end-stage',
    'cu-demo-adaptive',
  )
  delete document.documentElement.dataset.labCase
  delete document.documentElement.dataset.end
})
