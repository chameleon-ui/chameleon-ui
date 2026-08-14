import { flattenMessages } from './flatten.js'

/** C3 catalog: hash/Map lookup on the hot path. */
export type MessageCatalog = Map<string, string>

/**
 * Builds a Map catalog from nested or flat message JSON.
 *
 * @complexity time O(n) build | space O(n) | n = message count
 * @guarantees later getMessage is Map.get, never a full-table scan
 */
export function createCatalog(messages: unknown): MessageCatalog {
  const catalog: MessageCatalog = new Map()
  for (const [key, value] of Object.entries(flattenMessages(messages))) {
    catalog.set(key, value)
  }
  return catalog
}

/**
 * @complexity time O(1) expected | space O(1) | n = catalog size
 * @guarantees C3 Map lookup; missing keys return undefined
 */
export function getMessage(catalog: MessageCatalog, key: string): string | undefined {
  return catalog.get(key)
}

/**
 * @complexity time O(1) expected | space O(1)
 * @guarantees U9 errors include path, reason, and next step
 */
export function requireMessage(catalog: MessageCatalog, key: string): string {
  const message = catalog.get(key)
  if (message === undefined) {
    throw new Error(
      [
        'i18n lookup failed.',
        `Path: ${key}`,
        'Reason: the catalog does not contain this key.',
        'Next: add the key to the component locales file or pass the correct catalog.',
      ].join('\n'),
    )
  }
  return message
}
