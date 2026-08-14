import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Space } from './Space.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Space', () => {
  it('renders a presentational spacer with cu-* classes and data-ai-role', () => {
    const { container } = render(<Space size="lg" axis="inline" />)
    const element = container.querySelector('.cu-space')
    expect(element).toHaveClass('cu-space', 'cu-space--lg')
    expect(element).toHaveAttribute('data-ai-role', 'space')
    expect(element).toHaveAttribute('data-ai-intent', 'layout-flow')
    expect(element).toHaveAttribute('data-ai-state', 'inline')
    expect(element).toHaveAttribute('aria-hidden', 'true')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'space.label')).toBeDefined()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)
    render(<Space />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(copy.get('space.label')).toBe('مسافة')
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('space.label')).toBe('Space')
    expect(createCatalog(de).get('space.label')).toBe('Abstandselement')
    expect(createCatalog(zhCN).get('space.label')).toBe('间距')
  })
})
