const THEME_IDS = [
  'line',
  'silver-arrow',
  'stuttgart',
  'corsa',
  'cupertino',
  'siren',
  'wechat',
  'ant-blue',
] as const

export type ThemeId = (typeof THEME_IDS)[number]
export type ThemeDensity = 'compact' | 'standard' | 'comfortable'

export interface ThemeProviderProps {
  theme: ThemeId
  density?: ThemeDensity
  locale?: string
  /**
   * Raw CSS keyed by theme id (`import "@chameleon-ui/themes/<id>/css?raw"`).
   * When set, overlays are scoped to `[data-theme]` so only the active theme
   * paints. Omit this and import one `themes/<id>/css` for a single-skin app.
   */
  overlays?: Partial<Record<ThemeId, string>>
}

export function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value)
}

export function useDocumentTheme(): ThemeId | null {
  if (typeof document === 'undefined') return null
  const value = document.documentElement.dataset.theme
  return value && isThemeId(value) ? value : null
}

export const OVERLAY_STYLE_ID = 'cu-theme-overlays'
