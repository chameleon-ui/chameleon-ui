/** Canonical CSS import paths for React umbrella consumers. */
export const tokensCss = '@chameleon-ui/tokens/css' as const
export const tokensDensityCss = '@chameleon-ui/tokens/density.css' as const
export const defaultThemeCss = '@chameleon-ui/themes/linear/css' as const
export const componentsCss = '@chameleon-ui/components-react/css' as const
/** Preferred single import — real CSS file after `pnpm build`. */
export const umbrellaCss = '@chameleon-ui/react/css' as const

/** Theme overlay via umbrella (baked into dist/themes). */
export function umbrellaThemeCss(
  themeId: string,
): `@chameleon-ui/react/themes/${string}/css` {
  return `@chameleon-ui/react/themes/${themeId}/css`
}

/** Same files via the themes package (also valid). */
export function themeCss(themeId: string): `@chameleon-ui/themes/${string}/css` {
  return `@chameleon-ui/themes/${themeId}/css`
}
