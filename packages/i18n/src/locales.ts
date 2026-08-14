/** Phase 1 product locales (subset of Phase 2). */
export const PHASE_1_LOCALES = ['zh-CN', 'en', 'de', 'ar'] as const

/**
 * Phase 2 shipping locales (21). SSOT: docs/project/phases/Phase-2-开源发布.md +
 * Chameleon UI — 综合可行性研究报告 v3.0 §5.1.
 */
export const PHASE_2_LOCALES = [
  'zh-CN',
  'zh-HK',
  'ja',
  'ko',
  'ru',
  'hi',
  'en',
  'de',
  'ar',
  'ug',
  'sw',
  'ha',
  'am',
  'es',
  'fr',
  'pt',
  'bn',
  'id',
  'ur',
  'fa',
  'vi',
] as const

/** Pseudo-locale used by CI expansion gates. Not a shipping product locale. */
export const PSEUDO_LOCALE = 'en-XA' as const

export type Phase1Locale = (typeof PHASE_1_LOCALES)[number]
export type Phase2Locale = (typeof PHASE_2_LOCALES)[number]
export type SupportedLocale = Phase2Locale | typeof PSEUDO_LOCALE

/** Languages whose default document direction is RTL. */
const RTL_LANGUAGES = new Set(['ar', 'fa', 'he', 'ug', 'ur'])

/**
 * Direction comes from language, never from visual guessing.
 *
 * @complexity time O(1) | space O(1)
 * @guarantees ar/ug/ur/fa (and other RTL languages) map to rtl; everything else is ltr
 */
export function directionForLocale(locale: string): 'ltr' | 'rtl' {
  const normalized = locale.trim().toLowerCase()
  const language = normalized.split('-')[0] ?? normalized
  return RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr'
}

export function isPhase1Locale(locale: string): locale is Phase1Locale {
  return (PHASE_1_LOCALES as readonly string[]).includes(locale)
}

export function isPhase2Locale(locale: string): locale is Phase2Locale {
  return (PHASE_2_LOCALES as readonly string[]).includes(locale)
}
