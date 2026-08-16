/** Phase 2 theme ids — SSOT: 综合可行性研究报告 v3.0 §6.2 (folder names without theme- prefix). */

export const themeIds = [
  'linear',
  'mercedes',
  'porsche',
  'ferrari',
  'apple',
  'tiktok',
  'wechat',
  'alipay',
] as const

/** Community discipline packs (Phase 4) — not homage theme ids. */
export const communityRulesPackIds = ['community-focus-first'] as const

export type CommunityRulesPackId = (typeof communityRulesPackIds)[number]

export type ThemeId = (typeof themeIds)[number]

export function isThemeId(value: string): value is ThemeId {
  return (themeIds as readonly string[]).includes(value)
}
