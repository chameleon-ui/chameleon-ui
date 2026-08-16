import { directionForLocale } from '@chameleon-ui/i18n'
import { useLayoutEffect, type ReactNode } from 'react'

const THEME_IDS = [
  'linear',
  'mercedes',
  'porsche',
  'ferrari',
  'apple',
  'tiktok',
  'wechat',
  'alipay',
] as const

export type ThemeId = (typeof THEME_IDS)[number]
export type ThemeDensity = 'compact' | 'standard' | 'comfortable'
export type ThemeColorScheme = 'dark' | 'light'

const OVERLAY_STYLE_ID = 'cu-theme-overlays'

export interface ThemeProviderProps {
  theme: ThemeId
  density?: ThemeDensity
  /**
   * Manual dark / light switch. Omit to use the theme's default scheme
   * (linear defaults to dark). Schemes ship per theme as
   * `[data-color-scheme]` overrides inside the theme CSS.
   */
  colorScheme?: ThemeColorScheme
  locale?: string
  /**
   * Raw CSS keyed by theme id (`import "@chameleon-ui/themes/<id>/css?raw"`).
   * When set, overlays are scoped to `[data-theme]` so only the active theme
   * paints. Omit this and import one `themes/<id>/css` for a single-skin app.
   *
   * Same contract as `@chameleon-ui/themes` `installThemeOverlays`.
   */
  overlays?: Partial<Record<ThemeId, string>>
  children: ReactNode
}

function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value)
}

export function ThemeProvider({ theme, density, colorScheme, locale, overlays, children }: ThemeProviderProps) {
  useLayoutEffect(() => {
    if (typeof document === 'undefined' || !isThemeId(theme)) return
    const root = document.documentElement
    root.dataset.theme = theme
    if (density) root.dataset.density = density
    else delete root.dataset.density
    if (colorScheme) root.dataset.colorScheme = colorScheme
    else delete root.dataset.colorScheme
    if (locale) {
      root.lang = locale
      root.dir = directionForLocale(locale)
    }
    if (overlays) {
      let style = document.getElementById(OVERLAY_STYLE_ID)
      if (!style) {
        style = document.createElement('style')
        style.id = OVERLAY_STYLE_ID
        document.head.append(style)
      }
      style.textContent = (Object.entries(overlays) as Array<[ThemeId, string | undefined]>)
        .filter((entry): entry is [ThemeId, string] => typeof entry[1] === 'string' && isThemeId(entry[0]))
        .map(([id, css]) => css.replaceAll(':root', `[data-theme="${id}"]`))
        .join('\n')
    }
  }, [theme, density, colorScheme, locale, overlays])

  return children
}

export function useDocumentTheme(): ThemeId | null {
  if (typeof document === 'undefined') return null
  const value = document.documentElement.dataset.theme
  return value && isThemeId(value) ? value : null
}
