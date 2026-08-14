import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { useMemo } from 'react'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import zhHK from './locales/zh-HK.json'

/** Docs-site UI locales. Product ICU remains 21 in packages/components. */
export const DOCS_SITE_LOCALES = ['zh-CN', 'zh-HK', 'en'] as const
export const AUTHORED_CHROME_LOCALES = DOCS_SITE_LOCALES

export function isAuthoredChrome(locale: string): boolean {
  return (AUTHORED_CHROME_LOCALES as readonly string[]).includes(locale)
}

const authored: Record<string, unknown> = {
  en,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
}

function chromeFor(locale: string) {
  return authored[locale] ?? { _cuSkeleton: true, ...en }
}

export function getTranslator(locale: string) {
  const catalog = createCatalog(chromeFor(locale))
  const t = (key: string, values?: Record<string, string | number>) =>
    formatMessage(locale, requireMessage(catalog, key), values ?? {})
  return {
    t,
    dir: directionForLocale(locale),
    authoredChrome: isAuthoredChrome(locale),
    locale,
  }
}

export function useDocsMessages(locale: string) {
  return useMemo(() => getTranslator(locale), [locale])
}
