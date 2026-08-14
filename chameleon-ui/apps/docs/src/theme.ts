import antBlueCss from '@chameleon-ui/themes/ant-blue/css?raw'
import corsaCss from '@chameleon-ui/themes/corsa/css?raw'
import cupertinoCss from '@chameleon-ui/themes/cupertino/css?raw'
import lineCss from '@chameleon-ui/themes/line/css?raw'
import silverArrowCss from '@chameleon-ui/themes/silver-arrow/css?raw'
import sirenCss from '@chameleon-ui/themes/siren/css?raw'
import stuttgartCss from '@chameleon-ui/themes/stuttgart/css?raw'
import wechatCss from '@chameleon-ui/themes/wechat/css?raw'
import { isThemeId, themeIds, type ThemeId } from '@chameleon-ui/themes'

const rawById: Record<ThemeId, string> = {
  line: lineCss,
  'silver-arrow': silverArrowCss,
  stuttgart: stuttgartCss,
  corsa: corsaCss,
  cupertino: cupertinoCss,
  siren: sirenCss,
  wechat: wechatCss,
  'ant-blue': antBlueCss,
}

/** Injects official theme overlays scoped to `data-theme`. */
export function installThemeStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('cu-theme-overlays')) return

  const style = document.createElement('style')
  style.id = 'cu-theme-overlays'
  style.textContent = themeIds
    .map((id) => rawById[id].replaceAll(':root', `[data-theme="${id}"]`))
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
