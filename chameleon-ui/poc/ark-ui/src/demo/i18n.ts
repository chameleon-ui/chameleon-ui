import IntlMessageFormat from 'intl-messageformat'
import en from './locales/en.json'
import enXA from './locales/en-XA.json'
import { expandPseudoMessages } from './pseudo-locale'

export type Locale = 'en' | 'en-XA'

export interface Messages {
  app: {
    eyebrow: string
    title: string
    description: string
  }
  controls: {
    kicker: string
    heading: string
    locale: string
    english: string
    pseudo: string
    direction: string
    ltr: string
    rtl: string
  }
  button: {
    componentName: string
    solid: string
    outline: string
    count: string
  }
  input: {
    componentName: string
    label: string
    placeholder: string
    invalid: string
  }
  dialog: {
    componentName: string
    trigger: string
    title: string
    description: string
    close: string
    body: string
  }
  breakpoints: {
    title: string
    description: string
    viewport: string
  }
  notes: {
    kicker: string
    title: string
    keyboard: string
    telemetry: string
    migration: string
  }
  icu: {
    direction: string
  }
  components: {
    kicker: string
    title: string
  }
}

function flattenMessages(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
      Object.entries(flattenMessages(nested, prefix ? `${prefix}.${key}` : key)),
    ),
  )
}

function expandMessageTree<T extends Record<string, unknown>>(
  value: T,
  expanded: Record<string, string>,
  prefix = '',
): T {
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => {
      const path = prefix ? `${prefix}.${key}` : key
      return [key, typeof nested === 'string' ? expanded[path] : expandMessageTree(nested as T, expanded, path)]
    }),
  ) as T
}

const expandedPseudo = expandPseudoMessages(flattenMessages(en), flattenMessages(enXA))

const dictionaries: Record<Locale, Messages> = {
  en,
  'en-XA': expandMessageTree(enXA, expandedPseudo),
}

type PrimitiveMessageValue = string | number | boolean | Date | null | undefined

const formatterCache = new Map<string, IntlMessageFormat>()

function toFormattingLocale(locale: Locale) {
  return locale === 'en-XA' ? 'en' : locale
}

/**
 * @complexity time O(1) expected | space O(1) | locale count is fixed in Phase 0
 * @guarantees stable-key lookup with an explicit English fallback
 */
export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.en
}

/**
 * Phase 0 ICU skeleton. The pseudo-locale deliberately uses English CLDR rules
 * while preserving its visibly expanded message text.
 *
 * @complexity time O(m) on the first parse and O(v) for cached formatting |
 * space O(k * m) | m = ICU message length, v = value count, k = distinct messages
 * @guarantees ICU plural/select/interpolation support without creating the Phase 1 i18n package
 * @phase-1 migrate → packages/i18n with shared formatter bounds and locale data
 */
export function formatMessage(
  locale: Locale,
  message: string,
  values: Record<string, PrimitiveMessageValue> = {},
) {
  const cacheKey = `${locale}\u0000${message}`
  let formatter = formatterCache.get(cacheKey)

  if (!formatter) {
    formatter = new IntlMessageFormat(message, toFormattingLocale(locale))
    formatterCache.set(cacheKey, formatter)
  }

  return String(formatter.format(values))
}
