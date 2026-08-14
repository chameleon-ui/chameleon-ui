import { describe, expect, it } from 'vitest'
import IntlMessageFormat from 'intl-messageformat'
import en from './fixtures/en.json'
import enXA from './fixtures/en-XA.json'
import {
  createCatalog,
  directionForLocale,
  expandPseudoMessage,
  expandPseudoMessages,
  flattenMessages,
  formatMessage,
  getMessage,
  measureLiteralExpansion,
  meetsExpansion,
  PHASE_1_LOCALES,
  PHASE_2_LOCALES,
  requireMessage,
  validatePseudoExpansion,
} from './index.js'

function argumentNames(message: string) {
  const names = new Set<string>()

  function visit(elements: ReturnType<IntlMessageFormat['getAst']>) {
    for (const element of elements) {
      if ('value' in element && !('children' in element) && element.type !== 0) {
        names.add(element.value)
      }
      if ('options' in element) {
        for (const option of Object.values(element.options)) {
          visit(option.value)
        }
      }
      if ('children' in element) {
        visit(element.children)
      }
    }
  }

  visit(new IntlMessageFormat(message, 'en').getAst())
  return [...names].sort()
}

describe('@chameleon-ui/i18n', () => {
  it('maps Phase 1 and Phase 2 locales to document direction from language', () => {
    expect(PHASE_1_LOCALES).toEqual(['zh-CN', 'en', 'de', 'ar'])
    expect(PHASE_2_LOCALES).toHaveLength(21)
    expect(PHASE_2_LOCALES).toContain('zh-HK')
    expect(PHASE_2_LOCALES).toContain('vi')
    expect(directionForLocale('zh-CN')).toBe('ltr')
    expect(directionForLocale('en')).toBe('ltr')
    expect(directionForLocale('de')).toBe('ltr')
    expect(directionForLocale('ar')).toBe('rtl')
    expect(directionForLocale('ar-EG')).toBe('rtl')
    expect(directionForLocale('ug')).toBe('rtl')
    expect(directionForLocale('ur')).toBe('rtl')
    expect(directionForLocale('fa')).toBe('rtl')
    expect(directionForLocale('ja')).toBe('ltr')
  })

  it('looks up flattened keys through a Map rather than scanning packs', () => {
    const catalog = createCatalog(en)
    expect(catalog).toBeInstanceOf(Map)
    expect(getMessage(catalog, 'button.count')).toBe(en.button.count)
    expect(getMessage(catalog, 'missing')).toBeUndefined()
    expect(requireMessage(catalog, 'common.cancel')).toBe('Cancel')
    expect(() => requireMessage(catalog, 'missing.key')).toThrow(/Path: missing\.key/)
  })

  it('formats ICU plural and select branches', () => {
    expect(formatMessage('en', en.button.count, { count: 0 })).toBe('No actions completed')
    expect(formatMessage('en', en.button.count, { count: 1 })).toBe('1 action completed')
    expect(formatMessage('en', en.button.count, { count: 2 })).toBe('2 actions completed')
    expect(formatMessage('en', en.icu.direction, { direction: 'rtl' })).toBe(
      'Right-to-left preview',
    )
  })

  it('expands en-XA ICU literals to at least 140 percent without replaceAll', () => {
    const english = flattenMessages(en)
    const pseudo = flattenMessages(enXA)
    const expanded = expandPseudoMessages(english, pseudo, 1.4)
    const issues = validatePseudoExpansion(english, expanded, 1.4)

    expect(Object.keys(pseudo).sort()).toEqual(Object.keys(english).sort())
    for (const key of Object.keys(english)) {
      expect(argumentNames(pseudo[key])).toEqual(argumentNames(english[key]))
      expect(pseudo[key]).not.toBe(english[key])
    }
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([])
    expect(expandPseudoMessage('test', '[ţéšţ]')).toBe(expandPseudoMessage('test', '[ţéšţ]'))
    expect(formatMessage('en-XA', expanded['button.count'], { count: 2 })).toMatch(/2 åçţîöñš/)
  })

  it('measures German-style +35 percent expansion on the C10 path', () => {
    const english = 'Save changes'
    const germanStress = 'Änderungen speichern~~~~'
    expect(measureLiteralExpansion(english, germanStress).ratio).toBeGreaterThanOrEqual(1.35)
    expect(meetsExpansion(english, germanStress, 1.35)).toBe(true)
    expect(meetsExpansion(english, 'Save', 1.35)).toBe(false)
  })

  it('fails readably when a required ICU value is missing', () => {
    expect(() => formatMessage('en', en.button.count)).toThrow(/count/i)
  })
})
