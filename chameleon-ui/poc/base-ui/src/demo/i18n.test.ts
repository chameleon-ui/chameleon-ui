import { describe, expect, it } from 'vitest'
import IntlMessageFormat from 'intl-messageformat'
import { translate } from './i18n'
import en from './locales/en.json'
import enXA from './locales/en-XA.json'
import { expandPseudoMessage, expandPseudoMessages, validatePseudoExpansion } from './pseudo-locale'

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

describe('Phase 0 ICU skeleton', () => {
  it('formats interpolation and CLDR plural branches', () => {
    expect(translate('en', 'button.count', { count: 0 })).toBe('No activations')
    expect(translate('en', 'button.count', { count: 1 })).toBe('1 activation')
    expect(translate('en', 'button.count', { count: 2 })).toBe('2 activations')
  })

  it('formats select branches and preserves pseudo-locale expansion', () => {
    expect(translate('en', 'preview.direction', { direction: 'rtl' })).toBe(
      'Right-to-left preview',
    )
    expect(translate('en-XA', 'button.count', { count: 2 })).toMatch(/2 áçţíṽáţíóñş/)
  })

  it('keeps pseudo-locale keys and ICU arguments aligned', () => {
    expect(Object.keys(enXA).sort()).toEqual(Object.keys(en).sort())
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(argumentNames(enXA[key])).toEqual(argumentNames(en[key]))
      expect(enXA[key]).not.toBe(en[key])
    }
  })

  it('expands every visible ICU branch by at least 40 percent', () => {
    const pseudo = expandPseudoMessages(en, enXA)
    const issues = validatePseudoExpansion(en, pseudo)

    expect(issues, JSON.stringify(issues, null, 2)).toEqual([])
    expect(expandPseudoMessage('test', '⟦ţéşţ⟧')).toBe(
      expandPseudoMessage('test', '⟦ţéşţ⟧'),
    )
  })

  it('fails readably when a required ICU value is missing', () => {
    expect(() => translate('en', 'button.count')).toThrow(/count/i)
  })
})
