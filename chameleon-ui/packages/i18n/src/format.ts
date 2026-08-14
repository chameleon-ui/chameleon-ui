import IntlMessageFormat from 'intl-messageformat'

export type PrimitiveMessageValue = string | number | boolean | Date | null | undefined

const formatterCache = new Map<string, IntlMessageFormat>()

function toFormattingLocale(locale: string) {
  return locale === 'en-XA' ? 'en' : locale
}

/**
 * Formats an ICU MessageFormat string. Parsers are cached by locale+message.
 *
 * @complexity time O(m) first parse, O(v) cached format | space O(k * m)
 *   m = ICU message length, v = value count, k = distinct messages
 * @guarantees real plural/select/interpolation; missing required values throw
 * @phase-1 shared i18n runtime migrated from poc/ark-ui
 */
export function formatMessage(
  locale: string,
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
