import {
  createCatalog,
  directionForLocale,
  formatMessage,
  isPhase2Locale,
  requireMessage,
  type Phase2Locale,
  type PrimitiveMessageValue,
} from '@chameleon-ui/i18n'
import { isThemeId, type ThemeId } from '@chameleon-ui/themes'
import { useMemo } from 'react'
import arChrome from './locales/ar.json'
import deChrome from './locales/de.json'
import enChrome from './locales/en.json'
import zhChrome from './locales/zh-CN.json'

const chromeByLocale = {
  'zh-CN': zhChrome,
  en: enChrome,
  de: deChrome,
  ar: arChrome,
} as const

const componentLocaleModules = import.meta.glob(
  '../../../packages/components/src/*/locales/*.json',
  { eager: true, import: 'default' },
) as Record<string, Record<string, unknown>>

function chromeFor(locale: Phase2Locale) {
  return locale in chromeByLocale
    ? chromeByLocale[locale as keyof typeof chromeByLocale]
    : chromeByLocale.en
}

function componentMessagesFor(locale: Phase2Locale) {
  const merged: Record<string, unknown> = {}
  const suffix = `/locales/${locale}.json`
  for (const [modulePath, messages] of Object.entries(componentLocaleModules)) {
    if (!modulePath.replaceAll('\\', '/').endsWith(suffix)) continue
    Object.assign(merged, messages)
  }
  return merged
}

export function readLocaleParam(value: string | null): Phase2Locale {
  return value && isPhase2Locale(value) ? value : 'en'
}

export function readThemeParam(value: string | null): ThemeId {
  return value && isThemeId(value) ? value : 'line'
}

export type DemoView = 'live' | 'gallery' | 'suite' | 'lab' | 'blind' | 'three-end' | 'three-end-stage'
export type LabCase = 'narrow' | 'wide' | 'native'

const DEMO_VIEWS: DemoView[] = ['live', 'gallery', 'suite', 'lab', 'blind', 'three-end', 'three-end-stage']

export function readViewParam(value: string | null): DemoView {
  if (value && DEMO_VIEWS.includes(value as DemoView)) return value as DemoView
  return 'live'
}

export function readLabParam(value: string | null): LabCase {
  if (value === 'narrow' || value === 'wide') return value
  return 'native'
}

export function useDemoMessages(locale: Phase2Locale) {
  const catalog = useMemo(
    () => createCatalog({ ...chromeFor(locale), ...componentMessagesFor(locale) }),
    [locale],
  )

  return useMemo(() => {
    const t = (key: string, values?: Record<string, PrimitiveMessageValue>) =>
      formatMessage(locale, requireMessage(catalog, key), values ?? {})
    return { t, dir: directionForLocale(locale) }
  }, [catalog, locale])
}
