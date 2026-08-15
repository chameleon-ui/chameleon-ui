import { isThemeId, themeIds, type ThemeId } from '@chameleon-ui/themes'
import { themeOverlays } from './theme-overlays.generated'

/** Injects official theme overlays scoped to `data-theme`. */
export function installThemeStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('cu-theme-overlays')) return

  const style = document.createElement('style')
  style.id = 'cu-theme-overlays'
  style.textContent = themeIds
    .map((id) => {
      const css = themeOverlays[id]
      if (!css) throw new Error(`Missing generated overlay CSS for theme "${id}". Re-run docs collect-public.`)
      return css.replaceAll(':root', `[data-theme="${id}"]`)
    })
    .join('\n')
  document.head.append(style)
}

/** Read `?theme=<id>` the same way demo color overlays switch. */
export function readThemeQuery(search: string = typeof window === 'undefined' ? '' : window.location.search): ThemeId | null {
  const value = new URLSearchParams(search).get('theme')
  return value && isThemeId(value) ? value : null
}

export function writeThemeQuery(theme: ThemeId) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set('theme', theme)
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}
