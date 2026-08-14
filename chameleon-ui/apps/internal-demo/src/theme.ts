import antBlueCss from '@chameleon-ui/themes/ant-blue/css?raw'
import corsaCss from '@chameleon-ui/themes/corsa/css?raw'
import cupertinoCss from '@chameleon-ui/themes/cupertino/css?raw'
import lineCss from '@chameleon-ui/themes/line/css?raw'
import silverArrowCss from '@chameleon-ui/themes/silver-arrow/css?raw'
import sirenCss from '@chameleon-ui/themes/siren/css?raw'
import stuttgartCss from '@chameleon-ui/themes/stuttgart/css?raw'
import wechatCss from '@chameleon-ui/themes/wechat/css?raw'
import { themeIds, type ThemeId } from '@chameleon-ui/themes'

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

/** Injects official theme overlays scoped to `data-theme`, so the demo can switch without a reload. */
export function installThemeStyles() {
  if (document.getElementById('cu-theme-overlays')) return

  const style = document.createElement('style')
  style.id = 'cu-theme-overlays'
  style.textContent = themeIds
    .map((id) => rawById[id].replaceAll(':root', `[data-theme="${id}"]`))
    .join('\n')
  document.head.append(style)
}
