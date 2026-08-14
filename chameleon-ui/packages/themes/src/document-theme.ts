import { isThemeId, type ThemeId } from './ids.js'

export type ThemeDensity = 'compact' | 'standard' | 'comfortable'

export const THEME_OVERLAY_STYLE_ID = 'cu-theme-overlays'

/**
 * Rewrite a theme overlay that targets `:root` so it only applies when
 * `html[data-theme="<id>"]` is set. Used for runtime switching without stacking
 * multiple `:root` sheets.
 */
export function scopeThemeCss(css: string, id: ThemeId): string {
  return css.replaceAll(':root', `[data-theme="${id}"]`)
}

export interface ApplyDocumentThemeOptions {
  density?: ThemeDensity
  locale?: string
  dir?: 'ltr' | 'rtl'
}

/**
 * Official runtime switch: `data-theme` (+ optional density / lang / dir).
 * Load CSS separately — either one static `themes/<id>/css` import, or
 * {@link installThemeOverlays} for multi-theme apps.
 */
export function applyDocumentTheme(theme: ThemeId, options: ApplyDocumentThemeOptions = {}): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.theme = theme
  if (options.density) {
    root.dataset.density = options.density
  } else {
    delete root.dataset.density
  }
  if (options.locale) {
    root.lang = options.locale
  }
  if (options.dir) {
    root.dir = options.dir
  }
}

/**
 * Inject scoped overlays for every provided theme id. Call once; later theme
 * changes only need {@link applyDocumentTheme}. Prefer this over preloading
 * eight `:root` stylesheets.
 */
export function installThemeOverlays(
  cssById: Partial<Record<ThemeId, string>>,
  styleId: string = THEME_OVERLAY_STYLE_ID,
): void {
  if (typeof document === 'undefined') return
  let style = document.getElementById(styleId)
  if (!style) {
    style = document.createElement('style')
    style.id = styleId
    document.head.append(style)
  }
  style.textContent = (Object.entries(cssById) as Array<[ThemeId, string | undefined]>)
    .filter((entry): entry is [ThemeId, string] => typeof entry[1] === 'string' && isThemeId(entry[0]))
    .map(([id, css]) => scopeThemeCss(css, id))
    .join('\n')
}
