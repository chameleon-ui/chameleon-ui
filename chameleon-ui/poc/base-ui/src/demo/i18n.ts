import IntlMessageFormat from 'intl-messageformat'
import en from './locales/en.json'
import enXA from './locales/en-XA.json'
import { expandPseudoMessages } from './pseudo-locale'

export type Locale = 'en' | 'en-XA'
export type TextDirection = 'ltr' | 'rtl'

const expandedPseudo = expandPseudoMessages(en, enXA)

const messages = {
  en,
  'en-XA': expandedPseudo as typeof enXA,
} as const

export type MessageKey = keyof typeof en

type PrimitiveMessageValue = string | number | boolean | Date | null | undefined

const formatterCache = new Map<string, IntlMessageFormat>()

function toFormattingLocale(locale: Locale) {
  return locale === 'en-XA' ? 'en' : locale
}

/**
 * @complexity time O(m) on the first parse and O(v) for cached formatting |
 * space O(k * m) | m = ICU message length, v = value count, k = distinct messages
 * @guarantees known locale/key plus ICU interpolation, plural, and select semantics
 * @phase-1 migrate → packages/i18n with the same BCP 47 locale ids
 */
export function translate(
  locale: Locale,
  key: MessageKey,
  parameters: Record<string, PrimitiveMessageValue> = {},
) {
  const message: string = messages[locale][key]
  const cacheKey = `${locale}\u0000${key}`
  let formatter = formatterCache.get(cacheKey)

  if (!formatter) {
    formatter = new IntlMessageFormat(message, toFormattingLocale(locale))
    formatterCache.set(cacheKey, formatter)
  }

  return String(formatter.format(parameters))
}
