import { describe, expect, it } from 'vitest'
import IntlMessageFormat from 'intl-messageformat'
import { formatMessage, getMessages } from './i18n'
import { expandPseudoMessage, validatePseudoExpansion } from './pseudo-locale'

function flattenMessages(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') {
    return { [prefix]: value }
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
      Object.entries(flattenMessages(nested, prefix ? `${prefix}.${key}` : key)),
    ),
  )
}

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
    const message = getMessages('en').button.count

    expect(formatMessage('en', message, { count: 0 })).toBe('No actions completed')
    expect(formatMessage('en', message, { count: 1 })).toBe('1 action completed')
    expect(formatMessage('en', message, { count: 2 })).toBe('2 actions completed')
  })

  it('formats select branches and preserves pseudo-locale expansion', () => {
    expect(
      formatMessage('en', getMessages('en').icu.direction, { direction: 'rtl' }),
    ).toBe('Right-to-left preview')
    expect(
      formatMessage('en-XA', getMessages('en-XA').button.count, { count: 2 }),
    ).toMatch(/2 åçţîöñš/)
  })

  it('keeps pseudo-locale keys and ICU arguments aligned', () => {
    const english = flattenMessages(getMessages('en'))
    const pseudo = flattenMessages(getMessages('en-XA'))

    expect(Object.keys(pseudo).sort()).toEqual(Object.keys(english).sort())
    for (const key of Object.keys(english)) {
      expect(argumentNames(pseudo[key])).toEqual(argumentNames(english[key]))
      expect(pseudo[key]).not.toBe(english[key])
    }
  })

  it('expands every visible ICU branch by at least 40 percent', () => {
    const english = flattenMessages(getMessages('en'))
    const pseudo = flattenMessages(getMessages('en-XA'))
    const issues = validatePseudoExpansion(
      english,
      pseudo,
    )

    expect(issues, JSON.stringify(issues, null, 2)).toEqual([])
    expect(expandPseudoMessage('test', '[ţéšţ]')).toBe(
      expandPseudoMessage('test', '[ţéšţ]'),
    )
  })

  it('fails readably when a required ICU value is missing', () => {
    expect(() => formatMessage('en', getMessages('en').button.count)).toThrow(/count/i)
  })
})
