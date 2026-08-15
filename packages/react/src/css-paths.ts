/** Stable CSS specifier strings for docs / agents (not side-effect imports). */
export const tokensCss = '@chameleon-ui/tokens/css' as const
export const tokensDensityCss = '@chameleon-ui/tokens/density.css' as const
export const defaultThemeCss = '@chameleon-ui/themes/line/css' as const
export const umbrellaCss = '@chameleon-ui/react/css' as const

export function themeCss(themeId: string): `@chameleon-ui/themes/${string}/css` {
  return `@chameleon-ui/themes/${themeId}/css`
}
